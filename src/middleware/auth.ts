import { ControllerType, CustomJwtPayload } from "../types/index.js";
import jwt from "jsonwebtoken";

export const userAuth: ControllerType = async (req, res, next) => {
  const token = req.headers.token;

  if (!token || Array.isArray(token)) {
    res.status(400).json({ success: false, message: "Please log in first" });
    return;
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    if (decodedToken.id) {
      req.body.userId = decodedToken.id;
    } else {
      res.status(400).json({ success: false, message: "Please log in first" });
    }

    next();
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "Error while user validation" });
  }
};
