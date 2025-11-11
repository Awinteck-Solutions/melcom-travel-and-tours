import {Request, Response} from "express";
import {UserResponse} from "../dto/user.dto";
import {Status} from "../enums/status.enum";
import multer from "multer";
import User from "../schema/user.schema";
import {encrypt} from "../../../helpers/tokenizer";
import {Roles} from "../enums/roles.enum";
import UserCheckout from "../../userCheckout/schema/userCheckout.schema";

export class UserController {
  // Admin routes

  // Get admin users list
  static async getAdminUsers(req: Request, res: Response) {
    try {
      console.log('Roles.USER', Roles.USER)
      const users = await User.find({role: {$ne: Roles.USER}, status:{ $ne:Status.DELETED}});
      return res
        .status(200)
        .json({
          status: true,
          message: "Admin users fetched successfully",
          response: users,
        });
    } catch (error) {
      console.log('error', error)
      return res
        .status(500)
        .json({status: false, message: "Internal server error"});
    }
  }

  // GET ALL USERS
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find({role: Roles.USER, status:{ $ne:Status.DELETED}});
      return res
        .status(200)
        .json({
          status: true,
          message: "Users fetched successfully",
          response: users,
        });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }

  // DELETE ACCOUNT
  static async deleteUser(req: Request, res: Response) {
    try {
      const {id} = req.params;

      User.updateOne({_id: id}, {$set: {status: Status.DELETED}})
        .then((result) => {
          return res
            .status(200)
            .json({
              status: true,
              message: "User deleted successfully",
              response: result,
            });
        })
        .catch((error) => {
          return res
            .status(404)
            .json({
              status: false,
              message: "User not found",
              response: error.message,
            });
        });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }

  // GET SINGLE USERS
  static async getOneUser(req: Request, res: Response) {
    try {
      let {id} = req.params;
      User.findOne({_id: id})
        .then((response) => {
          return res.status(201).json({
            status: true,
            message: "User success",
            response,
          });
        })
        .catch((error) => {
          return res.status(404).json({
            status: false,
            message: "User failed",
            other: error,
          });
        });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }

  // GET ALL CHECKOUTS FOR A USER
  static async getAllCheckoutsForUser(req: Request, res: Response) {
    try {
      let {email} = req.params;
      const checkouts = await UserCheckout.find({ "contactInfo.email": email });
      
      return res.status(200).json({status: true, message: "Checkouts fetched successfully", response: checkouts});
    } catch (error) {
      return res.status(500).json({status: false, message: "Internal server error", response: error.message});
    }
  }

  // GET ALL USERS
  static async updateUser(req: Request, res: Response) {
    try {
      let {id} = req.params;

      User.findOneAndUpdate(
        {_id: id},
        {...req.body},
        {new: true, runValidators: true}
      )
        .then((response) => {
          if (response) {
            return res
              .status(200)
              .json({
                status: true,
                message: "User updated successfully",
                response: response,
              });
          } else {
            return res
              .status(404)
              .json({status: false, message: "User not found"});
          }
        })
        .catch((error) => {
          return res.status(404).json({
            status: false,
            message: error.message,
          });
        });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }
}
