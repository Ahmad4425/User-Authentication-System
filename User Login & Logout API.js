import mongoose from "mongoose";
import userModel from "../Models/userSchema.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//USER LOGIN API

export const loginForm = (req, res) => {
    res.render("login.ejs");
};

export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (username.length < 3 || username.length > 10) {
            return res.status(400).json({ success: false, message: "Username should be between 3 to 10 characters" });
        }

        if (password.length < 8 || password.length > 10) {
            return res.status(400).json({ success: false, message: "Password should be between 8 to 10 characters" });
        }

        // Check if username is present or not
        const isUser = await userModel.findOne({ username: username });
        if (!isUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Check if password is matching or not
        const isMatch = await bcrypt.compare(password, isUser.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: isUser.email, id: isUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
        });

        res.status(200).json({ success: true, message: "User logged in successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

//USER LOGOUT API

export const Logoutcontroller = async (req, res) => {
    try {
        // Delete token from cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: true,
        });
        res.status(200).json({ success: true, message: "User logged out successfully" });
        return res.redirect("/api/users/login");
    }   catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}; 