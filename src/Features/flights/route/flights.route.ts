import * as express from "express";
import { Response, Request } from "express";
import { FlightsController } from "../controllers/flights.controller";
const Router = express.Router();

// ----------------------------------------- FLIGHTS ROUTES ---------------------------------------------------

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

// Flight Bookings Routes
Router.get("/flight-bookings", (req: Request, res: Response) => {
  FlightsController.getFlightBookings(req, res);
});

Router.post("/flight-bookings", (req: Request, res: Response) => {
  FlightsController.createFlightBooking(req, res);
});

Router.get("/flight-bookings/:id", (req: Request, res: Response) => {
  FlightsController.getFlightBookingById(req, res);
});

// Additional Flight Search Routes
Router.get("/search-destinations", (req: Request, res: Response) => {
  FlightsController.searchDestinations(req, res);
});

Router.post("/search-flights", (req: Request, res: Response) => {
  FlightsController.searchFlights(req, res);
});

Router.post("/search-multicity-flights", (req: Request, res: Response) => {
  FlightsController.searchMultiCityFlights(req, res);
});

// Flexible search endpoint - accepts any GOL API structure
Router.post("/flexible-search", (req: Request, res: Response) => {
  FlightsController.flexibleSearch(req, res);
});

// 🔹 EXACT PAYLOAD STRUCTURE ROUTES - Based on provided examples

// Destination search using exact payload structure
Router.post("/search-destinations-exact", (req: Request, res: Response) => {
  FlightsController.searchDestinationsExact(req, res);
});

// One-way flight search using exact payload structure
Router.post("/search-flights-oneway", (req: Request, res: Response) => {
  FlightsController.searchFlightsOneWay(req, res);
});

// Round-trip flight search using exact payload structure
Router.post("/search-flights-roundtrip", (req: Request, res: Response) => {
  FlightsController.searchFlightsRoundTrip(req, res);
});

// Multi-city flight search
Router.post(
  "/search-flights-multicity-exact",
  (req: Request, res: Response) => {
    FlightsController.searchFlightsMultiCity(req, res);
  }
);

export default Router;
