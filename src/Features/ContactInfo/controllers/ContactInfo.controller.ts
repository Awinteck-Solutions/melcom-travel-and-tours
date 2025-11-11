import { Request, Response } from "express";
import ContactInfo from "../schema/ContactInfo.schema";

export class ContactInfoController {

  static async create(req: Request, res: Response) {
    try {
      const { address, phone, email, whatsapp, workingHours, socialMedia, status } = req.body;
      const created = await new ContactInfo({ address, phone, email, whatsapp, workingHours, socialMedia, status }).save();
      return res.status(201).json({ success: true, data: created, message: "Contact info created successfully" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to create contact info", error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const item = await ContactInfo.findById('68f0837db603728a4f65205a').lean();
      if (!item) return res.status(404).json({ success: false, message: "Contact info not found" });
      return res.status(200).json({ success: true, data: item });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to fetch contact info", error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { address, phone, email, whatsapp, workingHours, socialMedia, status } = req.body;
      const payload: any = {};
      if (address !== undefined) payload.address = address;
      if (phone !== undefined) payload.phone = phone;
      if (email !== undefined) payload.email = email;
      if (whatsapp !== undefined) payload.whatsapp = whatsapp;
      if (workingHours !== undefined) payload.workingHours = workingHours;
      if (socialMedia !== undefined) payload.socialMedia = socialMedia;
      if (status !== undefined) payload.status = status;
      
      const updated = await ContactInfo.findByIdAndUpdate('68f0837db603728a4f65205a', payload, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: "Contact info not found" });
      return res.status(200).json({ success: true, data: updated, message: "Contact info updated successfully" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Failed to update contact info", error: error.message });
    }
  }

}