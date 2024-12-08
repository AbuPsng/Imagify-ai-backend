import express from "express";
import {
  loginUser,
  registerUser,
  userCredit,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/auth.js";
import { stripePaymentInstance } from "../controllers/paymentController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credits", userAuth, userCredit);
userRouter.post("/pay", userAuth, stripePaymentInstance);

export default userRouter;