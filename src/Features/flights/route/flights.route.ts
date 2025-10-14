import * as express from "express";
import { Response, Request } from "express";
import { FlightsController } from "../controllers/flights.controller";

const Router = express.Router();

// ----------------------------------------- FLIGHT SEARCH ROUTES ---------------------------------------------------

// Flight Search Route (handles one-way, return, multi-city)
Router.post("/flights/search", (req: Request, res: Response) => {
  FlightsController.searchFlights(req, res);
});

// ----------------------------------------- FLIGHT DEALS ROUTES ---------------------------------------------------

// Flight Deals Routes
Router.get("/flight-deals", (req: Request, res: Response) => {
  FlightsController.getFlightDeals(req, res);
});

Router.get("/flight-deals/:id", (req: Request, res: Response) => {
  FlightsController.getFlightDealById(req, res);
});

Router.get("/flight-deals-categories", (req: Request, res: Response) => {
  FlightsController.getFlightDealsCategories(req, res);
});

// ----------------------------------------- FLIGHT BOOKINGS ROUTES ---------------------------------------------------

// Flight Booking Routes
Router.get("/flight-bookings", (req: Request, res: Response) => {
  FlightsController.getAllFlightBookings(req, res);
});

Router.post("/flight-bookings", (req: Request, res: Response) => {
  FlightsController.createFlightBooking(req, res);
});

Router.get("/flight-bookings/:id", (req: Request, res: Response) => {
  FlightsController.getFlightBookingById(req, res);
});

// ----------------------------------------- UTILITY ROUTES ---------------------------------------------------

// Airports and Utilities
Router.get("/airports", (req: Request, res: Response) => {
  FlightsController.getAirports(req, res);
});

export default Router;
