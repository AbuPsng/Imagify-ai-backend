import axios from "axios";
import FormData from "form-data";
import { userModel } from "../models/userModel.js";
import { MessageResponse } from "../utils/index.js";
export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return MessageResponse(res, 400, false, {
                message: "Missing details",
            });
        }
        if (Number(user.creditBalance) <= 0) {
            return MessageResponse(res, 400, false, {
                message: "You are out of credit.",
                creditBalance: user.creditBalance,
            });
        }
        const formData = new FormData();
        formData.append("prompt", prompt);
        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: { "x-api-key": process.env.CLIPDROP_AI },
            responseType: "arraybuffer",
        });
        const base64Image = Buffer.from(data, "binary").toString("base64");
        const resultImage = `data:image/png;base64,${base64Image}`;
        await userModel.findByIdAndUpdate(userId, {
            creditBalance: Number(user?.creditBalance) - 1,
        });
        MessageResponse(res, 201, true, {
            success: true,
            message: "Image generated successfully",
            creditBalance: Number(user.creditBalance) - 1,
            resultImage,
        });
    }
    catch (error) {
        console.log(error);
        MessageResponse(res, 400, false, "Failed to generate image.");
    }
};