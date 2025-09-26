import * as express from "express";
import { Response, Request } from "express";
import { FlightsController } from "../controllers/flights.controller";
const Router = express.Router();

// ----------------------------------------- FLIGHTS ROUTES ---------------------------------------------------

// Flight Deals Routes
Router.get("/flight-deals", 
    (req: Request, res: Response) => {
        FlightsController.getFlightDeals(req, res);
    }
);

Router.get("/flight-deals/:id", 
    (req: Request, res: Response) => {
        FlightsController.getFlightDealById(req, res);
    }
);

Router.get("/flight-deals-categories", 
    (req: Request, res: Response) => {
        FlightsController.getFlightDealsCategories(req, res);
    }
);

// Flight Bookings Routes
Router.get("/flight-bookings", 
    (req: Request, res: Response) => {
        FlightsController.getFlightBookings(req, res);
    }
);

Router.post("/flight-bookings", 
    (req: Request, res: Response) => {
        FlightsController.createFlightBooking(req, res);
    }
);

Router.get("/flight-bookings/:id", 
    (req: Request, res: Response) => {
        FlightsController.getFlightBookingById(req, res);
    }
);

// Additional Flight Search Routes
Router.get("/search-destinations", 
    (req: Request, res: Response) => {
        FlightsController.searchDestinations(req, res);
    }
);

Router.get("/search-flights", 
    (req: Request, res: Response) => {
        FlightsController.searchFlights(req, res);
    }
);

export default Router;