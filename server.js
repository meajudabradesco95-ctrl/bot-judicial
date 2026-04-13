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

  if (message.startsWith("/consulta")) {
    const numero = message.split(" ")[1];

    if (!numero) {
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: "Envie o número do processo."
      });
      return res.sendStatus(200);
    }

    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id,
      text: "🔎 Consultando processo..."
    });

    try {
      const browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu"
        ]
      });

      const page = await browser.newPage();

      await page.goto("https://esaj.tjsp.jus.br/cpopg/open.do", {
        waitUntil: "networkidle2"
      });

      await page.type("#numeroDigitoAnoUnificado", numero);

      await page.click("#botaoConsultarProcessos");

      await page.waitForTimeout(6000);

      const resultado = await page.evaluate(() => {
        return document.body.innerText;
      });

      await browser.close();

      const textoFinal = resultado.slice(0, 3500);

      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: textoFinal || "Nenhum resultado encontrado"
      });

    } catch (erro) {
      console.log("Erro Puppeteer:", erro.message);

      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id,
        text: "❌ Erro ao consultar processo"
      });
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
