const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

const api_key = process.env.SECRET_KEY;
const stripe = require("stripe")(api_key);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------- Routes ----------

// Root route (optional welcome message)
app.get("/", (req, res) => {
  res.send("THIS APP IS REACT APP FOR DEVOPS LEARNING!");
});

// Stripe checkout session route
const domainURL = process.env.DOMAIN || `http://localhost:${port}`;

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
    console.error("Stripe session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// ---------- Start Server ----------
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
  console.log(`🌐 You can access the app at: ${domainURL}`);
});

