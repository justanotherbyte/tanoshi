#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod models;

use std::{str::FromStr, io::Write};

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![make_request])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn make_request(method: String, url: String) -> models::HttpResponse {
    let client = reqwest::Client::new();
    let method = reqwest::Method::from_str(&method).unwrap();
    let builder = client.request(method, url);
    let request = builder.build().unwrap();

    let start_time = std::time::Instant::now();
    let response = client.execute(request).await.unwrap();
    let elapsed = start_time.elapsed();
    let time = elapsed.as_secs();
    
    // deconstruct our response and build our own
    // model

    let success: bool;

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