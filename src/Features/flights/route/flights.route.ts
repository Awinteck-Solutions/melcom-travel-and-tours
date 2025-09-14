import * as express from "express";
import { Response, Request } from "express";
import { FlightsController } from "../controllers/flights.controller";
const Router = express.Router();

// ----------------------------------------- Flights ROUTES ---------------------------------------------------

// Legacy route - get all flights
Router.get("/", (req: Request, res: Response) => {
  FlightsController.data(req, res);
});

// Flight Search Routes
Router.post("/search", (req: Request, res: Response) => {
  FlightsController.searchFlights(req, res);
});

Router.get("/search/:searchId", (req: Request, res: Response) => {
  FlightsController.getSearchResults(req, res);
});

// Flight Booking Routes
Router.post("/book", (req: Request, res: Response) => {
  FlightsController.bookFlight(req, res);
});

// Reservation Management Routes
Router.get("/reservations", (req: Request, res: Response) => {
  FlightsController.getReservations(req, res);
});

Router.get("/reservations/:reservationCode", (req: Request, res: Response) => {
  FlightsController.getReservationDetails(req, res);
});

Router.put(
  "/reservations/:reservationCode/cancel",
  (req: Request, res: Response) => {
    FlightsController.cancelReservation(req, res);
  }
);

// Passenger Management Routes
Router.post("/passengers", (req: Request, res: Response) => {
  FlightsController.createPassenger(req, res);
});

Router.get("/passengers", (req: Request, res: Response) => {
  FlightsController.getPassengers(req, res);
});

export default Router;
