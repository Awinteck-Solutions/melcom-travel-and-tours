import { Request, Response } from "express";
import { UserResponse } from "../dto/user.dto";
import { Status } from "../enums/status.enum";
import multer from "multer";
import User from "../schema/user.schema";
import { encrypt } from "../../../helpers/tokenizer";

// Extend Express Request to include Multer's file property
interface MulterRequest extends Request {
  file: multer.File;
}
export class UserController {
  // Admin routes

 

  // DELETE ACCOUNT
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      User.deleteOne({_id:id})
      .then((result) => {
          return res.status(201).json({
              status:true,
              message: 'User delete success', 
          });
      }).catch((error) => {
          return res.status(404).json({
              status: false,
              message: 'User delete failed',
              other: error
          });
      })
  
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error"
        });
    }
  }

  // GET ALL USERS
  static async getAllUsers(req: Request, res: Response) {
    try {
      User.find()
      .then((result) => {
          return res.status(201).json({
              status:true,
              message: 'User success', 
          });
      }).catch((error) => {
          return res.status(404).json({
              status: false,
              message: 'User failed',
              other: error
          });
      })
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error"
        });
    }
  }

  // GET SINGLE USERS
  static async getOneUser(req: Request, res: Response) {
    try {
      let { id } = req.params;
      User.findOne({_id:id})
        .then((response) => {
            return res.status(201).json({
                status:true,
                message: 'User success', 
                response
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User failed',
                other: error
            });
        })

    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error"
        });
    }
  }

  // GET ALL USERS
  static async updateUserStatus(req: Request, res: Response) {
    try {
      let { id } = req.params;
      let { status } = req.body;
      User.findOneAndUpdate(
        { _id: id }, 
        { $set: status },
        { new: true, runValidators: true }
      )
        .then((response) => {
            return res.status(201).json({
                status:true,
              message: 'User success', 
                response
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User failed',
                other: error
            });
        })
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error"
        });
    }
  }


  
  // User routes
  // GET PROFILE
  static async profile(req: Request, res: Response) {
    try {
      const { id } = req["currentUser"];
      console.log("id :>> ", id);
      User.findOne({_id:id})
      .then((response) => {
          return res.status(201).json({
              status:true,
              message: 'User success', 
              response
          });
      }).catch((error) => {
          return res.status(404).json({
              status: false,
              message: 'User failed',
              other: error
          });
      })
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error"
        });
    }
  }

  static async updateUser(req: MulterRequest, res: Response) {
    try {
      const { id } = req["currentUser"];
      const allowedFields = [
        "firstname",
        "lastname",
        "phoneNumber",
        "profileImage",
      ];
      const updates = req.body;
      const profileImage = req.file ? req.file.filename : null;

      const user:any = {};
      // Only allow updates for specific fields
      Object.keys(updates).forEach((key) => {
        if (allowedFields.includes(key)) {
          user[key] = updates[key];
        }
      });

      // Update profile image if provided
      if (profileImage) {
        user.profileImage = profileImage;
      }

      User.updateOne({_id:id}, {...user}, {upsert:false})
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'User update success', 
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User update failed',
                other: error
            });
        })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // CHANGE PASSWORD
  static async changePassword(req: Request, res: Response) {
    try {
      const { id } = req["currentUser"];
      const { password, newPassword } = req.body;
      console.log("password, newPassword  :>> ", password, newPassword);
      if (!password || !newPassword) {
        return res.status(500).json({ message: "password required" });
      }
      
      const encryptPassword = await encrypt.encryptpass(newPassword);
      User.updateOne({ _id: id }, { password: encryptPassword }, { upsert: false })
      .then((result) => {
          return res.status(201).json({
              status:true,
              message: 'User update success', 
          });
      }).catch((error) => {
          return res.status(404).json({
              status: false,
              message: 'User update failed',
              other: error
          });
      })

      
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
}
