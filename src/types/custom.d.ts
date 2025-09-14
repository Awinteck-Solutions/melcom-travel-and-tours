import "express";
import multer from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: multer.File;
      user?: {
        id: string;
        email: string;
        [key: string]: any;
      };
    }
  }
}
