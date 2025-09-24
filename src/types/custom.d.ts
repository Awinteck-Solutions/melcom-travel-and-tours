import "express";
import multer from "multer";

interface AuthenticatedUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  isVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      file?: multer.File;
      user?: AuthenticatedUser;
    }
  }
}
