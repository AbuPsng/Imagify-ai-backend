import { generateImage } from "../controllers/imageController.js";
import { userAuth } from "../middleware/auth.js";
import express from "express";
const imageRouter = express.Router();
imageRouter.post("/generate-image", userAuth, generateImage);
export default imageRouter;
