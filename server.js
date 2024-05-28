"use strict";
require('dotenv').config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");

// Import the getGroqChatCompletion function
const getGroqChatCompletion = require("./api/getResponse");

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
        const responseText = await getGroqChatCompletion(character, conversation, language);
        res.json({ character, text: responseText });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating response');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
