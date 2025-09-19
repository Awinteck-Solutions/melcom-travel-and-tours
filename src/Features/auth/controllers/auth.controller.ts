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
