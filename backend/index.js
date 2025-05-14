const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral", // o llama3, etc.
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error("Error llamando a Ollama:", error);
    res.status(500).json({ error: "Fallo interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
