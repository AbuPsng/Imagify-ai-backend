import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectToDb } from "./config/index.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import Stripe from "stripe";

const PORT = process.env.PORT || 3000;
const stripeKey = process.env.STRIPE_KEY_SECRET || "";

const app = express();
export const stripe = new Stripe(stripeKey);

connectToDb();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/image", imageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
