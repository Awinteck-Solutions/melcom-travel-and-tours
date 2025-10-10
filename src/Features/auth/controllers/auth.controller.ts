import { Request, Response } from "express";
import { encrypt } from "../../../helpers/tokenizer";
import { Roles } from "../enums/roles.enum";
import { UserResponse } from "../dto/user.dto";
import { Status } from "../enums/status.enum";
import { randomInt } from "crypto";
import { sendMail } from "../../../helpers/emailer";
import User from "../schema/user.schema";
import getRandomInt from "../../../helpers/random";

export class AuthController {
  // SIGNUP
  static async signup(req: Request, res: Response) {
    try {
      const { firstname, lastname, email, password } = req.body;

      // Check if the email already exists
      //generate OTP code
      var otp = getRandomInt(999, 9999);

      const encryptedPassword = await encrypt.encryptpass(password);

      const user = User({
        firstname,
        lastname,
        email,
        password: encryptedPassword,
        otp,
      });
      user
        .save()
        .then((user) => {
          const token = encrypt.generateToken({
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
          });

          return res.status(201).json({
            status: true,
            message: "New User registered",
            user: { ...user._doc, token },
          });
        })
        .catch((error) => {
          console.log("error :>> ", error);
          return res.status(404).json({
            status: false,
            message: "Unsuccessful registration",
            other: error,
          });
        });

      //    sendMail(
      //     user.email,
      //     user.firstname,
      //     'LMG - Welcome',
      //     'signupHtml',''
      // )
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error["sqlMessage"] });
    }
  }

  // LOGIN

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(500)
          .json({ message: " email and password required" });
      }
      console.log("email, password :>> ", email, password);

      User.findOne({ email })
        .then((user) => {
          console.log("result :>> ", user);
          let remotePassword = user.password;
          encrypt
            .comparepassword(password, remotePassword)
            .then((result) => {
              if (result == true) {
                console.log("bcrypt message", result);
                //sending response
                const token = encrypt.generateToken({
                  id: user._id,
                  email: user.email,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  role: user.role,
                });
                return res.json({
                  status: true,
                  message: "Login success",
                  response: { ...user, token },
                });
              } else {
                res.status(404).json({
                  status: false,
                  message: "password incorrect!",
                });
              }
            })
            .catch((err) => {
              res.status(404).json({
                status: false,
                message: "password error!",
              });
              return;
            });
        })
        .catch((error) => {
          res.status(404).json({
            status: false,
            message: "password incorrect!",
          });
        });

      // sendMail(
      //     'barnabassampawin@gmail.com',
      //     user.firstname,
      //     'Login success',
      //     'signup',''
      // )
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
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
      const userId = req.user?.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      // TODO: Implement password change logic
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
      const userId = req.user?.id;

      // TODO: Implement notification alerts logic
      let response = []; // This will be populated from database

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
      const { id } = req.params;
      const { status } = req.body;

      // TODO: Implement notification status update logic
      let response = {}; // This will be populated after update

      return res.status(200).json({
        success: true,
        message: "Notification status updated successfully",
        response,
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

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const profileImage = req.file;

      // TODO: Implement profile update logic
      let response = {}; // This will be populated after update

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        response,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }
}
