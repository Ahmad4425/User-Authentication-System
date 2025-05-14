const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// Mock database
const users = [
    {email,password,resetToken,resetTokenExpiry}, 
];

// Generate a random token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Request password reset
app.post('/request-reset-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const token = generateToken();
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // In a real application, send the token via email
    console.log(`Password reset token for ${email}: ${token}`);

    res.json({ message: 'Password reset token generated. Check your email.' });
});

// Reset password
app.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;
    const user = users.find(u => u.resetToken === token && u.resetTokenExpiry > Date.now());

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    res.json({ message: 'Password has been reset successfully' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});