mod security;
mod storage; 
use storage::Link;

// 1. Password Logic
#[tauri::command]
fn generate_password(master: String, url: String, username: String) -> String {
    match security::calculate_pass(&master, &url, &username) {
        Ok(pass) => pass,
        Err(e) => format!("Backend Error: {}", e),
    }
}

// 2. Link Manager Logic
#[tauri::command]
fn save_link(title: String, url: String, username: String) -> Result<Vec<Link>, String> {
    storage::add_link(title, url, username)
}

#[tauri::command]
fn get_links() -> Result<Vec<Link>, String> {
    storage::load_links()
}

#[tauri::command]
fn remove_link(url: String) -> Result<Vec<Link>, String> {
    storage::delete_link(url)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // REMOVED: .plugin(tauri_plugin_clipboard_manager::init()) 
        // We are back to pure, simple Rust commands.
        .invoke_handler(tauri::generate_handler![
            generate_password,
            save_link,
            get_links,
            remove_link
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
