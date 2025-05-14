import express from "express";
import bodyParser from "body-parser";
import ollama from "ollama";
import cors from "cors";

const app = express();
const PORT = 3000;
// const router = express.Router();

//-----------------------------------------------------------cambiar cors solo para el dominio que sea

app.use(cors(), bodyParser.json());

//-----------------------------------------------------------cambiar cors solo para el dominio que sea

app.post("/ask-query", async (req, res) => {
  const { query, messages } = req.body;
  console.log("mesajes", messages);
  try {
    const response = await ollama.chat({
      model: "llama3.2",
      messages: [...messages, { role: "user", content: query }],
    });
    res.json({ reply: response.message.content });
  } catch (error) {
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
