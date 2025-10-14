import * as express from "express";
import path = require("path");

import userRoutes from "../Features/auth/route/user.routes";
import authRoutes from "../Features/auth/route/auth.routes";
import accountsRoutes from "../Features/accounts/route/accounts.route";
import flightRoutes from "../Features/flights/route/flights.route";

const Router = express.Router();

Router.use("/auth", authRoutes);

Router.use("/users", userRoutes);

Router.use("/", flightRoutes);

Router.use("/test", accountsRoutes);

export { Router };
