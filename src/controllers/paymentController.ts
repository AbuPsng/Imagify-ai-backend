import { Request, Response } from "express";
import { MessageResponse } from "../utils/index.js";
import { stripe } from "../app.js";
import { userModel } from "../models/userModel.js";
import { transactionModel } from "../models/transactionMode.js";
import "dotenv/config";

export const stripePaymentInstance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.body, "body");
    const { planId, userId } = req.body;

    if (!planId || !userId) {
      MessageResponse(res, 400, false, {
        success: false,
        message: "Please selece a plan",
      });
      return;
    }

    let transactionData = { plan: "", userId, credits: 0, amount: 0, date: 0 };

    switch (planId) {
      case "Basic":
        transactionData.plan = "Basic";
        transactionData.credits = 100;
        transactionData.amount = 10;
        break;
      case "Advanced":
        transactionData.plan = "Advanced";
        transactionData.credits = 500;
        transactionData.amount = 50;
        break;
      case "Business":
        transactionData.plan = "Business";
        transactionData.credits = 5000;
        transactionData.amount = 250;
        break;
      default:
        MessageResponse(res, 400, false, "transactionData not found");
    }

    let date = Date.now();
    transactionData.date = date;

    console.log(transactionData, "transactionData");

    await transactionModel.create(transactionData);

    // Create a customer in Stripe
    const paymentIntents = await stripe.paymentIntents.create({
      amount: transactionData?.amount * 100,
      currency: process.env.CURRENCY || "INR",
      description: "Software development services",
    });

    const user = await userModel.findById(userId);

    if (!user) {
      MessageResponse(res, 400, false, "Please login first");
      return;
    }

    await userModel.findByIdAndUpdate(userId, {
      creditBalance: transactionData.credits + user?.creditBalance,
    });

    MessageResponse(res, 201, false, {
      clientSecret: paymentIntents.client_secret,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
