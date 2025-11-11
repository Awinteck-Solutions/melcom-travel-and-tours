import { Router } from "express";
import { BlogsController } from "../controllers/blogs.controller";

const blogRoutes = Router();
const blogsController = new BlogsController();

// Blog routes
blogRoutes.get("/blogs", blogsController.getBlogs.bind(blogsController));
blogRoutes.get("/blogs-admin", blogsController.getBlogsAdmin.bind(blogsController));
blogRoutes.get("/blogs/:id", blogsController.getBlogById.bind(blogsController));
blogRoutes.post("/blogs", blogsController.createBlog.bind(blogsController));
blogRoutes.put("/blogs/:id", blogsController.updateBlog.bind(blogsController));
blogRoutes.delete("/blogs/:id", blogsController.deleteBlog.bind(blogsController));

// Blog categories routes
blogRoutes.get("/blogs-categories", blogsController.getBlogCategories.bind(blogsController));
blogRoutes.post("/blogs-categories", blogsController.createBlogCategory.bind(blogsController));
blogRoutes.put("/blogs-categories/:id", blogsController.updateBlogCategory.bind(blogsController));
blogRoutes.delete("/blogs-categories/:id", blogsController.deleteBlogCategory.bind(blogsController));

export default blogRoutes;