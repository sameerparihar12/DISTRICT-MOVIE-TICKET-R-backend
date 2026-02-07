import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount, email, phone } = req.body;

    const response = await fetch(
      "https://api.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,        // LIVE
          "x-client-secret": process.env.CASHFREE_SECRET_KEY, // LIVE
          "x-api-version": "2023-08-01"
        },
        body: JSON.stringify({
          order_id: "order_" + Date.now(),
          order_amount: amount,
          order_currency: "INR",
          customer_details: {
            customer_id: "cust_" + Date.now(),
            customer_email: email,
            customer_phone: phone,
            customer_name: "Movie Ticket Customer"
          }
        })
      }
    );

    const data = await response.json();

    console.log("CASHFREE RESPONSE:", data);
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
