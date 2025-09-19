import * as express from "express";
import path = require("path");

// Existing routes
import userRoutes from "../Features/auth/route/user.routes";
import authRoutes from "../Features/auth/route/auth.routes";
import accountsRoutes from "../Features/accounts/route/accounts.route";

// New routes for Melcom Travels API
import blogRoutes from "../Features/blogs/route/blog.route";
import countriesRoutes from "../Features/countries/route/countries.route";
import staticContentRoutes from "../Features/static-content/route/static-content.route";
import contactRoutes from "../Features/contact/route/contact.route";
import analyticsRoutes from "../Features/analytics/route/analytics.route";

const Router = express.Router();

// ========================================= MELCOM TRAVELS API ROUTES =========================================

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Authentication routes (login, register, password management, notifications, profile)
 */
Router.use("/", authRoutes);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: User management routes
 */
Router.use("/users", userRoutes);

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Blog routes (CRUD operations, categories)
 */
Router.use("/", blogRoutes);

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Recommended countries routes
 */
Router.use("/", countriesRoutes);

/**
 * @swagger
 * /static:
 *   get:
 *     summary: Static content routes (terms, privacy, cookies, contact info, FAQs)
 */
Router.use("/", staticContentRoutes);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Contact routes (contact form, inquiry types)
 */
Router.use("/", contactRoutes);

/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Analytics routes (logging, dashboard, statistics)
 */
Router.use("/", analyticsRoutes);

// Legacy test route
Router.use("/test", accountsRoutes);

export { Router };
