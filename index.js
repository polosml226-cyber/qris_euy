const express = require("express");
const axios = require("axios");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).send("Pakasir Railway Backend Active");
});

/* =========================
   CREATE PAYMENT
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
        headers: { "Content-Type": "application/json" },
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
   WEBHOOK PAKASIR
========================= */
app.post("/pakasir/webhook", (req, res) => {
  console.log("WEBHOOK MASUK:", req.body);
  res.send("OK");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend Railway aktif di port", PORT);
});
