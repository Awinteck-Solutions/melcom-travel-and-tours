import { Request, Response } from "express";
import { Blog, BlogCategory } from "../schema/blog.schema";

export class BlogController {
  // CREATE BLOG
  static async createBlog(req: Request, res: Response) {
    try {
      const {
        title,
        content,
        excerpt,
        featuredImage,
        category,
        tags,
        status,
        featured,
        seoTitle,
        seoDescription,
        seoKeywords,
      } = req.body;
      const authorId = (req as any).user?.id;

      const slug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .trim("-");

      const blog = new Blog({
        title,
        slug: `${slug}-${Date.now()}`,
        content,
        excerpt,
        featuredImage,
        category,
        author: authorId,
        tags: tags || [],
        status: status || "DRAFT",
        featured: featured || false,
        seoTitle,
        seoDescription,
        seoKeywords: seoKeywords || [],
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      });

      const savedBlog = await blog.save();
      const populatedBlog = await Blog.findById(savedBlog._id)
        .populate("category", "name slug")
        .populate("author", "firstname lastname email");

      return res.status(201).json({
        status: true,
        message: "Blog created successfully",
        data: populatedBlog,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to create blog",
        error: error,
      });
    }
  }

  // GET ALL BLOGS
  static async getBlogs(req: Request, res: Response) {
    try {
      const {
        category,
        status,
        featured,
        page = 1,
        limit = 10,
        search,
      } = req.query;

      const filter: any = {};
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (featured !== undefined) filter.featured = featured === "true";
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search as string, "i")] } },
        ];
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const blogs = await Blog.find(filter)
        .populate("category", "name slug")
        .populate("author", "firstname lastname")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string));

      const total = await Blog.countDocuments(filter);

      return res.status(200).json({
        status: true,
        message: "Blogs retrieved successfully",
        data: {
          blogs,
          pagination: {
            current: parseInt(page as string),
            total: Math.ceil(total / parseInt(limit as string)),
            count: total,
          },
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve blogs",
        error: error,
      });
    }
  }

  // GET BLOG BY ID
  static async getBlogById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const blog = await Blog.findById(id)
        .populate("category", "name slug description")
        .populate("author", "firstname lastname email");

      if (!blog) {
        return res.status(404).json({
          status: false,
          message: "Blog not found",
        });
      }

      // Increment view count
      await Blog.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

      return res.status(200).json({
        status: true,
        message: "Blog retrieved successfully",
        data: blog,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve blog",
        error: error,
      });
    }
  }

  // UPDATE BLOG
  static async updateBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id;

      // If status is being changed to PUBLISHED, set publishedAt
      if (updateData.status === "PUBLISHED") {
        updateData.publishedAt = new Date();
      }

      const blog = await Blog.findOneAndUpdate(
        { _id: id, author: userId }, // Only allow author to update
        updateData,
        { new: true }
      )
        .populate("category", "name slug")
        .populate("author", "firstname lastname");

      if (!blog) {
        return res.status(404).json({
          status: false,
          message: "Blog not found or unauthorized",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Blog updated successfully",
        data: blog,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update blog",
        error: error,
      });
    }
  }

  // DELETE BLOG
  static async deleteBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      const blog = await Blog.findOneAndDelete({ _id: id, author: userId });

      if (!blog) {
        return res.status(404).json({
          status: false,
          message: "Blog not found or unauthorized",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Blog deleted successfully",
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to delete blog",
        error: error,
      });
    }
  }

  // CREATE BLOG CATEGORY
  static async createBlogCategory(req: Request, res: Response) {
    try {
      const { name, description, image, status } = req.body;

      const slug = name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .trim("-");

      const category = new BlogCategory({
        name,
        slug,
        description,
        image,
        status: status || "ACTIVE",
      });

      const savedCategory = await category.save();

      return res.status(201).json({
        status: true,
        message: "Blog category created successfully",
        data: savedCategory,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to create blog category",
        error: error,
      });
    }
  }

  // GET BLOG CATEGORIES
  static async getBlogCategories(req: Request, res: Response) {
    try {
      const categories = await BlogCategory.find({ status: "ACTIVE" });

      // Add blog count for each category
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const blogCount = await Blog.countDocuments({
            category: category._id,
            status: "PUBLISHED",
          });
          return {
            ...category.toObject(),
            blogCount,
          };
        })
      );

      return res.status(200).json({
        status: true,
        message: "Blog categories retrieved successfully",
        data: categoriesWithCount,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve blog categories",
        error: error,
      });
    }
  }

  // UPDATE BLOG CATEGORY
  static async updateBlogCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const category = await BlogCategory.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!category) {
        return res.status(404).json({
          status: false,
          message: "Blog category not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Blog category updated successfully",
        data: category,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update blog category",
        error: error,
      });
    }
  }

  // DELETE BLOG CATEGORY
  static async deleteBlogCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if any blogs are using this category
      const blogsCount = await Blog.countDocuments({ category: id });
      if (blogsCount > 0) {
        return res.status(400).json({
          status: false,
          message: "Cannot delete category. It is being used by blogs.",
        });
      }

      const category = await BlogCategory.findByIdAndDelete(id);

      if (!category) {
        return res.status(404).json({
          status: false,
          message: "Blog category not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Blog category deleted successfully",
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to delete blog category",
        error: error,
      });
    }
  }
}
