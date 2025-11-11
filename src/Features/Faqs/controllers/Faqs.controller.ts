import { Request, Response } from "express";
import Faqs from "../schema/Faqs.schema";

export class FaqsController {
  static async list(req: Request, res: Response) {
    try {
      const { status='ACTIVE', category, page = 1, limit = 10 } = req.query;
      const filter: any = {};
      if (status) filter.status = status;
      if (category) filter.category = category;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Faqs.countDocuments(filter);

      const items = await Faqs.find(filter)
        .sort({ order: 1, createdAt: -1 })
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
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error" });
    }
  }

  static async adminList(req: Request, res: Response) {
    try {
      const { status, category, page = 1, limit = 10 } = req.query;
      const filter: any = {};
      if (status) filter.status = status;
      if (category) filter.category = category;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Faqs.countDocuments(filter);

      const items = await Faqs.find(filter)
        .sort({ order: 1, createdAt: -1 })
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
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error" });
    }
  }
  static async getById(req: Request, res: Response) {
    try {
      const item = await Faqs.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ success: false, message: "FAQ not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { question, answer, category, order, status } = req.body;
      const created = await new Faqs({ question, answer, category, order, status }).save();
      return res.status(201).json({ success: true, data: created, message: "FAQ created" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ success: false, message: "System error" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payload = (({ question, answer, category, order, status }) => ({ question, answer, category, order, status }))(req.body);
      const updated = await Faqs.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "FAQ not found" });
      return res.status(200).json({ success: true, data: updated, message: "FAQ updated" });
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error" });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await Faqs.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: "FAQ not found" });
      return res.status(200).json({ success: true, message: "FAQ deleted" });
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error" });
    }
  }
}