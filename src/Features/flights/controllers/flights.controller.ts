import { Request, Response } from "express";
     import Flights from "../schema/flights.schema";

        export class FlightsController {

            static async data(req: Request, res: Response) {
                try{
                  let response = await Flights.find()

                  return res.status(200).json({
                    success: true,
                    message: "Flights successful response",
                    response
                  });
                }catch(e){
                  return res.status(500).json({
                      success: false,
                      message: "System error"
                  });
                }
            }

        }