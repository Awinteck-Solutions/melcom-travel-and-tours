import { Request, Response } from "express";
import { CountryList, CountryListCategory } from "../schema/countryList.schema";

export class CountryListController {
  // ===== CountryList CRUD =====
  static async list(req: Request, res: Response) {
    try {
      const { status, category, page = 1, limit = 10 } = req.query;
      const filter: any = {};
      if (status) filter.status = status;
      if (category) filter.category = category;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await CountryList.countDocuments(filter);

      const items = await CountryList.find(filter)
        .populate("category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      return res.status(200).json({
        success: true,
        data: items,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch country list", error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const item = await CountryList.findById(req.params.id).populate("category").lean();
      if (!item) return res.status(404).json({ success: false, message: "Country list item not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch country list item", error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { url, status, category, title, position } = req.body;
      const created = await new CountryList({ url, status, category, title,position }).save();
      return res.status(201).json({ success: true, data: created, message: "Country list item created" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to create country list item", error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payload = (({ url, status, category, title, position }) => ({ url, status, category, title, position }) as any)(req.body);
      const updated = await CountryList.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Country list item not found" });
      return res.status(200).json({ success: true, data: updated, message: "Country list item updated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to update country list item", error: error.message });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const removed = await CountryList.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ success: false, message: "Country list item not found" });
      return res.status(200).json({ success: true, message: "Country list item deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to delete country list item", error: error.message });
    }
  }

  // ===== CountryListCategory CRUD =====
  static async listCategories(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const filter: any = {};
      if (status) filter.status = status;
      const items = await CountryListCategory.find(filter).lean();
      return res.status(200).json({ success: true, data: items });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    try {
      const item = await CountryListCategory.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to fetch category", error: error.message });
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const { name, status } = req.body;
      const created = await new CountryListCategory({ name, status }).save();
      return res.status(201).json({ success: true, data: created, message: "Category created" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to create category", error: error.message });
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payload = (({ name, status }) => ({ name, status }))(req.body);
      const updated = await CountryListCategory.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, data: updated, message: "Category updated" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to update category", error: error.message });
    }
  }

  static async removeCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const removed = await CountryListCategory.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to delete category", error: error.message });
    }
  }
}