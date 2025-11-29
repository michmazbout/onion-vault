use argon2::{
    password_hash::{
        PasswordHasher, SaltString
    },
    Argon2
};
use rand::rngs::OsRng; 
use std::fs;
use std::path::PathBuf;

const SALT_FILENAME: &str = ".vault_salt";

// THE NEW PASSWORD ALPHABET
// This ensures we get a mix of everything
const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";

fn get_or_create_salt() -> Result<String, String> {
    let salt_path = PathBuf::from(SALT_FILENAME);

    if salt_path.exists() {
        let loaded_salt = fs::read_to_string(&salt_path)
            .map_err(|e| format!("Failed to read salt file: {}", e))?;
        return Ok(loaded_salt.trim().to_string());
    }

    let salt = SaltString::generate(&mut OsRng);
    let salt_str = salt.as_str().to_string();

    fs::write(&salt_path, &salt_str)
        .map_err(|e| format!("Failed to save new salt: {}", e))?;

    Ok(salt_str)
}

pub fn calculate_pass(
    master_secret: &str, 
    url: &str, 
    username: &str
) -> Result<String, String> {
    
    let install_salt_str = get_or_create_salt()?;
    
    let salt = SaltString::from_b64(&install_salt_str)
        .map_err(|e| format!("Corrupted salt file: {}", e))?;

    let input_material = format!("{}{}{}", master_secret, url, username);

    let argon2 = Argon2::default();
    
    // 1. Get the Hash Object
    let password_hash = argon2.hash_password(input_material.as_bytes(), &salt)
        .map_err(|e| e.to_string())?;

    // 2. Get the RAW BYTES (The actual math output), not just the string
    // If for some reason the hash is missing (rare), we fallback to a string hash
    let hash_bytes = password_hash.hash.as_ref()
        .map(|h| h.as_bytes())
        .ok_or("Failed to retrieve hash bytes")?;

    // 3. MAP TO CUSTOM ALPHABET
    // We take the first 24 bytes and map them to our special characters
    let mut final_pass = String::with_capacity(24);
    
    for (i, &byte) in hash_bytes.iter().enumerate() {
        if i >= 24 { break; } // Limit to 24 chars
        let idx = (byte as usize) % CHARSET.len();
        final_pass.push(CHARSET[idx] as char);
    }

    // Ensure it's exactly 24 chars (padding if needed, though unlikely with Argon2)
    while final_pass.len() < 24 {
        final_pass.push('!');
    }

    Ok(final_pass)
}
