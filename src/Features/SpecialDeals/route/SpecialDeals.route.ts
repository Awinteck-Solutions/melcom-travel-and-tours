import * as express from "express";
import {Response, Request} from "express";
import { SpecialDealsController } from "../controllers/SpecialDeals.controller";
const Router = express.Router();

// ----------------------------------------- SpecialDeals ROUTES ---------------------------------------------------
//
// SpecialDeals CRUD
Router.get("/special-deals", (req: Request, res: Response) => {
  SpecialDealsController.list(req, res);
});

Router.get("/special-deals/:id", (req: Request, res: Response) => {
  SpecialDealsController.getById(req, res);
});

Router.post("/special-deals", (req: Request, res: Response) => {
  SpecialDealsController.create(req, res);
});

Router.put("/special-deals/:id", (req: Request, res: Response) => {
  SpecialDealsController.update(req, res);
});

Router.delete("/special-deals/:id", (req: Request, res: Response) => {
  SpecialDealsController.remove(req, res);
});

// SpecialDealsCategory CRUD
Router.get("/special-deals-categories", (req: Request, res: Response) => {
  SpecialDealsController.listCategories(req, res);
});

Router.get("/special-deals-categories/:id", (req: Request, res: Response) => {
  SpecialDealsController.getCategoryById(req, res);
});

Router.post("/special-deals-categories", (req: Request, res: Response) => {
  SpecialDealsController.createCategory(req, res);
});

Router.put("/special-deals-categories/:id", (req: Request, res: Response) => {
  SpecialDealsController.updateCategory(req, res);
});

Router.delete("/special-deals-categories/:id", (req: Request, res: Response) => {
  SpecialDealsController.removeCategory(req, res);
});

export default Router;