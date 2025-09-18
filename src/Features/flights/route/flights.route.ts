import * as express from "express";
import { Response, Request } from "express";
import { FlightsController } from "../controllers/flights.controller";

const Router = express.Router();

// ----------------------------------------- FLIGHTS ROUTES (GOL API INTERMEDIARY) ---------------------------------------------------

// Flight Search Routes
Router.get("/flights/search", (req: Request, res: Response) => {
  FlightsController.searchFlights(req, res);
});

Router.get("/flights/:id", (req: Request, res: Response) => {
  FlightsController.getFlightById(req, res);
});

Router.get("/flights/offers", (req: Request, res: Response) => {
  FlightsController.getFlightOffers(req, res);
});

// Flight Booking Routes (GOL API Integration)
Router.post("/flights/bookings", (req: Request, res: Response) => {
  FlightsController.createFlightBooking(req, res);
});

Router.get("/flights/bookings/:id", (req: Request, res: Response) => {
  FlightsController.getFlightBookingById(req, res);
});

Router.put("/flights/bookings/:id/cancel", (req: Request, res: Response) => {
  FlightsController.cancelFlightBooking(req, res);
});

// Airports and Utilities
Router.get("/airports", (req: Request, res: Response) => {
  FlightsController.getAirports(req, res);
});

export default Router;
