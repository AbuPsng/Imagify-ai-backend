import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface CustomJwtPayload extends JwtPayload {
  id: string;
}

type MessageObject = {
  [key: string]: string | boolean;
};

export type MessageResponseTypes = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string | MessageObject | object,
  creditBalance?: number
) => Response;
