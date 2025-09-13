import * as express from "express";
        import {Response, Request} from "express";
        import { HotelsController } from "../controllers/hotels.controller";
        const Router = express.Router();

    // ----------------------------------------- Hotels ROUTES ---------------------------------------------------
    //
    Router.get("/",
    (req: Request, res: Response) => {
        HotelsController.data(req, res)
    }
); 


export default Router;