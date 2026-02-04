import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

/* ================================
   ANDROID-SAFE CORS (VERY IMPORTANT)
================================ */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());

app.use(express.json());

/* ================================
   TEST ROUTE (OPTIONAL)
================================ */
app.get("/", (req, res) => {
  res.send("Manish sahu says 😎 Backend running successfully");
});

/* ================================
   CREATE CASHFREE ORDER (LIVE)
================================ */
app.post("/create-order", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.cashfree.com/pg/orders", // 🔴 LIVE URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,        // LIVE APP ID
          "x-client-secret": process.env.CASHFREE_SECRET_KEY, // LIVE SECRET
          "x-api-version": "2023-08-01"
        },
        body: JSON.stringify({
          // 🔴 UNIQUE ORDER ID (MANDATORY)
          order_id: "order_" + Date.now() + "_" + Math.floor(Math.random() * 10000),

          order_amount: req.body.orderAmount,
          order_currency: "INR",

          customer_details: {
            customer_id: "cust_" + Date.now(),
            customer_name: req.body.customerName,
            customer_email: req.body.customerEmail,
            customer_phone: req.body.customerPhone
          },

          order_note: req.body.orderNote
        })
      }
    );

    const data = await response.json();

    console.log("===== CASHFREE RESPONSE START =====");
    console.log(JSON.stringify(data, null, 2));
    console.log("===== CASHFREE RESPONSE END =====");

    res.json(data);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================================
   PORT (RENDER SAFE)
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
