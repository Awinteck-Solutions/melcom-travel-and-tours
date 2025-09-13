import * as express from "express"; 
import path = require("path");

import userRoutes from "../Features/auth/route/user.routes";
import authRoutes from "../Features/auth/route/auth.routes";
import accountsRoutes from '../Features/accounts/route/accounts.route';

const Router = express.Router();

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Authentication routes
 */
Router.use("/auth", authRoutes);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: User routes
 */
Router.use("/users", userRoutes);


Router.use("/test", accountsRoutes);




export { Router }