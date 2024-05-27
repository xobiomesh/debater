"use strict";
require('dotenv').config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Groq = require("groq-sdk");
const basicAuth = require("express-basic-auth");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware to set the ngrok-skip-browser-warning header
app.use((req, res, next) => {
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});

// Configure basic authentication
app.use(basicAuth({
    users: { 'thegreat': 'debate' }, // Replace with your desired username and password
    challenge: true
}));

app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.get('/character_profiles.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'character_profiles.json'));
});

app.post("/api/startDebate", (req, res) => {
    res.json({ message: 'Debate started. You can now request responses from the characters.' });
});

app.post("/api/getResponse", async (req, res) => {
    const { character, conversation, language } = req.body;

    try {
        const response = await getGroqChatCompletion(character, conversation, language);
        res.json({ character, text: response.choices[0]?.message?.content || "" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating response');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
