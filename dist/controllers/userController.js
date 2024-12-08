import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import { MessageResponse, userAlreadyExist } from "../utils/index.js";
dotenv.config({ path: "../.env" });
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.json({
                success: false,
                message: "All credential are required",
            });
        }
        const userExist = await userAlreadyExist(email);
        if (userExist) {
            MessageResponse(res, 400, false, "This account already exist");
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });
        if (!newUser) {
            MessageResponse(res, 400, false, "Failed to create a account");
        }
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        MessageResponse(res, 201, true, {
            token,
            user: { name: newUser.name },
        });
        res.status(201).json();
    }
    catch (error) {
        console.log(error);
        MessageResponse(res, 400, false, {
            message: "Failed to register user",
        });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            MessageResponse(res, 400, false, "All credential are required");
            return;
        }
        const user = await userAlreadyExist(email);
        console.log(email, "email");
        console.log(password, "password");
        console.log(user, "user");
        if (!user) {
            MessageResponse(res, 400, false, "Incorrect credentials");
            return;
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            MessageResponse(res, 400, false, "Incorrect credentials");
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        MessageResponse(res, 200, true, { token, user: { name: user.name } });
    }
    catch (error) {
        console.log(error);
        MessageResponse(res, 400, false, "Failed to login user");
    }
};
export const userCredit = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            MessageResponse(res, 400, false, "Please log in first.");
            return;
        }
        res.status(200).json({
            success: true,
            credits: user?.creditBalance,
            message: { user: { name: user?.name } },
        });
    }
    catch (error) {
        console.log(error);
        MessageResponse(res, 400, false, {
            message: "Failed to fetch the user credits",
        });
    }
};
