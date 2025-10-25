import * as express from "express";
import path = require("path");

import userRoutes from "../Features/auth/route/user.routes";
import authRoutes from "../Features/auth/route/auth.routes";
import accountsRoutes from "../Features/accounts/route/accounts.route";
import flightRoutes from "../Features/flights/route/flights.route";
import blogRoutes from "../Features/blogs/route/blogs.route";
import contentRoutes from "../Features/content/route/content.route";
import analyticsRoutes from "../Features/analytics/route/analytics.route";
import bookingsRoutes from "../Features/bookings/route/bookings.route";
import paymentsRoutes from "../Features/payments/route/payments.route";
import userCheckoutRoutes from "../Features/userCheckout/route/userCheckout.route";

const Router = express.Router();

// Authentication routes
Router.use("/auth", authRoutes);
Router.use("/users", userRoutes);

// Main application routes
Router.use("/", flightRoutes);
Router.use("/", blogRoutes);
Router.use("/", contentRoutes);
Router.use("/", bookingsRoutes);
Router.use("/", analyticsRoutes);
Router.use("/api/payments", paymentsRoutes);
Router.use("/api/checkout", userCheckoutRoutes);

// Test routes
Router.use("/test", accountsRoutes);

export { Router };
