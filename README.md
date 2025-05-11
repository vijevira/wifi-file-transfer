# 📁 Wi-Fi File Transfer Tool

A simple Node.js-based web tool for uploading, viewing, and downloading files between devices on the **same Wi-Fi network**. Supports browsing nested folders and works over the internet using tools like **Ngrok**.

---

## 🚀 Features

- 🔼 Upload files from any device on the same Wi-Fi network
- 📄 View and download uploaded files
- 📂 Navigate folders within the upload directory
- 🌐 Optional internet sharing using Ngrok
- ⚡ Built with Express and vanilla HTML/JS

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) (v14+ recommended)
- Local Wi-Fi network (or Ngrok for internet access)

---

## 📁 Folder Structure

project/
├── server.js # Backend server (Express)
├── public/
│ └── index.html # Frontend UI
├── uploads/ # All uploaded files go here
└── README.md # Project documentation


----

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/wifi-file-transfer.git
cd wifi-file-transfer
npm install
npm start