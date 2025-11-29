# **Onion Vault 🧅🔐**

<div align="center">

  ![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Tauri](https://img.shields.io/badge/tauri-%23FFC131.svg?style=for-the-badge&logo=tauri&logoColor=black)

</div>
<img width="1780" height="1506" alt="image" src="https://github.com/user-attachments/assets/14ea8225-3d09-4b10-89ab-b438406f9422" />
<img width="1780" height="1620" alt="image" src="https://github.com/user-attachments/assets/0ee2f1da-73dd-49b6-b848-315faf438adb" />

# 🚓 The Security Benefits

Zero Evidence: If your computer is seized, investigators find zero passwords. They simply do not exist on the disk. They only exist in RAM for the 10 seconds you are using them.

Anti-Honeypot: Every website gets a mathematically unique, 24-character password. If a market or forum is compromised, the password you used there cannot be used to hack your other accounts.

Device-Locked: A hidden, random salt is generated when you install the app. This acts as a "Device Key," meaning even if someone steals your Master Secret, they cannot generate your passwords on their own computer.

# ⚠️ Important Security Note

Do not delete the .vault_salt file.
When you first run the app, it creates a hidden file named .vault_salt in the app directory. This is your unique device fingerprint.

If you delete it: Your generated passwords will change (you will be locked out of your accounts).

If you switch computers: You must manually copy this file to the new computer to generate the same passwords.
