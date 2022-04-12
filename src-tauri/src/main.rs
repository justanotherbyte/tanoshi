#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod models;

use std::str::FromStr;
use std::fs::File;
use std::path::Path;
use std::io::{Read, Write, SeekFrom, Seek};

use reqwest::{Url, header::{HeaderMap, HeaderName, HeaderValue}};
use serde_json::json;

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![make_request, add_query_parameters, append_history_store, read_history])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn make_request(method: String, url: String, headers: Vec<(String, String)>) -> models::HttpResponse {
    let client = reqwest::Client::new();
    let method = reqwest::Method::from_str(&method).unwrap();

    let mut header_map= HeaderMap::default();

    for (header, value) in headers {
        let name = HeaderName::from_str(&header).unwrap();
        let h_value = HeaderValue::from_str(&value).unwrap();
        header_map.insert(name, h_value);
    }

    let builder = client.request(method, url)
        .headers(header_map);
    let request = builder.build().unwrap();

    let start_time = std::time::Instant::now();
    let response = client.execute(request).await.unwrap();
    let elapsed = start_time.elapsed();
    let time = elapsed.as_secs();
    
    // deconstruct our response and build our own
    // model

    let success;

    match response.error_for_status_ref() {
        Ok(_) => {
            success = true;
        },
        Err(_) => {
            success = false;
        }
    }

    let status_code = response.status().as_u16();
    let body: String = response.text().await.unwrap();
    
    models::HttpResponse {
        body,
        status_code,
        time,
        success
    }
}

#[tauri::command]
fn add_query_parameters(url: String, parameters: Vec<(String, String)>) -> String {
    let parsed = Url::parse_with_params(&url, parameters)
        .unwrap()
        .as_str()
        .to_owned();

    parsed
}

#[tauri::command]
fn append_history_store(app_dir: String, name: String, url: String, time: String, method: String) {
    println!("append history store called");

    let path = Path::new(&app_dir);
    let buf = path.join(name);
    
    let path_str = buf.to_str().unwrap();
    println!("{}", path_str);
    let mut file = File::options().create(true).read(true).write(true).append(false).open(path_str).unwrap();
    let mut read_buf = String::new();
    file.read_to_string(&mut read_buf).unwrap();

    if read_buf.as_str() == "" {
        println!("Empty");
        let temp = json!({
            "entries": []
        });
        let temp_string = temp.to_string();
        read_buf = temp_string;
    }
    
    let entry = models::RequestHistoryEntry {
        url,
        time,
        method
    };

    let mut history: models::RequestHistory = serde_json::from_str(&read_buf).unwrap();

    if !history.entries.contains(&entry) {
        history.entries.push(entry);
    };
    let history_string = serde_json::to_string(&history).unwrap();
    println!("{}", history_string);
    let history_bytes = history_string.as_bytes();
    file.seek(SeekFrom::Start(0)).unwrap();
    let _ = file.write(history_bytes).unwrap();
}

#[tauri::command]
fn read_history(app_dir: String, name: String) -> Vec<models::RequestHistoryEntry> {
    let path = Path::new(&app_dir);
    let buf = path.join(name);
    let path_str = buf.to_str().unwrap();

    let mut file = File::options().create(true).read(true).write(true).open(path_str).unwrap(); // we need write for create to work
    let mut read_buf = String::new();
    file.read_to_string(&mut read_buf).unwrap();
    
    if read_buf.as_str() == "" {
        return vec![];
    } else {
        let history: models::RequestHistory = serde_json::from_str(&read_buf).unwrap();
        history.entries
    }
}