const express = require("express");
const app = express();

app.use(express.json());

const TOKEN = "8658678438:AAFtrEmrXNfUzFdukP0fLH2rTH78_W7JNeE";

app.get("/", (req, res) => {
  res.send("Bot rodando com sucesso");
});

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message.text; // captura a mensagem do Telegram
    const chat_id = req.body.message.chat.id; // captura o chat ID

    console.log("Mensagem recebida:", message); // mostra no log do Render

    // Verifica se é comando /consulta
    if (message.startsWith("/consulta")) {
      const numero_processo = message.split(" ")[1]; // pega o número do processo

      if (!numero_processo) {
        // Resposta se não enviar número
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chat_id,
            text: "Por favor, envie o número do processo após /consulta"
          })
        });
      } else {
        // Resposta confirmando recebimento do número
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chat_id,
            text: `Número do processo recebido: ${numero_processo}`
          })
        });
      }
    } else {
      // Resposta para mensagens que não sejam /consulta
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat_id,
          text: "Envie /consulta <numero_do_processo> para consultar um processo."
        })
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.log("Erro:", err);
    res.status(500).send("Erro no bot");
  }
});

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
    console.log("Erro:", err);
    res.status(500).send("Erro no bot");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta " + PORT));
