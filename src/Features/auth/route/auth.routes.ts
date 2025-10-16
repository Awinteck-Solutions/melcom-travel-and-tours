import * as express from "express"; 
import {Response, Request} from "express"; 
import * as multer from 'multer';
import path = require("path");
import { Roles } from "../enums/roles.enum";
import { AuthController } from "../controllers/auth.controller";
import { authentification } from "../../../middlewares/authentication.middleware";
import { Notification } from "../enums/notification.enum";
import { upload } from "../../../helpers/uploader";
import { notification } from "../../../middlewares/notification.middleware";
import User from "../schema/user.schema";


const Router = express.Router();

// ----------------------------------------- AUTH ROUTES ---------------------------------------------------
interface MulterRequest extends Request {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
}
  
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

Router.post("/google",
    (req: Request, res: Response) => { 
        AuthController.googleAuth(req, res)
    }
);

Router.post("/forget-password",
    notification(Notification.FORGOT_PASSWORD, User),
    (req: Request, res: Response) => { 
        AuthController.forgetPassword(req, res)
    }
);

// RESET PASSWORD
Router.post("/reset-password",
    notification(Notification.RESET_PASSWORD, User),
    (req: Request, res: Response) => { 
        AuthController.resetPassword(req,res)
    }
);

Router.post("/change-password",
    authentification,
    (req: Request, res: Response) => { 
        AuthController.changePassword(req, res)
    }
);

// verify otp
Router.post("/verify-otp",
    (req: Request, res: Response) => { 
        AuthController.verifyOtp(req, res)
    }
);

// NOTIFICATIONS
Router.get("/notification-alerts",
    authentification,
    (req: Request, res: Response) => { 
        AuthController.getNotificationAlerts(req, res)
    }
);

Router.put("/notification-alerts",
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
    (req: MulterRequest, res: Response) => { 
        AuthController.updateProfile(req, res)
    }
);


export default Router;