const express = require("express");
const axios = require("axios");
const puppeteer = require("puppeteer");

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

  // COMANDO /consulta
  if (message.startsWith("/consulta")) {
    const numero = message.split(" ")[1];

    if (!numero) {
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: "Envie o número do processo. Ex: /consulta 1234567-89.2023.8.26.0100"
      });
      return res.sendStatus(200);
    }

    // resposta inicial
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id,
      text: "🔎 Consultando processo..."
    });

    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });

      const page = await browser.newPage();

      // site do tribunal
      await page.goto("https://esaj.tjsp.jus.br/cpopg/open.do", {
        waitUntil: "networkidle2"
      });

      // campo do número
      await page.type("#numeroDigitoAnoUnificado", numero);

      // clicar em consultar
      await page.click("#botaoConsultarProcessos");

      // aguardar carregar
      await page.waitForTimeout(5000);

      // pegar texto da página
      const resultado = await page.evaluate(() => {
        return document.body.innerText;
      });

      await browser.close();

      // limitar resposta (telegram trava com texto grande)
      const textoFinal = resultado.slice(0, 3500);

      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: textoFinal || "Nenhum resultado encontrado"
      });

    } catch (erro) {
      console.log("Erro:", erro.message);

      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: "❌ Erro ao consultar o processo"
      });
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
