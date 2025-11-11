import * as express from "express";
import { Response, Request } from "express";
import { SupportFormsController } from "../controllers/SupportForms.controller";

const Router = express.Router();

// ----------------------------------------- SupportForms ROUTES ---------------------------------------------------

Router.get("/support-forms", (req: Request, res: Response) => {
  SupportFormsController.list(req, res);
});

Router.get("/support-forms/:id", (req: Request, res: Response) => {
  SupportFormsController.getById(req, res);
});

Router.post("/support-forms", (req: Request, res: Response) => {
  SupportFormsController.create(req, res);
});

Router.put("/support-forms/:id", (req: Request, res: Response) => {
  SupportFormsController.update(req, res);
});

Router.delete("/support-forms/:id", (req: Request, res: Response) => {
  SupportFormsController.remove(req, res);
});

export default Router;