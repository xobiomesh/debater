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

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

async function getGroqChatCompletion(character, message) {
    const prompt = `You are ${character}. Answer the following question as if you were ${character}:\n\n${message}`;
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

app.post("/api/startDebate", async (req, res) => {
    const { topic, character1, character2 } = req.body;

    try {
        const messages = [];

        // Generate initial responses for both characters
        const response1 = await getGroqChatCompletion(character1, topic);
        const response2 = await getGroqChatCompletion(character2, topic);

        messages.push({ character: character1, text: response1.choices[0]?.message?.content || "" });
        messages.push({ character: character2, text: response2.choices[0]?.message?.content || "" });

        // Simulate back-and-forth debate
        for (let i = 0; i < 2; i++) { // Adjust the number of turns as needed
            const response1 = await getGroqChatCompletion(character1, messages[messages.length - 1].text);
            messages.push({ character: character1, text: response1.choices[0]?.message?.content || "" });

            const response2 = await getGroqChatCompletion(character2, messages[messages.length - 1].text);
            messages.push({ character: character2, text: response2.choices[0]?.message?.content || "" });
        }

        res.json({ debate: messages });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating debate');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
