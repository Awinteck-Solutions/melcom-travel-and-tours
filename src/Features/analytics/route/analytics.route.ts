import * as express from "express";
import { Response, Request } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { authentification } from "../../../middlewares/authentication.middleware";

const Router = express.Router();

// ----------------------------------------- ANALYTICS ROUTES ---------------------------------------------------

// EVENT LOGGING (Can be public for tracking)
Router.post("/logs", (req: Request, res: Response) => {
  AnalyticsController.logEvent(req, res);
});

// ADMIN ANALYTICS ROUTES (Protected)
Router.get("/logs", authentification, (req: Request, res: Response) => {
  AnalyticsController.getLogs(req, res);
});

Router.get("/total-users", authentification, (req: Request, res: Response) => {
  AnalyticsController.getTotalUsers(req, res);
});

Router.get(
  "/total-bookings",
  authentification,
  (req: Request, res: Response) => {
    AnalyticsController.getTotalBookings(req, res);
  }
);

Router.get("/total-amount", authentification, (req: Request, res: Response) => {
  AnalyticsController.getTotalAmount(req, res);
});

Router.get(
  "/total-cancellations",
  authentification,
  (req: Request, res: Response) => {
    AnalyticsController.getTotalCancellations(req, res);
  }
);

Router.get(
  "/total-contact-info",
  authentification,
  (req: Request, res: Response) => {
    AnalyticsController.getTotalContactInfo(req, res);
  }
);

Router.get("/dashboard", authentification, (req: Request, res: Response) => {
  AnalyticsController.getAnalyticsDashboard(req, res);
});

Router.get("/summary", authentification, (req: Request, res: Response) => {
  AnalyticsController.getAnalyticsSummary(req, res);
});

export default Router;
