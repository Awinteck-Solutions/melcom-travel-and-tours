import { Request, Response } from "express";
import SupportForm from "../schema/SupportForms.schema";

export class SupportFormsController {
  static async list(req: Request, res: Response) {
    try {
      const { status, inquiryType, email, page = 1, limit = 10 } = req.query;
      const filter: any = {};
      if (status) filter.status = status;
      if (inquiryType) filter.inquiryType = inquiryType;
      if (email) filter.email = email;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await SupportForm.countDocuments(filter);

      const items = await SupportForm.find(filter)
        .populate('inquiryType', '_id name')
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
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error", error: e.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const item = await SupportForm.findById(req.params.id).populate('inquiryType', '_id name').lean();
      if (!item) return res.status(404).json({ success: false, message: "Support form not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error", error: e.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const created = await new SupportForm(req.body).save();
      return res.status(201).json({ success: true, data: created, message: "Support form created" });
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error", error: e.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payload = (({ name, email, phone, subject, message, inquiryType, status, response, respondedBy }) => ({ name, email, phone, subject, message, inquiryType, status, response, respondedBy }))(req.body);
      const updated = await SupportForm.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Support form not found" });
      return res.status(200).json({ success: true, data: updated, message: "Support form updated" });
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error", error: e.message });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const removed = await SupportForm.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ success: false, message: "Support form not found" });
      return res.status(200).json({ success: true, message: "Support form deleted" });
    } catch (e) {
      return res.status(500).json({ success: false, message: "System error", error: e.message });
    }
  }
}