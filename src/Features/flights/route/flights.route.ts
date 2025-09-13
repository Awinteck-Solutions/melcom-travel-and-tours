import * as express from "express";
        import {Response, Request} from "express";
        import { FlightsController } from "../controllers/flights.controller";
        const Router = express.Router();

    // ----------------------------------------- Flights ROUTES ---------------------------------------------------
    //
    Router.get("/",
    (req: Request, res: Response) => {
        FlightsController.data(req, res)
    }
); 


export default Router;