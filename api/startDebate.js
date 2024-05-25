// api/startDebate.js
module.exports = (req, res) => {
    if (req.method === 'POST') {
      const { topic } = req.body;
      // Logic to handle the start of the debate
      res.status(200).json({ message: 'Debate started', topic });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  