import express, {Response, Request} from "express";
import {UserController} from "../controllers/user.controller";
import {Notification} from "../enums/notification.enum";
import {Roles} from "../enums/roles.enum";
import path from "path";
import multer from "multer";
import {upload} from "../../../helpers/uploader";
import {authentification} from "../../../middlewares/authentication.middleware";
import {authorization} from "../../../middlewares/authorization.middleware";

const Router = express.Router();

// Get admin users list
Router.get(
  "/admins",
  authentification,
  authorization([Roles.ADMIN]),
  (req: Request, res: Response) => {
    UserController.getAdminUsers(req, res);
  }
);

// Get all users list
Router.get(
  "/clients",
  authentification,
  authorization([Roles.ADMIN]),
  (req: Request, res: Response) => {
    UserController.getAllUsers(req, res);
  }
);

// GET ALL CHECKOUTS FOR A USER
Router.get("/:email/checkouts", authentification, (req: Request, res: Response) => {
  UserController.getAllCheckoutsForUser(req, res);
});

// GET SINGLE USERS
Router.get("/:id", (req: Request, res: Response) => {
  UserController.getOneUser(req, res);
});

Router.patch("/:id", authentification, (req: Request, res: Response) => {
  UserController.updateUser(req, res);
});

// UPDATE PROFILE
Router.delete("/:id", authentification, (req: Request, res: Response) => {
  UserController.deleteUser(req, res);
});

export default Router;
