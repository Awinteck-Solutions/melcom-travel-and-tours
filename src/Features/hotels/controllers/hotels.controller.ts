import { Request, Response } from "express";
     import Hotels from "../schema/hotels.schema";

        export class HotelsController {

            static async data(req: Request, res: Response) {
                try{
                  let response = await Hotels.find()

                  return res.status(200).json({
                    success: true,
                    message: "Hotels successful response",
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