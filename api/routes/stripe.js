import express from "express";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/payment", async (req, res) => {
  console.log(req.body,"Stripe");
  try {
    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount, // in cents
      currency: "usd",
      payment_method: req.body.tokenId,
      confirmation_method: "manual",  // or "automatic"
      confirm: true,
    });

    // If confirmation is successful, send the client response
    res.status(200).json(paymentIntent);
  } catch (error) {
    // Handle errors (such as payment method errors)
    console.error("Stripe Payment Error: ", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
