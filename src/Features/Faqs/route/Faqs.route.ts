import * as express from "express";
import {Response, Request} from "express";
import {FaqsController} from "../controllers/Faqs.controller";
const Router = express.Router();

// ----------------------------------------- FAQs ROUTES ---------------------------------------------------

Router.get("/faqs", (req: Request, res: Response) => {
  FaqsController.list(req, res);
});

Router.get("/faqs/admin", (req: Request, res: Response) => {
  FaqsController.adminList(req, res);
});
Router.get("/faqs/:id", (req: Request, res: Response) => {
  FaqsController.getById(req, res);
});
Router.post("/faqs", (req: Request, res: Response) => {
  FaqsController.create(req, res);
});
Router.put("/faqs/:id", (req: Request, res: Response) => {
  FaqsController.update(req, res);
});
Router.delete("/faqs/:id", (req: Request, res: Response) => {
  FaqsController.remove(req, res);
});

export default Router;
