const Groq = require('groq-sdk');
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getGroqChatCompletion(character, conversation, language) {
    const prompt = `You are ${character}. Continue the following conversation in ${language} without repeating your name in the response:\n\n${conversation}`;
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-70b-8192"
        });
        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error fetching response from Groq API:", error);
        throw error;
    }
}

module.exports = getGroqChatCompletion;
