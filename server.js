const express = require("express");
const app = express();
const { resolve } = require("path");
require("dotenv").config();

const port = process.env.PORT || 3000;
const api_key = process.env.SECRET_KEY;
const stripe = require("stripe")(api_key);

// ------------------- Static Files -------------------
app.use(express.static(resolve(__dirname, process.env.STATIC_DIR || "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ------------------- Routes -------------------
app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, `${process.env.STATIC_DIR}/index.html`));
});

app.get("/success", (req, res) => {
  res.sendFile(resolve(__dirname, `${process.env.STATIC_DIR}/success.html`));
});

app.get("/cancel", (req, res) => {
  res.sendFile(resolve(__dirname, `${process.env.STATIC_DIR}/cancel.html`));
});

// Workshop pages
app.get("/workshop1", (req, res) => {
  res.sendFile(resolve(__dirname, `${process.env.STATIC_DIR}/workshops/workshop1.html`));
});
app.get("/workshop2", (req, res) => {
  res.sendFile(resolve(__dirname, `${process.env.STATIC_DIR}/workshops/workshop2.html`));
});
app.get("/workshop3", (req, res) => {
  res.sendFile(resolve(__dirname, `${process.env.STATIC_DIR}/workshops/workshop3.html`));
});

// ------------------- Stripe Checkout -------------------
const domainURL = process.env.DOMAIN;
app.post("/create-checkout-session/:pid", async (req, res) => {
  try {
    const priceId = req.params.pid;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${domainURL}/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/cancel`,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------- Start Server -------------------
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌍 Access it at http://${process.env.DOMAIN || "your-ec2-ip"}:${port}`);
});
