const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_TOKEN;

app.post("/webhook", async (req, res) => {
  const message = req.body.message?.text;
  const chat_id = req.body.message?.chat?.id;

  if (!message || !chat_id) {
    return res.sendStatus(200);
  }

  console.log("Mensagem:", message);

  if (message.startsWith("/consulta")) {
    const numero = message.split(" ")[1];

    if (!numero) {
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: "Envie o número do processo."
      });
      return res.sendStatus(200);
    }

    // RESPOSTA FUNCIONANDO 100%
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id,
      text: `🔎 Consulta recebida!

Processo: ${numero}
Autor: Não disponível
Réu: Não disponível
Advogado: Não disponível
Tipo: Não disponível
Valor: Não disponível

(Consulta real será ativada na próxima etapa)`
    });
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
