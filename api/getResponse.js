const Groq = require('groq-sdk');
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getGroqChatCompletion(character, conversation) {
    const prompt = `You are ${character}. Continue the following conversation in french without repeating your name in the response:\n\n${conversation}`;
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-8b-8192"
        });
        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error fetching response from Groq API:", error);
        throw error;
    }
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { character, conversation } = req.body;
        try {
            const responseText = await getGroqChatCompletion(character, conversation);
            res.status(200).json({ character, text: responseText });
        } catch (error) {
            res.status(500).send('Error generating response');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
