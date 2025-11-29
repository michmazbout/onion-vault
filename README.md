OnionVault 🧅🔐

The Stateless Identity Manager for the Tor Network.

<div align="center">

  ![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Tauri](https://img.shields.io/badge/tauri-%23FFC131.svg?style=for-the-badge&logo=tauri&logoColor=black)

</div>
Stop saving passwords. Start calculating them.

OnionVault is a privacy-first desktop tool designed for the Dark Web. It solves two major problems: managing volatile .onion links and generating unique, complex passwords without leaving a forensic trail on your hard drive.

📥 Download & Install

You do not need to compile code. Just download the app and run it.

🐧 For Linux (Ubuntu, Debian, Mint, Pop!_OS)

Click here to download the latest .deb installer

Open the file (or run sudo dpkg -i filename.deb in terminal).

Launch OnionVault from your applications menu.

🚀 Why OnionVault?

Most password managers store your secrets in a database file. If a hacker steals that file and cracks it, they have everything.

OnionVault is different. It has no database.

Instead of storing passwords, it calculates them instantly using a mathematical formula:

$$\text{Password} = \text{Argon2id}(\text{MasterSecret} + \text{TargetURL} + \text{Username} + \text{DeviceSalt})$$

The Security Benefits

Zero Evidence: If your computer is seized, investigators find zero passwords. They simply do not exist on the disk. They only exist in RAM for the 10 seconds you are using them.

Anti-Honeypot: Every website gets a mathematically unique, 24-character password. If a market or forum is compromised, the password you used there cannot be used to hack your other accounts.

Device-Locked: A hidden, random salt is generated when you install the app. This acts as a "Device Key," meaning even if someone steals your Master Secret, they cannot generate your passwords on their own computer.

✨ Features

🧅 Link Vault: A secure, local address book for your favorite Tor sites.

⚡ One-Click Auth: Click "Auth" on a saved link to instantly switch tabs and pre-fill the calculator.

🔒 Military-Grade Crypto: Uses Argon2id (winner of the Password Hashing Competition) to generate keys.

🎲 High Entropy: Generates 24-character passwords using a custom 74-character alphabet (A-Z, a-z, 0-9, Symbols).

🌑 Hacker UI: A clean, dark-mode interface designed for focus and stealth.

🗑️ Panic Button: A "Clear" button that instantly wipes all inputs from the screen.

📖 How to Use

1. Save a Link

Store your favorite onion addresses in the Link Vault tab. This is just a bookmark manager—it remembers the URL and Username so you don't have to.

2. Generate a Password

Click the Key Icon next to a saved link (or go to the Calculator tab manually).

Type your Master Secret. (This is the only password you need to remember).

Click Calculate Password.

Your unique session password will appear in green.

Double-click the green text to select and copy it.

3. Clear Your Tracks

When you are done, click the Refresh Icon (🔄) to wipe the calculator fields instantly.

⚠️ Important Security Note

Do not delete the .vault_salt file.
When you first run the app, it creates a hidden file named .vault_salt in the app directory. This is your unique device fingerprint.

If you delete it: Your generated passwords will change (you will be locked out of your accounts).

If you switch computers: You must manually copy this file to the new computer to generate the same passwords.

👨‍💻 For Developers & Auditors

If you want to verify the source code or build it yourself, follow these steps. Regular users can skip this.

<details>
<summary><strong>Click to view Build Instructions</strong></summary>

Prerequisites

Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Node.js: v18+

Linux Deps: sudo apt install libwebkit2gtk-4.1-dev build-essential libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev

Building from Source

Clone the repo:

git clone [https://github.com/yourusername/onion-vault.git](https://github.com/yourusername/onion-vault.git)
cd onion-vault


Install dependencies:

npm install


Run in Dev Mode:

npm run tauri dev


Build Release (.deb):

npm run tauri build


</details>

📄 License

Distributed under the MIT License.
