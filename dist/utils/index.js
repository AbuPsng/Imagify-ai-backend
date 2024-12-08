import { userModel } from "../models/userModel.js";
export const userAlreadyExist = async (email) => {
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
export const MessageResponse = (res, statusCode, success, message) => {
    return res.status(statusCode).json({
        success,
        message,
    });
};
