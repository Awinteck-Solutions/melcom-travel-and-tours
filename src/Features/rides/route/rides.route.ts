import * as express from "express";
        import {Response, Request} from "express";
        import { RidesController } from "../controllers/rides.controller";
        const Router = express.Router();

    // ----------------------------------------- Rides ROUTES ---------------------------------------------------
    //
    Router.get("/",
    (req: Request, res: Response) => {
        RidesController.data(req, res)
    }
); 


export default Router;