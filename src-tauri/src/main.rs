#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![make_request])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn make_request(url: String) {
    let message = format!("JS wants to make a request to: {}", url);
    println!("{}", message);
}