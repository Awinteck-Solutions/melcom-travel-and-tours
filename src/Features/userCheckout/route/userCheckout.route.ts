import * as express from "express";
import { Response, Request } from "express";
import { UserCheckoutController } from "../controllers/userCheckout.controller";
import { authentification } from "../../../middlewares/authentication.middleware";
import { authorization } from "../../../middlewares/authorization.middleware";
import { Roles } from "../../../enums/roles.enum";

const Router = express.Router();

// ----------------------------------------- UserCheckout ROUTES ---------------------------------------------------

// Create checkout and initiate payment
Router.post("/create", UserCheckoutController.createCheckout.bind(UserCheckoutController));

// Handle Hubtel payment callback
Router.post("/payment/callback", UserCheckoutController.paymentCallback.bind(UserCheckoutController));

// Check payment status
Router.get("/status/:checkoutId", UserCheckoutController.checkPaymentStatus.bind(UserCheckoutController));

// Get all checkouts
Router.get("/", UserCheckoutController.getAllCheckouts.bind(UserCheckoutController));

// Test GOL booking
Router.get("/test/:bookingReference", UserCheckoutController.testGOlBooking.bind(UserCheckoutController));
// Admin routes
// Get all checkouts for admin (admin only)
Router.get(
  "/admin/all",
  authentification,
  authorization([Roles.ADMIN]),
  UserCheckoutController.getAllCheckoutsForAdmin.bind(UserCheckoutController)
);

// Get checkouts by user ID (admin only)
Router.get(
  "/admin/user/:userId",
  authentification,
  authorization([Roles.ADMIN]),
  UserCheckoutController.getCheckoutsByUserId.bind(UserCheckoutController)
);

// Update checkout status (admin only)
Router.put(
  "/admin/status/:checkoutId",
  authentification,
  authorization([Roles.ADMIN]),
  UserCheckoutController.updateCheckoutStatus.bind(UserCheckoutController)
);

// Get checkout analytics (admin only)
Router.get(
  "/admin/analytics",
  authentification,
  authorization([Roles.ADMIN]),
  UserCheckoutController.getCheckoutAnalytics.bind(UserCheckoutController)
);

export default Router;