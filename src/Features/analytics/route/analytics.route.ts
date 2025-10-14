import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const analyticsRoutes = Router();
const analyticsController = new AnalyticsController();

// Analytics routes - GET only as requested
analyticsRoutes.get(
  "/logs",
  analyticsController.getLogs.bind(analyticsController)
);
analyticsRoutes.get(
  "/total-users",
  analyticsController.getUsersAnalytics.bind(analyticsController)
);
analyticsRoutes.get(
  "/total-bookings",
  analyticsController.getBookingsAnalytics.bind(analyticsController)
);
analyticsRoutes.get(
  "/total-amount",
  analyticsController.getAmountAnalytics.bind(analyticsController)
);
analyticsRoutes.get(
  "/total-cancelations",
  analyticsController.getCancellationsAnalytics.bind(analyticsController)
);
analyticsRoutes.get(
  "/total-contact-info",
  analyticsController.getContactInfoAnalytics.bind(analyticsController)
);

export default analyticsRoutes;
