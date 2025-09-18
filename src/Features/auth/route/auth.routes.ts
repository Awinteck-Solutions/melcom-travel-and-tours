import * as express from "express"; 
import {Response, Request} from "express"; 
import * as multer from 'multer';
import path = require("path");
import { Roles } from "../enums/roles.enum";
import { AuthController } from "../controllers/auth.controller";
import { authentification } from "../../../middlewares/authentication.middleware";
import { Notification } from "../enums/notification.enum";
import { upload } from "../../../helpers/uploader";


const Router = express.Router();

// ----------------------------------------- AUTH ROUTES ---------------------------------------------------

// AUTHENTICATION
Router.post("/register",
    (req: Request, res: Response) => { 
        AuthController.register(req, res)
    }
);

Router.post("/login",
    (req: Request, res: Response) => { 
        AuthController.login(req, res)
    }
);

Router.post("/forget-password",
    (req: Request, res: Response) => { 
        AuthController.forgetPassword(req, res)
    }
);

Router.post("/change-password",
    authentification,
    (req: Request, res: Response) => { 
        AuthController.changePassword(req, res)
    }
);

// NOTIFICATIONS
Router.get("/notification-alerts",
    authentification,
    (req: Request, res: Response) => { 
        AuthController.getNotificationAlerts(req, res)
    }
);

Router.put("/notification-alerts/:id",
    authentification,
    (req: Request, res: Response) => { 
        AuthController.updateNotificationStatus(req, res)
    }
);

// PROFILE
Router.get("/profile",
    authentification,
    (req: Request, res: Response) => { 
        AuthController.getProfile(req, res)
    }
);

Router.put("/profile",
    authentification,
    upload.single('profileImage'),
    (req: Request, res: Response) => { 
        AuthController.updateProfile(req, res)
    }
);

export default Router;