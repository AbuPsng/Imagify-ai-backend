import { Response } from "express";
import { userModel } from "../models/userModel.js";
import { MessageResponseTypes } from "../types/index.js";

export const userAlreadyExist = async (email: string) => {
  const userExist = await userModel.findOne({ email });
  return userExist ? userExist : false;
};

// export const MessageResponse: MessageResponseTypes = (
//   res,
//   statusCode,
//   success,
//   message,
//   creditBalance
// ) => {
//   return res.status(statusCode).json({
//     success,
//     message,
//     ...(creditBalance !== undefined && { creditBalance }),
//   });
// };

export const MessageResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string | object
): Response => {
  return res.status(statusCode).json({
    success,
    message,
  });
};
