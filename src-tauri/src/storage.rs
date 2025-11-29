use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

// 1. Define what a "Link" looks like
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Link {
    pub title: String,
    pub url: String,
    pub username: String,
}

// 2. File helper
fn get_links_path() -> PathBuf {
    PathBuf::from("links.json")
}

// 3. Command: Save a new link
pub fn add_link(title: String, url: String, username: String) -> Result<Vec<Link>, String> {
    // Load existing
    let mut links = load_links().unwrap_or(Vec::new());

    // Add new one
    links.push(Link {
        title,
        url,
        username,
    });

    // Save back to disk
    let json = serde_json::to_string_pretty(&links).map_err(|e| e.to_string())?;
    fs::write(get_links_path(), json).map_err(|e| e.to_string())?;

    Ok(links)
}

// 4. Command: Read all links
pub fn load_links() -> Result<Vec<Link>, String> {
    let path = get_links_path();
    if !path.exists() {
        return Ok(Vec::new()); // Return empty list if no file exists
    }

    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let links: Vec<Link> = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    Ok(links)
}

// 5. Command: Delete a link (by URL)
pub fn delete_link(url_to_delete: String) -> Result<Vec<Link>, String> {
    let links = load_links().unwrap_or(Vec::new());

    // Filter out the one we want to delete
    let new_links: Vec<Link> = links
        .into_iter()
        .filter(|link| link.url != url_to_delete)
        .collect();

    // Save
    let json = serde_json::to_string_pretty(&new_links).map_err(|e| e.to_string())?;
    fs::write(get_links_path(), json).map_err(|e| e.to_string())?;

    Ok(new_links)
}
