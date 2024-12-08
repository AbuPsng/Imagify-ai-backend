import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "All credential are required",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: newUser.name } });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to register user" });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                success: false,
                message: "All credential are required",
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Incorrect credentials" });
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
            return res.json({ success: false, message: "Incorrect credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name } });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to login user" });
    }
};
