const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

// pega o token do Render (variável de ambiente)
const TOKEN = process.env.TOKEN;

app.post("/webhook", async (req, res) => {
  const message = req.body.message;
  const chat_id = req.body.chat_id;

  console.log("Mensagem:", message);

  // envia resposta para o Telegram
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chat_id,
      text: "Recebi: " + message
    })
  });

  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("Bot rodando com sucesso");
});

app.listen(process.env.PORT || 3000);
