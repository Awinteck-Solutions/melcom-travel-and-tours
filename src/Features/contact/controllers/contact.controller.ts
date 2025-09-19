import { Request, Response } from "express";
import { InquiryType, ContactUsForm } from "../schema/contact.schema";
import { sendMail } from "../../../helpers/emailer";

export class ContactController {
  // SUBMIT CONTACT US FORM
  static async submitContactForm(req: Request, res: Response) {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        inquiryType,
        subject,
        message,
        attachments,
      } = req.body;

      // Get client IP and User Agent for tracking
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");

      const contactForm = new ContactUsForm({
        firstName,
        lastName,
        email,
        phone,
        inquiryType,
        subject,
        message,
        attachments: attachments || [],
        ipAddress,
        userAgent,
      });

      const savedForm = await contactForm.save();
      const populatedForm = await ContactUsForm.findById(
        savedForm._id
      ).populate("inquiryType", "name description");

      // Send confirmation email to user
      try {
        await sendMail(
          email,
          firstName,
          "Thank you for contacting Melcom Travels",
          "contact-confirmation",
          `We have received your inquiry about "${subject}". Our team will get back to you within 24-48 hours.`
        );
      } catch (emailError) {
        console.log("Email send error:", emailError);
        // Don't fail the request if email fails
      }

      // Send notification to admin team
      try {
        await sendMail(
          "support@melcomtravels.com", // Configure this email
          "Support Team",
          `New Contact Form Submission: ${subject}`,
          "admin-notification",
          `New inquiry from ${firstName} ${lastName} (${email}). Priority: MEDIUM`
        );
      } catch (emailError) {
        console.log("Admin notification error:", emailError);
      }

      return res.status(201).json({
        status: true,
        message:
          "Contact form submitted successfully. We will get back to you soon.",
        data: {
          id: populatedForm._id,
          referenceNumber: `MC-${populatedForm._id
            .toString()
            .slice(-8)
            .toUpperCase()}`,
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to submit contact form",
        error: error,
      });
    }
  }

  // GET INQUIRY TYPES
  static async getInquiryTypes(req: Request, res: Response) {
    try {
      const inquiryTypes = await InquiryType.find({ status: "ACTIVE" }).sort({
        order: 1,
        name: 1,
      });

      return res.status(200).json({
        status: true,
        message: "Inquiry types retrieved successfully",
        data: inquiryTypes,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve inquiry types",
        error: error,
      });
    }
  }

  // GET CONTACT FORMS (Admin)
  static async getContactForms(req: Request, res: Response) {
    try {
      const {
        status,
        priority,
        inquiryType,
        assignedTo,
        dateFrom,
        dateTo,
        search,
        page = 1,
        limit = 20,
      } = req.query;

      const filter: any = {};

      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (inquiryType) filter.inquiryType = inquiryType;
      if (assignedTo) filter.assignedTo = assignedTo;

      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
      }

      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
        ];
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const forms = await ContactUsForm.find(filter)
        .populate("inquiryType", "name description")
        .populate("assignedTo", "firstname lastname email")
        .populate("responseNotes.respondedBy", "firstname lastname")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string));

      const total = await ContactUsForm.countDocuments(filter);

      return res.status(200).json({
        status: true,
        message: "Contact forms retrieved successfully",
        data: {
          forms,
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
        message: "Failed to retrieve contact forms",
        error: error,
      });
    }
  }

  // GET CONTACT FORM BY ID (Admin)
  static async getContactFormById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const form = await ContactUsForm.findById(id)
        .populate("inquiryType", "name description")
        .populate("assignedTo", "firstname lastname email")
        .populate("responseNotes.respondedBy", "firstname lastname email");

      if (!form) {
        return res.status(404).json({
          status: false,
          message: "Contact form not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Contact form retrieved successfully",
        data: form,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve contact form",
        error: error,
      });
    }
  }

  // UPDATE CONTACT FORM STATUS (Admin)
  static async updateContactFormStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, priority, assignedTo, responseNote } = req.body;
      const adminId = (req as any).user?.id;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (assignedTo) updateData.assignedTo = assignedTo;
      if (status === "RESOLVED" || status === "CLOSED") {
        updateData.resolvedAt = new Date();
      }

      // Add response note if provided
      if (responseNote) {
        const form = await ContactUsForm.findById(id);
        if (form) {
          form.responseNotes.push({
            note: responseNote,
            respondedBy: adminId,
            respondedAt: new Date(),
          });
          Object.assign(form, updateData);
          await form.save();
        } else {
          return res.status(404).json({
            status: false,
            message: "Contact form not found",
          });
        }
      } else {
        await ContactUsForm.findByIdAndUpdate(id, updateData);
      }

      const updatedForm = await ContactUsForm.findById(id)
        .populate("inquiryType", "name description")
        .populate("assignedTo", "firstname lastname email")
        .populate("responseNotes.respondedBy", "firstname lastname");

      return res.status(200).json({
        status: true,
        message: "Contact form status updated successfully",
        data: updatedForm,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update contact form status",
        error: error,
      });
    }
  }

  // CREATE INQUIRY TYPE (Admin)
  static async createInquiryType(req: Request, res: Response) {
    try {
      const inquiryTypeData = req.body;

      const inquiryType = new InquiryType(inquiryTypeData);
      const savedInquiryType = await inquiryType.save();

      return res.status(201).json({
        status: true,
        message: "Inquiry type created successfully",
        data: savedInquiryType,
      });
    } catch (error) {
      console.log("error :>> ", error);

      if (error.code === 11000) {
        return res.status(400).json({
          status: false,
          message: "Inquiry type name already exists",
        });
      }

      return res.status(500).json({
        status: false,
        message: "Failed to create inquiry type",
        error: error,
      });
    }
  }

  // UPDATE INQUIRY TYPE (Admin)
  static async updateInquiryType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const inquiryType = await InquiryType.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!inquiryType) {
        return res.status(404).json({
          status: false,
          message: "Inquiry type not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Inquiry type updated successfully",
        data: inquiryType,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update inquiry type",
        error: error,
      });
    }
  }

  // DELETE INQUIRY TYPE (Admin)
  static async deleteInquiryType(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if any contact forms are using this inquiry type
      const formsCount = await ContactUsForm.countDocuments({
        inquiryType: id,
      });
      if (formsCount > 0) {
        return res.status(400).json({
          status: false,
          message:
            "Cannot delete inquiry type. It is being used by contact forms.",
        });
      }

      const inquiryType = await InquiryType.findByIdAndDelete(id);

      if (!inquiryType) {
        return res.status(404).json({
          status: false,
          message: "Inquiry type not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Inquiry type deleted successfully",
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to delete inquiry type",
        error: error,
      });
    }
  }

  // GET CONTACT FORM STATISTICS (Admin)
  static async getContactFormStats(req: Request, res: Response) {
    try {
      const totalForms = await ContactUsForm.countDocuments();
      const newForms = await ContactUsForm.countDocuments({ status: "NEW" });
      const inProgressForms = await ContactUsForm.countDocuments({
        status: "IN_PROGRESS",
      });
      const resolvedForms = await ContactUsForm.countDocuments({
        status: "RESOLVED",
      });
      const closedForms = await ContactUsForm.countDocuments({
        status: "CLOSED",
      });

      // Get forms by priority
      const urgentForms = await ContactUsForm.countDocuments({
        priority: "URGENT",
      });
      const highPriorityForms = await ContactUsForm.countDocuments({
        priority: "HIGH",
      });

      // Get recent forms (last 7 days)
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const recentForms = await ContactUsForm.countDocuments({
        createdAt: { $gte: lastWeek },
      });

      const stats = {
        total: totalForms,
        byStatus: {
          new: newForms,
          inProgress: inProgressForms,
          resolved: resolvedForms,
          closed: closedForms,
        },
        byPriority: {
          urgent: urgentForms,
          high: highPriorityForms,
        },
        recent: recentForms,
      };

      return res.status(200).json({
        status: true,
        message: "Contact form statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve contact form statistics",
        error: error,
      });
    }
  }
}
