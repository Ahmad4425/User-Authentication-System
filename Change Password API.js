import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

//Change Password API
export const changepasswordForm = (req,res)=>{res.render("changepassword.ejs")}

export const changepasswordController = async (req, res) => {
    const { username, password, newpassword } = req.body;

    try {
        // Validation
        if (!username || !password || !newpassword) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        
        if(newpassword.length < 8 || newpassword.length > 10) {
            return res.status(400).json({ message: "New password should be between 8 to 10 characters" });
        }
        
        // Find the user by username
        const user = await userModel.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check if the current password matches the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newpassword, salt);

        // Update the user's password in the database
        user.password = hash;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    }   catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};