import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// 🔑 CASHFREE KEYS (CHANGE THESE)
const CASHFREE_APP_ID = "YOUR_APP_ID_HERE";
const CASHFREE_SECRET_KEY = "YOUR_SECRET_KEY_HERE";
const CASHFREE_MODE = "sandbox"; // change to "production" when live

const CASHFREE_URL =
  CASHFREE_MODE === "sandbox"
    ? "https://sandbox.cashfree.com/pg/orders"
    : "https://api.cashfree.com/pg/orders";

app.post("/create-order", async (req, res) => {
  try {
    const {
      orderAmount,
      customerEmail,
      customerName,
      customerPhone,
      orderNote
    } = req.body;

    const response = await fetch(CASHFREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01"
      },
      body: JSON.stringify({
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_name: customerName
        },
        order_note: orderNote
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});
