import { Request, Response } from "express";
import { encrypt } from "../../../helpers/tokenizer";
import { Roles } from "../enums/roles.enum";
import { UserResponse } from "../dto/user.dto";
import { Status } from "../enums/status.enum";
import { randomInt } from "crypto";
import { sendMail } from "../../../helpers/emailer";
import User from "../schema/user.schema";
import getRandomInt from "../../../helpers/random";
import Notification from "../schema/notification.schema";

export class AuthController {
  // SIGNUP
  static async signup(req: Request, res: Response) {
    try {
      const { firstname, lastname, email, password } = req.body;

      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
          status: false,
          message: "All fields (firstname, lastname, email, password) are required",
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
        firstname,
        lastname,
        email,
        password: encryptedPassword,
        otp,
      });

      const savedUser = await user.save();

      // Generate JWT token
      const token = await encrypt.generateToken({
        id: savedUser._id,
        email: savedUser.email,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        role: savedUser.role,
      });

      // Remove sensitive data from response
      const userResponse = {
        id: savedUser._id,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
      };

      return res.status(201).json({
        status: true,
        message: "New User registered successfully",
        data: {
          user: userResponse,
          token,
        },
      });

    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
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

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Invalid email or password",
        });
      }

      // Compare password
      const isPasswordValid = await encrypt.comparepassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: false,
          message: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = await encrypt.generateToken({
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      });

      // Remove sensitive data from response
      const userResponse = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        status: user.status,
      };

      return res.status(200).json({
        status: true,
        message: "Login successful",
        data: {
          user: userResponse,
          token,
        },
      });

    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // FORGET PASSWORD
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email is required",
        });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User with this email does not exist",
        });
      }

      // Generate JWT token for password reset (expires in 5 minutes)
      const resetToken = await encrypt.generateResetToken({
        userId: user._id,
        email: user.email,
      });

      // Create reset link
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

      // Send email with reset link
      try {
        await sendMail(
          user.email,
          user.firstname || "User",
          "Password Reset Request - Melcom Travels",
          "resetPasswordHtml",
          {
            resetLink,
            firstname: user.firstname || "User",
            expiresIn: "5 minutes",
          }
        );

        return res.status(200).json({
          status: true,
          message: "Password reset link sent to your email. The link expires in 5 minutes.",
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        return res.status(500).json({
          status: false,
          message: "Failed to send reset email. Please try again.",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // RESET PASSWORD
  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "Token, new password, and confirm password are required",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "New password and confirm password do not match",
        });
      }

      // Verify the reset token
      const decoded = await encrypt.verifyResetToken(token);
      if (!decoded || typeof decoded === 'string') {
        return res.status(400).json({
          status: false,
          message: "Invalid or expired reset token",
        });
      }

      // Find user by ID from token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // Encrypt new password
      const encryptedPassword = await encrypt.encryptpass(newPassword);

      // Update user password
      await User.findByIdAndUpdate(user._id, { password: encryptedPassword });

      return res.status(200).json({
        status: true,
        message: "Your password has been reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // CHANGE PASSWORD
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).user?.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          status: false,
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

      const isValidPassword = await encrypt.comparepassword(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json({
          status: false,
          message: "Current password is incorrect",
        });
      }

      const encryptedNewPassword = await encrypt.encryptpass(newPassword);
      await User.findByIdAndUpdate(userId, { password: encryptedNewPassword });

      return res.status(200).json({
        status: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error,
      });
    }
  }

  // GET NOTIFICATIONS
  static async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const notifications = await Notification.find({ userId }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        status: true,
        message: "Notifications retrieved successfully",
        data: notifications,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve notifications",
        error: error,
      });
    }
  }

  // UPDATE NOTIFICATION STATUS
  static async updateNotificationStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { read } = req.body;
      const userId = (req as any).user?.id;

      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId },
        { read },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({
          status: false,
          message: "Notification not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Notification status updated successfully",
        data: notification,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update notification status",
        error: error,
      });
    }
  }

  // GET USER PROFILE
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      const user = await User.findById(userId).select("-password -otp");
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Profile retrieved successfully",
        data: user,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve profile",
        error: error,
      });
    }
  }

  // UPDATE USER PROFILE
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { firstname, lastname, phone, dateOfBirth, address } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          firstname,
          lastname,
          phone,
          dateOfBirth,
          address,
        },
        { new: true }
      ).select("-password -otp");

      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update profile",
        error: error,
      });
    }
  }
}
