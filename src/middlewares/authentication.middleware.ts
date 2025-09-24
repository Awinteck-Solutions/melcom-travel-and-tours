import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET) as any;
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Set user ID in request object using currentUser notation
    req["currentUser"] = decode._id || decode.id;
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
