const express = require("express");
const axios = require("axios");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   HEALTH CHECK (WAJIB)
   Supaya Railway tahu server hidup
========================= */
app.get("/", (req, res) => {
  res.status(200).send("Pakasir Railway Backend Active");
});

/* =========================
   CREATE PAYMENT (BOT CALL)
========================= */
app.post("/create-payment", async (req, res) => {
  try {
    const { project, apiKey, order_id, amount } = req.body;

    if (!project || !apiKey || !order_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap"
      });
    }

    const response = await axios.post(
      "https://app.pakasir.com/api/transactioncreate/qris",
      {
        project,
        order_id,
        amount,
        api_key: apiKey
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    res.json({
      success: true,
      payment: response.data.payment
    });

  } catch (err) {
    console.log("CREATE PAYMENT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Gagal membuat invoice"
    });
  }
});

/* =========================
   WEBHOOK DARI PAKASIR
========================= */
app.post("/pakasir/webhook", (req, res) => {
  console.log("Webhook Pakasir masuk:");
  console.log(req.body);

  // nanti bisa diteruskan ke bot panel
  res.status(200).send("OK");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend Railway aktif di port", PORT);
});
