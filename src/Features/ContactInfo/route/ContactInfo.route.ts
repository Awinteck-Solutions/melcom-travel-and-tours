import * as express from "express";
import {Response, Request} from "express";
import { ContactInfoController } from "../controllers/ContactInfo.controller";
const Router = express.Router();

// ----------------------------------------- ContactInfo ROUTES ---------------------------------------------------
//
Router.post("/contact-info", (req: Request, res: Response) => {
  ContactInfoController.create(req, res);
});

Router.get("/contact-info/", (req: Request, res: Response) => {
  ContactInfoController.getById(req, res);
});

Router.put("/contact-info/", (req: Request, res: Response) => {
  ContactInfoController.update(req, res);
});

export default Router;