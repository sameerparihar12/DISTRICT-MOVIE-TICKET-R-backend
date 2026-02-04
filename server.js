import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend running");
});

/* =========================
   CREATE PAYMENT LINK
========================= */
app.post("/create-payment-link", async (req, res) => {
  try {
    const { amount, email, phone } = req.body;

    const response = await fetch(
      "https://api.cashfree.com/api/v2/payment-links",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,        // LIVE APP ID
          "x-client-secret": process.env.CASHFREE_SECRET_KEY // LIVE SECRET
        },
        body: JSON.stringify({
          link_amount: amount,
          link_currency: "INR",
          link_purpose: "Movie Ticket",
          customer_details: {
            customer_email: email,
            customer_phone: phone
          },
          link_notify: {
            send_email: true,
            send_sms: true
          }
        })
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment link failed" });
  }
});

/* =========================
   PORT
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
