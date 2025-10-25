import * as express from "express";
import { Response, Request } from "express";
import { UserCheckoutController } from "../controllers/userCheckout.controller";

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

export default Router;