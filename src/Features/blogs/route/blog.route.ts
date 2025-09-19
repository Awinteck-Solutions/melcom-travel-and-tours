import * as express from "express";
import { Response, Request } from "express";
import { BlogController } from "../controllers/blog.controller";
import { authentification } from "../../../middlewares/authentication.middleware";

const Router = express.Router();

// ----------------------------------------- BLOG ROUTES ---------------------------------------------------

// BLOG CRUD OPERATIONS
Router.post("/blogs", authentification, (req: Request, res: Response) => {
  BlogController.createBlog(req, res);
});

Router.get("/blogs", (req: Request, res: Response) => {
  BlogController.getBlogs(req, res);
});

Router.get("/blogs/:id", (req: Request, res: Response) => {
  BlogController.getBlogById(req, res);
});

Router.put("/blogs/:id", authentification, (req: Request, res: Response) => {
  BlogController.updateBlog(req, res);
});

Router.delete("/blogs/:id", authentification, (req: Request, res: Response) => {
  BlogController.deleteBlog(req, res);
});

// BLOG CATEGORIES
Router.post(
  "/blogs-categories",
  authentification, // Only authenticated users (admins) can create categories
  (req: Request, res: Response) => {
    BlogController.createBlogCategory(req, res);
  }
);

Router.get("/blogs-categories", (req: Request, res: Response) => {
  BlogController.getBlogCategories(req, res);
});

Router.put(
  "/blogs-categories/:id",
  authentification,
  (req: Request, res: Response) => {
    BlogController.updateBlogCategory(req, res);
  }
);

Router.delete(
  "/blogs-categories/:id",
  authentification,
  (req: Request, res: Response) => {
    BlogController.deleteBlogCategory(req, res);
  }
);

export default Router;
