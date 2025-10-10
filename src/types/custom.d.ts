declare namespace Express {
  interface Request {
    file?: Express.Multer.File;
    files?:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] };
    user?: {
      id: string;
      email: string;
      role?: string;
      [key: string]: any;
    };
  }
}
