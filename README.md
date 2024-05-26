
# 💬 The Great Debate 💬

This app runs using the llama 8B model with inference from the Groq API. Visit [groq.com](https://www.groq.com) for more info.

## 🚀 Running Locally

### 1. Install Node.js

### 2. Install Dependencies
```bash
npm install express body-parser groq-sdk dotenv express-basic-auth
```

### 3. Run the Server
```bash
node server.js
```

### 4. Open in Browser
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Serving Online

To serve the app online, install and use `ngrok`:

### 1. Run ngrok
```bash
ngrok http 3000
```

### 2. Open the provided HTTPS link in your favorite browser.

## 🔐 Default Login

- **Username:** thegreat
- **Password:** debater

To change the default password, search for 'Configure basic authentication' in the `server.js` file and modify accordingly.

---

✨ **Happy Debating!** ✨
