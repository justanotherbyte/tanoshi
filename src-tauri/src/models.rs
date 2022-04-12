use serde::{self, Deserialize, Serialize};


#[derive(Deserialize, Serialize)]
pub struct HttpResponse {
    pub body: String,
    pub status_code: u16,
    pub time: u64,
    pub success: bool
} // we build our own struct so we can send it to our frontend
// with tauri

#[derive(Deserialize, Serialize)]
pub struct RequestHistoryEntry {
    pub time: String,
    pub url: String,
    pub method: String
}

#[derive(Deserialize, Serialize)]
pub struct RequestHistory {
    pub entries: Vec<RequestHistoryEntry>
}

impl std::cmp::PartialEq<RequestHistoryEntry> for RequestHistoryEntry {
    fn eq(&self, other: &RequestHistoryEntry) -> bool {
        other.method == self.method && other.url == self.url
    }
}