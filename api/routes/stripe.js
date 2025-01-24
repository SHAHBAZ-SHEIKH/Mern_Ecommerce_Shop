import express from "express";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  console.log("req.body", req.body.products);
  const products = req.body.products;
  console.log("product", products);
  

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          images: [product.img],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    })),
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  })

  res.json({id: session.id})

  // try {
  //   // Create a PaymentIntent with the specified amount and currency
  //   const paymentIntent = await stripe.paymentIntents.create({
  //     amount: req.body.amount, // in cents
  //     currency: "usd",
  //     payment_method: req.body.tokenId,
  //     confirmation_method: "manual",  // or "automatic"
  //     confirm: true,
  //   });

  //   // If confirmation is successful, send the client response
  //   res.status(200).json(paymentIntent);
  // } catch (error) {
  //   // Handle errors (such as payment method errors)
  //   console.error("Stripe Payment Error: ", error);
  //   res.status(500).json({ error: error.message });
  // }
});

export default router;
