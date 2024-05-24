"use strict";
require('dotenv').config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

async function getGroqChatCompletion(character, conversation) {
    const prompt = `You are ${character}. Continue the following conversation without repeating your name in the response:\n\n${conversation}`;
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        model: "llama3-8b-8192"
    });
}

app.post("/api/startDebate", (req, res) => {
    res.json({ message: 'Debate started. You can now request responses from the characters.' });
});

app.post("/api/getResponse", async (req, res) => {
    const { character, conversation } = req.body;

    try {
        const response = await getGroqChatCompletion(character, conversation);
        res.json({ character, text: response.choices[0]?.message?.content || "" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating response');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
