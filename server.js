import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("Manish says Good job 😎 backend running");
});

app.post("/create-order", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        },
        body: JSON.stringify({
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

    // 🔴 PRINT EXACT CASHFREE RESPONSE
    console.log("===== CASHFREE RESPONSE START =====");
    console.log(JSON.stringify(data, null, 2));
    console.log("===== CASHFREE RESPONSE END =====");

    res.json(data);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
