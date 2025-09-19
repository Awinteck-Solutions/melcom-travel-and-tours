import * as express from "express";
import { Response, Request } from "express";
import { CountriesController } from "../controllers/countries.controller";
import { authentification } from "../../../middlewares/authentication.middleware";

const Router = express.Router();

// ----------------------------------------- COUNTRIES ROUTES ---------------------------------------------------

// PUBLIC ROUTES
Router.get("/recommended-country-list", (req: Request, res: Response) => {
  CountriesController.getRecommendedCountries(req, res);
});

Router.get("/recommended-country", (req: Request, res: Response) => {
  CountriesController.getRecommendedCountryByCountry(req, res);
});

Router.get("/featured-countries", (req: Request, res: Response) => {
  CountriesController.getFeaturedCountries(req, res);
});

Router.get("/popular-countries", (req: Request, res: Response) => {
  CountriesController.getPopularCountries(req, res);
});

// ADMIN ROUTES (Protected)
Router.post(
  "/recommended-countries",
  authentification,
  (req: Request, res: Response) => {
    CountriesController.createRecommendedCountry(req, res);
  }
);

Router.put(
  "/recommended-countries/:id",
  authentification,
  (req: Request, res: Response) => {
    CountriesController.updateRecommendedCountry(req, res);
  }
);

Router.delete(
  "/recommended-countries/:id",
  authentification,
  (req: Request, res: Response) => {
    CountriesController.deleteRecommendedCountry(req, res);
  }
);

export default Router;
