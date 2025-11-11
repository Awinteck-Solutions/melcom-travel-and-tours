import * as express from "express";
import {Response, Request} from "express";
import {CountryListController} from "../controllers/countryList.controller";

const Router = express.Router();
// use dedicated CountryList controller

// ----------------------------------------- Country List ROUTES ---------------------------------------------------

// CountryList CRUD
Router.get("/country-list", (req: Request, res: Response) => {
  CountryListController.list(req, res);
});
Router.get("/country-list/:id", (req: Request, res: Response) => {
  CountryListController.getById(req, res);
});
Router.post("/country-list", (req: Request, res: Response) => {
  CountryListController.create(req, res);
});
Router.put("/country-list/:id", (req: Request, res: Response) => {
  CountryListController.update(req, res);
});
Router.delete("/country-list/:id", (req: Request, res: Response) => {
  CountryListController.remove(req, res);
});

// CountryListCategory CRUD
Router.get("/country-list-categories", (req: Request, res: Response) => {
  CountryListController.listCategories(req, res);
});
Router.get("/country-list-categories/:id", (req: Request, res: Response) => {
  CountryListController.getCategoryById(req, res);
});
Router.post("/country-list-categories", (req: Request, res: Response) => {
  CountryListController.createCategory(req, res);
});
Router.put("/country-list-categories/:id", (req: Request, res: Response) => {
  CountryListController.updateCategory(req, res);
});
Router.delete("/country-list-categories/:id", (req: Request, res: Response) => {
  CountryListController.removeCategory(req, res);
});

export default Router;
