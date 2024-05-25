// api/getResponse.js
module.exports = (req, res) => {
    if (req.method === 'POST') {
      const { character, conversation } = req.body;
      // Logic to generate the response from the character
      const responseText = `This is a simulated response from ${character}`;
      res.status(200).json({ character, text: responseText });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  