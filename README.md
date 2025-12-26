
# 🚀 IPTV Streamer Pro Premium - Termux Live Hosting Guide

Ye application ek premium IPTV interface hai. Isse GitHub par upload karne aur Termux se live chalane ke liye niche diye gaye steps follow karein.

---

## 🛠 Step 1: GitHub Par Upload Kaise Karein

1. GitHub.com par jayein aur ek naya repository banayein (Naam: `iptv-pro-premium`).
2. Apne computer/mobile terminal mein ye commands chalayein:
   ```bash
   git init
   git add .
   git commit -m "Initial Production Build"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/iptv-pro-premium.git
   git push -u origin main
   ```

---

## 📱 Step 2: Termux Mein Setup Aur Live Kaise Karein

Termux open karein aur niche di gayi commands ek-ek karke copy-paste karein:

### 1. System Update aur Node.js Install karein:
```bash
pkg update && pkg upgrade -y
pkg install nodejs git -y
```

### 2. Repository Clone karein:
```bash
git clone https://github.com/YOUR_USERNAME/iptv-pro-premium.git
cd iptv-pro-premium
```

### 3. Dependencies Install karein:
```bash
npm install
```

### 4. Server Start karein (Local):
```bash
npm run start
```
*Ab aapka app `http://localhost:5173` par chal raha hai.*

---

## 🌐 Step 3: Server Ko Live URL Mein Kaise Badle (Public Access)

App ko internet par live karne ke liye (taaki aap premium interface link pa sakein), Termux mein ek naya session open karein aur ye karein:

1. **Cloudflared Install karein:**
   ```bash
   pkg install wget -y
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -O cloudflared
   chmod +x cloudflared
   ```

2. **Live Tunnel Start karein:**
   ```bash
   ./cloudflared tunnel --url http://localhost:5173
   ```

**Output:** Aapko ek link milega jaise `https://random-words.trycloudflare.com`. 
Ye aapka **Live Web App URL** hai! Isse aap kisi bhi device par chala sakte hain.

---

## 🔑 Admin Access
- **Password:** `pranshu8787`
- **Menu:** Hamburger menu (3-lines) -> Admin Login.

---

## 📦 Features
- Direct Access (No Login for Guests)
- 1-Second Splash Screen
- Real-time Hindi Dubbing (Gemini AI Enabled)
- 4K Streaming Support
- Glassmorphism UI
