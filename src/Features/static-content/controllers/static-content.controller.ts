import { Request, Response } from "express";
import {
  StaticContent,
  FAQ,
  ContactInfo,
} from "../schema/static-content.schema";

export class StaticContentController {
  // GET TERMS AND CONDITIONS
  static async getTermsAndConditions(req: Request, res: Response) {
    try {
      const terms = await StaticContent.findOne({
        type: "terms-and-conditions",
        status: "ACTIVE",
      });

      if (!terms) {
        return res.status(404).json({
          status: false,
          message: "Terms and conditions not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Terms and conditions retrieved successfully",
        data: terms,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve terms and conditions",
        error: error,
      });
    }
  }

  // GET PRIVACY POLICY
  static async getPrivacyPolicy(req: Request, res: Response) {
    try {
      const policy = await StaticContent.findOne({
        type: "privacy-policy",
        status: "ACTIVE",
      });

      if (!policy) {
        return res.status(404).json({
          status: false,
          message: "Privacy policy not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Privacy policy retrieved successfully",
        data: policy,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve privacy policy",
        error: error,
      });
    }
  }

  // GET COOKIES POLICY
  static async getCookiesPolicy(req: Request, res: Response) {
    try {
      const cookies = await StaticContent.findOne({
        type: "cookies",
        status: "ACTIVE",
      });

      if (!cookies) {
        return res.status(404).json({
          status: false,
          message: "Cookies policy not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Cookies policy retrieved successfully",
        data: cookies,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve cookies policy",
        error: error,
      });
    }
  }

  // GET CONTACT INFO
  static async getContactInfo(req: Request, res: Response) {
    try {
      const contactInfo = await ContactInfo.findOne({ isDefault: true });

      if (!contactInfo) {
        return res.status(404).json({
          status: false,
          message: "Contact information not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Contact information retrieved successfully",
        data: contactInfo,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve contact information",
        error: error,
      });
    }
  }

  // GET FAQs
  static async getFAQs(req: Request, res: Response) {
    try {
      const { category, featured } = req.query;

      const filter: any = { status: "ACTIVE" };

      if (category) filter.category = category;
      if (featured !== undefined) filter.featured = featured === "true";

      const faqs = await FAQ.find(filter).sort({
        featured: -1,
        order: 1,
        createdAt: 1,
      });

      return res.status(200).json({
        status: true,
        message: "FAQs retrieved successfully",
        data: faqs,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve FAQs",
        error: error,
      });
    }
  }

  // CREATE OR UPDATE STATIC CONTENT (Admin)
  static async createOrUpdateStaticContent(req: Request, res: Response) {
    try {
      const { type, title, content, version } = req.body;

      const existingContent = await StaticContent.findOne({ type });

      if (existingContent) {
        // Update existing content
        existingContent.title = title;
        existingContent.content = content;
        existingContent.version = version || existingContent.version;
        existingContent.lastUpdated = new Date();

        const updatedContent = await existingContent.save();

        return res.status(200).json({
          status: true,
          message: "Static content updated successfully",
          data: updatedContent,
        });
      } else {
        // Create new content
        const newContent = new StaticContent({
          type,
          title,
          content,
          version: version || "1.0",
        });

        const savedContent = await newContent.save();

        return res.status(201).json({
          status: true,
          message: "Static content created successfully",
          data: savedContent,
        });
      }
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to create/update static content",
        error: error,
      });
    }
  }

  // CREATE FAQ (Admin)
  static async createFAQ(req: Request, res: Response) {
    try {
      const faqData = req.body;

      const faq = new FAQ(faqData);
      const savedFAQ = await faq.save();

      return res.status(201).json({
        status: true,
        message: "FAQ created successfully",
        data: savedFAQ,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to create FAQ",
        error: error,
      });
    }
  }

  // UPDATE FAQ (Admin)
  static async updateFAQ(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const faq = await FAQ.findByIdAndUpdate(id, updateData, { new: true });

      if (!faq) {
        return res.status(404).json({
          status: false,
          message: "FAQ not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "FAQ updated successfully",
        data: faq,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update FAQ",
        error: error,
      });
    }
  }

  // DELETE FAQ (Admin)
  static async deleteFAQ(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const faq = await FAQ.findByIdAndDelete(id);

      if (!faq) {
        return res.status(404).json({
          status: false,
          message: "FAQ not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "FAQ deleted successfully",
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to delete FAQ",
        error: error,
      });
    }
  }

  // UPDATE CONTACT INFO (Admin)
  static async updateContactInfo(req: Request, res: Response) {
    try {
      const updateData = req.body;

      const contactInfo = await ContactInfo.findOneAndUpdate(
        { isDefault: true },
        updateData,
        { new: true, upsert: true }
      );

      return res.status(200).json({
        status: true,
        message: "Contact information updated successfully",
        data: contactInfo,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update contact information",
        error: error,
      });
    }
  }

  // GET FAQ CATEGORIES
  static async getFAQCategories(req: Request, res: Response) {
    try {
      const categories = [
        {
          id: "general",
          name: "General",
          description: "General questions and answers",
        },
        {
          id: "booking",
          name: "Booking",
          description: "Questions about flight bookings",
        },
        {
          id: "payment",
          name: "Payment",
          description: "Payment related questions",
        },
        {
          id: "flights",
          name: "Flights",
          description: "Flight specific questions",
        },
        {
          id: "cancellation",
          name: "Cancellation",
          description: "Cancellation and refund questions",
        },
        {
          id: "support",
          name: "Support",
          description: "Customer support questions",
        },
      ];

      // Add count for each category
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const count = await FAQ.countDocuments({
            category: category.id,
            status: "ACTIVE",
          });
          return { ...category, faqCount: count };
        })
      );

      return res.status(200).json({
        status: true,
        message: "FAQ categories retrieved successfully",
        data: categoriesWithCount,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve FAQ categories",
        error: error,
      });
    }
  }
}
