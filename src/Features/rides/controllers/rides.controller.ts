import { Request, Response } from "express";
     import Rides from "../schema/rides.schema";

        export class RidesController {

            static async data(req: Request, res: Response) {
                try{
                  let response = await Rides.find()

                  return res.status(200).json({
                    success: true,
                    message: "Rides successful response",
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