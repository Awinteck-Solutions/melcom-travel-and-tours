import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const analyticsRoutes = Router();
const analyticsController = new AnalyticsController();

// Analytics routes - GET only as requested
analyticsRoutes.get("/logs", analyticsController.getLogs.bind(analyticsController));
analyticsRoutes.get("/dashboard", analyticsController.getDashboardAnalytics.bind(analyticsController));
analyticsRoutes.get("/users", analyticsController.getUsersAnalytics.bind(analyticsController));
analyticsRoutes.get("/bookings", analyticsController.getBookingsAnalytics.bind(analyticsController));
analyticsRoutes.get("/amount", analyticsController.getAmountAnalytics.bind(analyticsController));
analyticsRoutes.get("/cancelations", analyticsController.getCancellationsAnalytics.bind(analyticsController));
analyticsRoutes.get("/contact-info", analyticsController.getContactInfoAnalytics.bind(analyticsController));

export default analyticsRoutes;