import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" })); // Change to your frontend domain in production for security
app.use(express.json());

app.post("/create-order", async (req, res) => {
  try {
    const { orderAmount, customerEmail, orderNote = "Movie Ticket Booking" } = req.body;

    if (!orderAmount || orderAmount < 100) {
      return res.status(400).json({ error: "Amount must be at least ₹100" });
    }
    if (!customerEmail) {
      return res.status(400).json({ error: "Email required" });
    }

    const orderId = `ord_${Date.now()}`;

    const response = await fetch("https://api.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2025-01-01"
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_email: customerEmail,
          customer_phone: "9999999999",
          customer_name: "Movie Customer"
        },
        order_note: orderNote,
        order_meta: {
          return_url: "https://your-domain.com/success.html?order_id={order_id}"  // ← CHANGE THIS TO YOUR REAL HOSTED success.html URL
        },
        order_expiry_time: new Date(Date.now() + 1800000).toISOString() // 30 min
      })
    });

    const data = await response.json();

    if (!response.ok || !data.payment_session_id) {
      console.log("Cashfree error:", data);
      return res.status(response.status || 500).json({ error: "Order creation failed", details: data });
    }

    res.json({ payment_session_id: data.payment_session_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
