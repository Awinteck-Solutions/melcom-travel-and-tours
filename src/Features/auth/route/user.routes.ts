import express, { Response, Request } from "express";
import { UserController } from "../controllers/user.controller";
import { Notification } from "../enums/notification.enum";
import { Roles } from "../enums/roles.enum";
import path from "path";
import multer from "multer";
import { upload } from "../../../helpers/uploader";
import { authentification } from "../../../middlewares/authentication.middleware";
import { authorization } from "../../../middlewares/authorization.middleware";

// Extend Express Request to include Multer's file property
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const Router = express.Router();

// DELETE ACCOUNT
Router.delete(
  "/delete-user/:id",
  authentification,
  (req: Request, res: Response) => {
    UserController.deleteUser(req, res);
  }
);

// GET ALL USERS
Router.get(
  "/",
  authentification,
  authorization([Roles.ADMIN, Roles.HR, Roles.PAYROLL, Roles.PROJECTS]),
  (req: Request, res: Response) => {
    UserController.getAllUsers(req, res);
  }
);

// GET SINGLE USERS
Router.get("/:id", (req: Request, res: Response) => {
  UserController.getOneUser(req, res);
});

Router.patch(
  "/update-user/:id",
  authentification,
  (req: MulterRequest, res: Response) => {
    UserController.updateUser(req, res);
  }
);

// GET PROFILE
Router.get("/profile", authentification, (req: Request, res: Response) => {
  UserController.profile(req, res);
});

// UPDATE PROFILE
Router.patch(
  "/update-user",
  authentification,
  (req: MulterRequest, res: Response) => {
    UserController.updateUser(req, res);
  }
);

// CHANGE PASSWORD
Router.patch(
  "/change-password",
  authentification,
  (req: Request, res: Response) => {
    UserController.changePassword(req, res);
  }
);

export default Router;
