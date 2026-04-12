const express = require("express");
const app = express();

app.use(express.json());

const TOKEN = process.env.TOKEN || const TOKEN = "8658678438:AAFtrEmrXNfUzFdukP0fLH2rTH78_W7JNeE";

app.get("/", (req, res) => {
  res.send("Bot rodando com sucesso");
});

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message;
    const chat_id = req.body.chat_id;

    console.log("Mensagem:", message);

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

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro no webhook");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta", PORT));
