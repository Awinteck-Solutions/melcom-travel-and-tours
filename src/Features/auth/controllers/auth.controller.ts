import { Request, Response } from "express";
import { encrypt } from "../../../helpers/tokenizer";
import { Roles } from "../enums/roles.enum";
import { UserResponse } from "../dto/user.dto";
import { Status } from "../enums/status.enum";
import { randomInt } from "crypto";
import { sendMail } from "../../../helpers/emailer";
import User from "../schema/user.schema";
import getRandomInt from "../../../helpers/random";
import { OAuth2Client } from "google-auth-library";
import multer from "multer";
import path from "path";


interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}
export class AuthController {
  // SIGNUP
  static async signup(req: Request, res: Response) {
    try {
      const { firstname, lastname, email, password } = req.body;

      // Validate required fields
      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
          status: false,
          message:
            "All fields (firstname, lastname, email, password) are required",
        });
      }

      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          status: false,
          message: "User with this email already exists",
        });
      }

      // Generate OTP code
      const otp = getRandomInt(999, 9999);
      const encryptedPassword = await encrypt.encryptpass(password);

      const user = new User({
        ...req.body,
        role: req.body.role.toUpperCase() || "USER",
        password: encryptedPassword,
        otp,
      });

      const savedUser = await user.save();
      const token = await encrypt.generateToken({
        id: savedUser._id,
        email: savedUser.email,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        role: savedUser.role,
      });


      sendMail(
        savedUser.email,
        savedUser.firstname,
        'Melcom Travels - Welcome',
        'signupHtml',
        ''
      )
      

      return res.status(201).json({
        status: true,
        message: "User registered successfully",
        user: {
          ...user._doc,
          id: user._id,
          password: null,
          token: token,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ 
        status: false,
        message: "Internal server error", 
        error: error.message || "Unknown error"
      });
    }
  }

  // LOGIN

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "Email and password are required",
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      const isPasswordValid = await encrypt.comparepassword(
        password,
        user.password
      );

      if (isPasswordValid) {
        const token = await encrypt.generateToken({
          id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        });

        // console.log('user: ', {
        //     ...user._doc,
        //     id: user._id,
        //     image:  user.image && user.image !== null ? `${process.env.BASE_URL}/${user.image}` : null,
        //     password: null,
        //     token: token,
        //   },)
        return res.json({
          status: true,
          message: "Login successful",
          user: {
            ...user._doc,
            id: user._id,
            image:  user.image && user.image !== null ? `${process.env.BASE_URL}/${user.image}` : null,
            password: null,
            token: token,
          },
        });
      } else {
        return res.status(401).json({
          status: false,
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }

  // GOOGLE AUTHENTICATION
  static async googleAuth(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          status: false,
          message: "Google ID token is required"
        });
      }

      // Initialize Google OAuth client
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      // Verify the Google ID token
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        return res.status(401).json({
          status: false,
          message: "Invalid Google token"
        });
      }

      const { email, given_name, family_name, picture, sub: googleId } = payload;

      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        // User exists, update Google ID if not already set
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
      } else {
        // Create new user with Google details
        const otp = getRandomInt(999, 9999);
        
        user = new User({
          firstname: given_name || "Google",
          lastname: family_name || "User",
          email: email,
          password: await encrypt.encryptpass(googleId), // Use Google ID as password backup
          otp,
          googleId: googleId,
          image: picture || null,
          status: "ACTIVE"
        });

        await user.save();
      }

      // Generate JWT token
      const token = encrypt.generateToken({
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      });

      return res.json({
        status: true,
        message: "Google authentication successful",
        user: {
          id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          image: user.image,
          token: token
        },
      });

    } catch (error) {
      console.error("Google auth error:", error);
      return res.status(500).json({
        status: false,
        message: "Google authentication failed",
        error: error.message
      });
    }
  }

  // FORGET PASSWORD
  static async forgotPassword(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Reset token sent to your email" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error["sqlMessage"] });
    }
  }
  // RESET PASSWORD
  static async resetPassword(req: Request, res: Response) {
    try {
      res
        .status(200)
        .json({ message: "Your password has been reset successfull" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error["sqlMessage"] });
    }
  }

  // REGISTER (alias for signup)
  static async register(req: Request, res: Response) {
    return AuthController.signup(req, res);
  }

  // FORGET PASSWORD (alias for forgotPassword)
  static async forgetPassword(req: Request, res: Response) {
    return AuthController.forgotPassword(req, res);
  }

  // CHANGE PASSWORD
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req["currentUser"].id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      const isPasswordValid = await encrypt.comparepassword(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          status: false,
          message: "Invalid current password",
        });
      }

      user.password = await encrypt.encryptpass(newPassword);
      await user.save();

      sendMail(
        user.email,
        user.firstname,
        'Melcom Travels - Password Reset',
        'resetSuccessHtml',
        ''
      )
      
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to change password",
      });
    }
  }

  // NOTIFICATION ALERTS
  static async getNotificationAlerts(req: Request, res: Response) {
    try {
      const userId = req["currentUser"].id;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      let response = user.notifications;
      console.log('response :>> ', response);
      
      return res.status(200).json({
        success: true,
        message: "Notification alerts retrieved successfully",
        response,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve notification alerts",
      });
    }
  }

  static async updateNotificationStatus(req: Request, res: Response) {
    try {
      const { id } = req["currentUser"];
      const payload = req.body;

      console.log('payload :>> ', payload);
      console.log('id :>> ', id);
      // notification update logic
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      console.log('payload', payload)
      user.notifications = payload;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Notification status updated successfully",
        user: {
          ...user._doc, id: user._id, password: null,
          image: `${process.env.BASE_URL}/${user.image}`,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update notification status",
      });
    }
  }

  // PROFILE
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      // TODO: Implement get profile logic
      let response = {}; // This will be populated from database

      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        response,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve profile",
      });
    }
  }


   // UPLOAD PROFILE IMAGE
   static async updateProfile(req: MulterRequest, res: Response) {
    try {
      const { id } = req["currentUser"];
      const payload = req.body;
    
      if(req.file){
        payload.image = path.join(req.body.fileType || "uploads", req.file.filename);
      }
      // Update admin profile with image URL
      const user = await User.findByIdAndUpdate(
        id,
        { ...payload },
        {new: true, runValidators: true}
      );

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Profile image uploaded successfully",
        user: {
          ...user._doc, id: user._id,
        },
      });
    } catch (error) { 
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message || error,
      });
    }
   }
  
  static async verifyOtp(req: Request, res: Response) {
    try {
      const { otp, email } = req.body;
      const user = await User.findOne({ email, otp });
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "Invalid OTP",
        });
      }
      user.otp = null;
      await user.save();
      return res.status(200).json({
        status: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Failed to verify OTP",
      });
    }
  }
}
