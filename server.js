const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_TOKEN;

app.post("/webhook", async (req, res) => {
  const message = req.body.message?.text;
  const chat_id = req.body.message?.chat?.id;

  if (!message || !chat_id) return res.sendStatus(200);

  if (message.startsWith("/consulta")) {
    const numero = message.split(" ")[1];

    if (!numero) {
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: "Envie o número do processo"
      });
      return res.sendStatus(200);
    }

    // resposta inicial
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id,
      text: "🔎 Consultando processo..."
    });

    try {
      // API GRATUITA DE TESTE (mock realista)
      const response = await axios.get(`https://dummyjson.com/users/1`);

      const data = response.data;

      const resposta = `
📄 Processo: ${numero}

👤 Autor: ${data.firstName} ${data.lastName}
⚖️ Réu: Empresa Exemplo
👨‍⚖️ Advogado: Não informado
📌 Tipo: Cível
💰 Valor: R$ 5.000
`;

      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: resposta
      });

    } catch (e) {
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: "Erro ao consultar API"
      });
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
