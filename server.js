const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_TOKEN || "FAKE_TOKEN";

app.post("/webhook", async (req, res) => {
  console.log("Mensagem recebida:", req.body);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
