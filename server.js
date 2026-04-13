const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_TOKEN;

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message?.text;
    const chat_id = req.body.message?.chat?.id;

    console.log("Recebido:", req.body);

    if (!message || !chat_id) {
      return res.sendStatus(200);
    }

    let reply = "Envie /consulta <numero>";

    if (message.startsWith("/consulta")) {
      const numero = message.split(" ")[1];
      reply = numero
        ? `Consulta recebida: ${numero}`
        : "Envie assim: /consulta 123";
    }

    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id,
      text: reply
    });

    return res.sendStatus(200);
  } catch (err) {
    console.log("Erro:", err.message);
    return res.sendStatus(200);
  }
});

app.get("/", (req, res) => {
  res.send("Bot rodando");
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
