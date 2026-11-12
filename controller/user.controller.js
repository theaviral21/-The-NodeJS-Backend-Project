
import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { rmSync } from "fs";

const registerUser = async (req, res, next) => {
   console.log("register controller hit");

   const { name, email, password } = req.body;

   console.log("REQUEST BODY:", req.body);

   if (!name || !email || !password) {
      return res.status(400).json({
         message: "All fields are required",
      });
   }

   try {

      console.log("Checking existing user...");

      const existingUser = await User.findOne({ email });

      if (existingUser) {
         return res.status(400).json({
            message: "User already exists"
         });
      }

      console.log("Creating user...");

      const user = await User.create({
         name,
         email,
         password
      });

      console.log("User created:", user);

      const token = crypto.randomBytes(32).toString("hex");

      console.log("Token:", token);

      user.verificationToken = token;

      await user.save();

      console.log("User saved in database");

      const transporter = nodemailer.createTransport({
         host: process.env.MAILTRAP_HOST,
         port: Number(process.env.MAILTRAP_PORT),
         secure: false,
         auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
         },
      });

      const mailOption = {
         from: process.env.MAILTRAP_SENDERMAIL,
         to: user.email,
         subject: "Verify your email",
         text: `Please check the following link:
         ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
      };

      await transporter.sendMail(mailOption);

      console.log("Email sent");

      return res.status(200).json({
         message: "User registered successfully",
         success: true,
         user: user,
         token: token
      });

   } catch (error) {

      console.log("REGISTER ERROR:", error);

      return res.status(500).json({
         message: "User not registered",
         error: error.message,
         success: false,
      });
   }
};


const verifyUser = async (req, res, next) => {

   const { token } = req.params;

   console.log("TOKEN:", token);

   if (!token) {
      return res.status(400).json({
         message: "Invalid token"
      });
   }

   try {

      const user = await User.findOne({
         verificationToken: token
      });

      if (!user) {
         return res.status(400).json({
            message: "Invalid token"
         });
      }

      user.isVerified = true;
      user.verificationToken = undefined;

      await user.save();

      return res.status(200).json({
         message: "Email verified successfully",
         success: true
      });

   } catch (error) {

      console.log("VERIFY ERROR:", error);

      return res.status(500).json({
         message: "Verification failed",
         error: error.message,
         success: false
      });
   }
};
const login = async (req, res) => {
   const { email, password } = req.body;

   console.log("LOGIN CONTROLLER HIT");
   console.log(req.body);
   

   if (!email || !password) {
      return res.status(400).json({
         message: "All fields are required"
      });
   }

   try {
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({
            message: "Invalid email or password"
         });
      }
      if(!user.isVerified){
         return res.status(400).json({
            message:"plaese verify your email first"
         });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      console.log("Password match:", isMatch);

      if (!isMatch) {
         return res.status(400).json({
            message: "Invalid email or password"
         });
      }

      const token = jwt.sign(
         {
            id: user._id,
            role: user.role
         },
        process.env.JWT_SECRET,
         {
            expiresIn: "24h"
         }
      );

      const cookieOptions = {
         httpOnly: true,
         secure: false,
         maxAge: 24 * 60 * 60 * 1000
      };

      res.cookie("token", token, cookieOptions);

      return res.status(200).json({
         success: true,
         message: "Login successful",
         token,
         user: {
            id: user._id,
            name: user.name,
            role: user.role
         }
      });

   } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
        success: false,
        message: error.message
    });
}
}

const getMe = async (req,res) => {
   try {
      console.log("getme successfully");
     const user= await User.findById(req.user.id).select('-password')
        
      if(!user){
         return res.status(400).json({
            success:false,
            message: "user not found",
         });
      }
      res.status(200).json({
         success:true,
         user
      })
   } catch (error) {

   }
}
 
const logoutUser = async (req, res) => {
    try {
      console.log("logged controller reached");
        res.cookie("token",'',{});

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });
    }
};
 const forgetpassword = async (req,res) => {
   try {
      //get email
      // find user based on email
      // resest token + reset expiry => Date.now() + 10*60*1000 => user.save()
      // send mail => design url

   } catch (error) {

   }
}
 const resetpassword = async (req,res) => {
   try {
      // collect token from params
      //password from req.body
      const {token} = req.params
      const {password} = req.body

    
         const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt:Date.now()}
         })
         // set password in user
         // resettoken, resetExpiry => reset
         //save
      

   } catch (error) {

   }
};

export {registerUser,verifyUser,login,getMe,logoutUser,forgetpassword,resetpassword};
 

   