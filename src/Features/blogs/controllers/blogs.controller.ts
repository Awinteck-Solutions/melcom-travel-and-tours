import { Request, Response } from 'express';
import { Blogs, BlogCategories } from '../schema/blogs.schema';
import { BlogsDTO, BlogCategoriesDTO } from '../dto/blogs.dto';

export class BlogsController {
    // Get all blogs with optional category filter
    async getBlogs(req: Request, res: Response) {
        try {
            const { category } = req.query;
            const filter = category ? { category, status: 'PUBLISHED' } : { status: 'PUBLISHED' };
            
            const blogs = await Blogs.find(filter).populate('category', 'name').sort({ publishedAt: -1 });
            const blogsDTO = blogs.map(blog => new BlogsDTO(blog));
            
            res.status(200).json({
                success: true,
                data: blogsDTO,
                message: 'Blogs retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving blogs',
                error: error.message
            });
        }
    }

    // Get blog by ID
    async getBlogById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const blog = await Blogs.findById(id).populate('category', 'name');
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }

            // Increment views
            await Blogs.findByIdAndUpdate(id, { $inc: { views: 1 } });
            
            const blogDTO = new BlogsDTO(blog);
            
            res.status(200).json({
                success: true,
                data: blogDTO,
                message: 'Blog retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving blog',
                error: error.message
            });
        }
    }

    // Create new blog
    async createBlog(req: Request, res: Response) {
        try {
            const blogData = new Blogs(req.body);
            const savedBlog = await blogData.save();
            
            const blogDTO = new BlogsDTO(savedBlog);
            
            res.status(201).json({
                success: true,
                data: blogDTO,
                message: 'Blog created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating blog',
                error: error.message
            });
        }
    }

    // Update blog
    async updateBlog(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const updatedBlog = await Blogs.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedBlog) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }
            
            const blogDTO = new BlogsDTO(updatedBlog);
            
            res.status(200).json({
                success: true,
                data: blogDTO,
                message: 'Blog updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating blog',
                error: error.message
            });
        }
    }

    // Delete blog
    async deleteBlog(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const deletedBlog = await Blogs.findByIdAndDelete(id);
            if (!deletedBlog) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Blog deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting blog',
                error: error.message
            });
        }
    }

    // Get all blog categories
    async getBlogCategories(req: Request, res: Response) {
        try {
            const categories = await BlogCategories.find({ status: 'ACTIVE' });
            const categoriesDTO = categories.map(category => new BlogCategoriesDTO(category));
            
            res.status(200).json({
                success: true,
                data: categoriesDTO,
                message: 'Blog categories retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving blog categories',
                error: error.message
            });
        }
    }

    // Create blog category
    async createBlogCategory(req: Request, res: Response) {
        try {
            const categoryData = new BlogCategories(req.body);
            const savedCategory = await categoryData.save();
            
            const categoryDTO = new BlogCategoriesDTO(savedCategory);
            
            res.status(201).json({
                success: true,
                data: categoryDTO,
                message: 'Blog category created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating blog category',
                error: error.message
            });
        }
    }

    // Update blog category
    async updateBlogCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const updatedCategory = await BlogCategories.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog category not found'
                });
            }
            
            const categoryDTO = new BlogCategoriesDTO(updatedCategory);
            
            res.status(200).json({
                success: true,
                data: categoryDTO,
                message: 'Blog category updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating blog category',
                error: error.message
            });
        }
    }

    // Delete blog category
    async deleteBlogCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const deletedCategory = await BlogCategories.findByIdAndDelete(id);
            if (!deletedCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog category not found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Blog category deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting blog category',
                error: error.message
            });
        }
    }
}