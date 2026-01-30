const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
====================================
CREATE QRIS PAYMENT
Dipanggil oleh bot panel
====================================
*/
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

/*
====================================
WEBHOOK DARI PAKASIR
====================================
*/
app.post("/pakasir/webhook", (req, res) => {
  console.log("Webhook masuk:", req.body);

  // nanti bisa diteruskan ke bot kalau mau
  res.send("OK");
});

/*
====================================
START SERVER
====================================
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend Railway aktif di port", PORT);
});
