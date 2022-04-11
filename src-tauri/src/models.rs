use serde::{self, Deserialize, Serialize};


#[derive(Deserialize, Serialize)]
pub struct HttpResponse {
    pub body: String,
    pub status_code: u16,
    pub time: u64,
    pub success: bool
} // we build our own struct so we can send it to our frontend
// with tauri