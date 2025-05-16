//import necessary modules
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();


// User Registration Controller
export const registrationController = async (req, res) => {
    try {
        const { username, email, password, ConfirmPassword } = req.body;

        // Input fields Validation
        if (!username || !email || !password || !ConfirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (username.length < 3 || username.length > 10) {
            return res.status(400).json({ message: "Username should be between 3 to 10 characters" });
        }
        if (!email.includes("@")) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }
        if (password.length < 8 || password.length > 10) {
            return res.status(400).json({ message: "Password should be between 8 to 10 characters" });
        }

        // Password and confirm password validation
        if (ConfirmPassword !== password) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }

        // Check if user already exists
        const userExit = await userModel.findOne({ email: email });
        if (userExit) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create user in database
        const user = await userModel.create({
            username: username,
            email: email,
            password: hash,
        });

        // Create JWT token
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.status(200).json({
            success: true,
            message: "User Registered successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
