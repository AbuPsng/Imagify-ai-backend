import { userModel } from "../models/userModel.js";
export const userAlreadyExist = async (email) => {
    const userExist = await userModel.findOne({ email });
    return userExist ? userExist : false;
};
export const MessageResponse = (res, statusCode, success, message) => {
    res.status(statusCode).json({
        success,
        message,
    });
};
