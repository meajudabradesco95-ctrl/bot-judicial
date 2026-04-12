const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios"); // npm install axios

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const TOKEN = "8658678438:AAFtrEmrXNfUzFdukP0fLH2rTH78_W7JNeE";

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message.text;
    const chat_id = req.body.message.chat.id;

    console.log("Mensagem recebida:", message);

    if (message.startsWith("/consulta")) {
      const numero_processo = message.split(" ")[1];

      if (!numero_processo) {
        await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          chat_id,
          text: "Por favor, envie o número do processo após /consulta"
        });
      } else {
        await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          chat_id,
          text: `Número do processo recebido: ${numero_processo}`
        });
      }
    } else {
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: "Envie /consulta <numero_do_processo> para consultar um processo."
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.log("Erro:", err.message);
    res.status(500).send("Erro no bot");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
