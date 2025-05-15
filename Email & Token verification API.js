//User Email Sending API
const http = require("http");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Create a server
const server = http.createServer((request, response) => {
    try {        
        const auth = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: "youremail@gmail.com",
                pass: "your_password"
            }
        });

        const receiver = {
            from: "youremail@gmail.com",
            to: "youremail@gmail.com",
            subject: "Node Js Mail Testing!",
            text: "Hello this is a text mail!"
        };

        auth.sendMail(receiver, (error, emailResponse) => {
            if (error) throw error;
            console.log("success!");
            response.end();
        });
    } 
        catch (error) {
        console.error("Error occurred:", error);
        response.statusCode = 500;
        response.end("Internal Server Error");
    }
});

//User Token Verification API

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
// Redirect if no token is found
    return res.redirect("/api/users/registration");
    }

    try {
// Token is valid, proceed to the next middleware
    jwt.verify(token, process.env.JWT_SECRET);
    next();
    }
    catch (err) {
    return res.redirect("/api.users/registration");
    }
};

// Start the server

server.listen(8000, () => {
    console.log("Server is running on port 8000");
});
