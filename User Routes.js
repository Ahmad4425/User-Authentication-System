import express from 'express';
import {verifyToken} 

from '../Middlewares/Authentication.js';

import {
registrationFrom,
registrationController, 
loginForm, 
loginController, 
Logoutcontroller,
changepasswordController, 
changepasswordForm} 

from '../Controllers/userController.js'
const userRouter = express.Router();

try{
//Public Routes

userRouter.get('/registration',registrationFrom)

userRouter.post('/register',registrationController)

userRouter.get('/login',loginForm)

userRouter.post('/loggedIn',loginController)

userRouter.get('/logout',verifyToken,Logoutcontroller)

//Protected Routes

userRouter.get('/changepassword',verifyToken,changepasswordForm)

userRouter.post('/changepassword',changepasswordController)

} catch(err){
console.log(err)
res.status(500).json({sucess:false,message:"Internal server error"})
}
 
export default userRouter;