import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from 'express-rate-limit'
import { connectDB } from "./config/default.js";
import { authRoutes } from "./routes/auth.js";
import  userRoutes  from "./routes/user.js";
import { verifyTokenAndAdmin } from "./helpers/token.js";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";
import cartRouter from "./routes/cart.js";
import stripeRoute from  "./routes/stripe.js"

// import './cronJob.js'

const PORT = 4000;

const app = express();

dotenv.config();
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
 };
 
 
 
 app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

// const limiter = rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minutes
//     limit: 4, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//     // standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//     // legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//     // store: ... , // Use an external store for consistency across multiple server instances.
//     message: "Too many requests, please try again later.",
// })

// // Apply the rate limiting middleware to all requests.
// app.use(limiter)

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product",productRouter)
app.use("/api/orders",orderRouter)
app.use("/api/carts",cartRouter)
app.use("/api/checkout",stripeRoute)


app.get("/", (request, response) => {
    response.send("Hello World");
});


app.listen(PORT, () => {
    console.log(`Server is Running at http://localhost:${PORT}`);
});