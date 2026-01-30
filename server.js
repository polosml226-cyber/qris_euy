const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const config = require("./config");

// CREATE INVOICE
app.post("/invoice", async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const r = await axios.post(
      `${config.pakasir.apiBase}/transactioncreate/qris`,
      {
        project: config.pakasir.project,
        order_id: orderId,
        amount,
        api_key: config.pakasir.apiKey
      }
    );

    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: "invoice gagal" });
  }
});

// CHECK STATUS
app.get("/status/:orderId", async (req, res) => {
  try {
    const r = await axios.get(
      `${config.pakasir.apiBase}/transactionstatus`,
      {
        params: {
          project: config.pakasir.project,
          order_id: req.params.orderId,
          api_key: config.pakasir.apiKey
        }
      }
    );

    res.json(r.data);
  } catch {
    res.status(500).json({ error: "status gagal" });
  }
});

app.listen(3000, () => {
  console.log("Backend aktif di port 3000");
});
