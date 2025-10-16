/// <reference path="./types/custom.d.ts" />

import { Express, Request, Response } from "express";
import express from "express";
import bodyParser from "body-parser";
import { Router } from "./routes/all.routes";
import "reflect-metadata";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import cors from "cors";
import path from "path";
import connectToDatabase from "./database/data-source";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
app.use((req, res, next) => {
  console.log("req.url :>> ", req.url);
  next();
});

app.use(Router);


// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Melcom Travel & Tours API",
    version: "1.0.0",
    endpoints: {
      flights: {
        search: "POST /flights/search",
        deals: "GET /flight-deals",
        bookings: "POST /flight-bookings",
        airports: "GET /airports",
      },
      auth: {
        login: "POST /auth/login",
        register: "POST /auth/register",
      },
      users: {
        profile: "GET /users/profile",
      },
    },
    documentation:
      "See FLIGHT_API_DOCUMENTATION.md for detailed API documentation",
  });
});

connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("Server running on port " + process.env.PORT)
    );
  })
  .catch((error) => {
    console.log("error :>> ", error);
  });
