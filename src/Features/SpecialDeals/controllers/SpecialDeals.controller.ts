import { Request, Response } from "express";
import { SpecialDeals, SpecialDealsCategory } from "../schema/SpecialDeals.schema";

export class SpecialDealsController {
  // ===== SpecialDeals CRUD =====
  static async list(req: Request, res: Response) {
    try {
      const { status, category, country, state, page = 1, limit = 10 } = req.query;
      const filter: any = {};
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (country) filter.country = country;
      if (state) filter.state = state;
      
      const skip = (Number(page) - 1) * Number(limit);
      const total = await SpecialDeals.countDocuments(filter);
      
      const items = await SpecialDeals.find(filter)
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
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch special deals", error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const item = await SpecialDeals.findById(req.params.id).populate("category").lean();
      if (!item) return res.status(404).json({ success: false, message: "Special deal not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch special deal", error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { url, title, state, country, amount, category, status } = req.body;
      const created = await new SpecialDeals({ url, title, state, country, amount, category, status }).save();
      const populated = await SpecialDeals.findById(created._id).populate("category").lean();
      return res.status(201).json({ success: true, data: populated, message: "Special deal created" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to create special deal", error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { url, title, state, country, amount, category, status } = req.body;
      const payload: any = {};
      if (url !== undefined) payload.url = url;
      if (title !== undefined) payload.title = title;
      if (state !== undefined) payload.state = state;
      if (country !== undefined) payload.country = country;
      if (amount !== undefined) payload.amount = amount;
      if (category !== undefined) payload.category = category;
      if (status !== undefined) payload.status = status;
      
      const updated = await SpecialDeals.findByIdAndUpdate(id, payload, { new: true }).populate("category");
      if (!updated) return res.status(404).json({ success: false, message: "Special deal not found" });
      return res.status(200).json({ success: true, data: updated, message: "Special deal updated" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to update special deal", error: error.message });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const removed = await SpecialDeals.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ success: false, message: "Special deal not found" });
      return res.status(200).json({ success: true, message: "Special deal deleted" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to delete special deal", error: error.message });
    }
  }

  // ===== SpecialDealsCategory CRUD =====
  static async listCategories(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const filter: any = {};
      if (status) filter.status = status;
      const items = await SpecialDealsCategory.find(filter).lean();
      return res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    try {
      const item = await SpecialDealsCategory.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch category", error: error.message });
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const { name, status='ACTIVE' } = req.body;
      const created = await new SpecialDealsCategory({ name, status }).save();
      return res.status(201).json({ success: true, data: created, message: "Category created" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to create category", error: error.message });
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
      const payload: any = {};
      if (name !== undefined) payload.name = name;
      if (status !== undefined) payload.status = status;
      
      const updated = await SpecialDealsCategory.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, data: updated, message: "Category updated" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to update category", error: error.message });
    }
  }

  static async removeCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const removed = await SpecialDealsCategory.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ success: false, message: "Category not found" });
      return res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to delete category", error: error.message });
    }
  }
}