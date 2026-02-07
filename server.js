import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.post("/create-order", async (req, res) => {
  try {
    console.log("CREATE ORDER HIT", req.body.customerEmail);

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

    console.log("CASHFREE RESPONSE:", data);
    res.json(data);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);
