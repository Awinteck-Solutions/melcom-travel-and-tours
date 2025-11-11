import { Request, Response } from "express";
import {
  TermsAndConditions,
  PrivacyPolicy,
  CookiesPolicy,
  InquiryTypes,

} from "../schema/content.schema";
import {
  TermsAndConditionsDTO,
  PrivacyPolicyDTO,
  CookiesPolicyDTO,
  InquiryTypesDTO,
} from "../dto/content.dto";
import Image from "../schema/image.schema";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}
export class ContentController {

  // Terms and Conditions
  async getTermsAndConditions(req: Request, res: Response) {
    try {
      const terms = await TermsAndConditions.findOne({ status: "ACTIVE" }).sort(
        { createdAt: -1 }
      );
      if (!terms) {
        return res.status(404).json({
          success: false,
          message: "Terms and conditions not found",
        });
      }

      const termsDTO = new TermsAndConditionsDTO(terms);

      res.status(200).json({
        success: true,
        data: termsDTO,
        message: "Terms and conditions retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving terms and conditions",
        error: error.message,
      });
    }
  }

  async createTermsAndConditions(req: Request, res: Response) {
    try {
      const { title, content, version, status } = req.body;
      const created = await new TermsAndConditions({ title, content, version, status }).save();
      const termsDTO = new TermsAndConditionsDTO(created);
      res.status(201).json({
        success: true,
        data: termsDTO,
        message: "Terms and conditions created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating terms and conditions",
        error: error.message,
      });
    }
  }

  async updateTermsAndConditions(req: Request, res: Response) {
    try {
      const id  = '690a0afebedb35490521fe13';
      const { title, content, version, status } = req.body;
      const payload: any = {};
      if (title !== undefined) payload.title = title;
      if (content !== undefined) payload.content = content;
      if (version !== undefined) payload.version = version;
      if (status !== undefined) payload.status = status;

      const updated = await TermsAndConditions.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Terms and conditions not found",
        });
      }

      const termsDTO = new TermsAndConditionsDTO(updated);
      res.status(200).json({
        success: true,
        data: termsDTO,
        message: "Terms and conditions updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating terms and conditions",
        error: error.message,
      });
    }
  }

  // Privacy Policy
  async getPrivacyPolicy(req: Request, res: Response) {
    try {
      const policy = await PrivacyPolicy.findOne({ status: "ACTIVE" }).sort({
        createdAt: -1,
      });
      if (!policy) {
        return res.status(404).json({
          success: false,
          message: "Privacy policy not found",
        });
      }

      const policyDTO = new PrivacyPolicyDTO(policy);

      res.status(200).json({
        success: true,
        data: policyDTO,
        message: "Privacy policy retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving privacy policy",
        error: error.message,
      });
    }
  }

  async createPrivacyPolicy(req: Request, res: Response) {
    try {
      const { title, content, version, status } = req.body;
      const created = await new PrivacyPolicy({ title, content, version, status }).save();
      const policyDTO = new PrivacyPolicyDTO(created);
      res.status(201).json({
        success: true,
        data: policyDTO,
        message: "Privacy policy created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating privacy policy",
        error: error.message,
      });
    }
  }

  async updatePrivacyPolicy(req: Request, res: Response) {
    try {
      const id  = '690a11984b95f2324361a0c7';
      const { title, content, version, status } = req.body;
      const payload: any = {};
      if (title !== undefined) payload.title = title;
      if (content !== undefined) payload.content = content;
      if (version !== undefined) payload.version = version;
      if (status !== undefined) payload.status = status;

      const updated = await PrivacyPolicy.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Privacy policy not found",
        });
      }

      const policyDTO = new PrivacyPolicyDTO(updated);
      res.status(200).json({
        success: true,
        data: policyDTO,
        message: "Privacy policy updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating privacy policy",
        error: error.message,
      });
    }
  }

  // Cookies Policy
  async getCookiesPolicy(req: Request, res: Response) {
    try {
      const cookies = await CookiesPolicy.findOne({ status: "ACTIVE" }).sort({
        createdAt: -1,
      });
      if (!cookies) {
        return res.status(404).json({
          success: false,
          message: "Cookies policy not found",
        });
      }

      const cookiesDTO = new CookiesPolicyDTO(cookies);

      res.status(200).json({
        success: true,
        data: cookiesDTO,
        message: "Cookies policy retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving cookies policy",
        error: error.message,
      });
    }
  }

  async createCookiesPolicy(req: Request, res: Response) {
    try {
      const { title, content, version, effectiveDate, status } = req.body;
      const created = await new CookiesPolicy({ title, content, version, effectiveDate, status }).save();
      const cookiesDTO = new CookiesPolicyDTO(created);
      res.status(201).json({
        success: true,
        data: cookiesDTO,
        message: "Cookies policy created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating cookies policy",
        error: error.message,
      });
    }
  }

  async updateCookiesPolicy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, content, version, effectiveDate, status } = req.body;
      const payload: any = {};
      if (title !== undefined) payload.title = title;
      if (content !== undefined) payload.content = content;
      if (version !== undefined) payload.version = version;
      if (effectiveDate !== undefined) payload.effectiveDate = effectiveDate;
      if (status !== undefined) payload.status = status;

      const updated = await CookiesPolicy.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Cookies policy not found",
        });
      }

      const cookiesDTO = new CookiesPolicyDTO(updated);
      res.status(200).json({
        success: true,
        data: cookiesDTO,
        message: "Cookies policy updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating cookies policy",
        error: error.message,
      });
    }
  }



  // Inquiry Types
  async getInquiryTypes(req: Request, res: Response) {
    try {
      const types = await InquiryTypes.find({ status:  "ACTIVE" });
      const typesDTO = types.map((type) => new InquiryTypesDTO(type));

      res.status(200).json({
        success: true,
        data: typesDTO,
        message: "Inquiry types retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving inquiry types",
        error: error.message,
      });
    }
  }

  // Get all inquiry types (Admin only - includes deleted)
  async getAllInquiryTypes(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const filter: any = {};
      if (status) filter.status = status;

      const types = await InquiryTypes.find({ status: {$ne: "DELETED"} }).sort({ createdAt: -1 });
      const typesDTO = types.map((type) => new InquiryTypesDTO(type));

      res.status(200).json({
        success: true,
        data: typesDTO,
        message: "All inquiry types retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving inquiry types",
        error: error.message,
      });
    }
  }

  async createInquiryType(req: Request, res: Response) {
    try {
      const { name, description, status } = req.body;
      const created = await new InquiryTypes({ name, description, status }).save();
      const typeDTO = new InquiryTypesDTO(created);
      res.status(201).json({
        success: true,
        data: typeDTO,
        message: "Inquiry type created successfully",
      });
    } catch (error) {
        console.log('error', error)
      res.status(500).json({
        success: false,
        message: "Error creating inquiry type",
        error: error.message,
      });
    }
  }

  async updateInquiryType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body;
      const payload: any = {};
      if (name !== undefined) payload.name = name;
      if (description !== undefined) payload.description = description;
      if (status !== undefined) payload.status = status;

      const updated = await InquiryTypes.findByIdAndUpdate(id, payload, { new: true });
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Inquiry type not found",
        });
      }

      const typeDTO = new InquiryTypesDTO(updated);
      res.status(200).json({
        success: true,
        data: typeDTO,
        message: "Inquiry type updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating inquiry type",
        error: error.message,
      });
    }
  }

  async deleteInquiryType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedType = await InquiryTypes.findByIdAndUpdate(
        id,
        { status: "DELETED" },
        { new: true }
      );
      if (!updatedType) {
        return res.status(404).json({
          success: false,
          message: "Inquiry type not found",
        });
      }
      const typeDTO = new InquiryTypesDTO(updatedType);
      res.status(200).json({
        success: true,
        data: typeDTO,
        message: "Inquiry type deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting inquiry type",
        error: error.message,
      });
    }
  }

  // Upload Image
  async uploadImage(req: MulterRequest, res: Response) {
    try {
      // check if image is required
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }

      // build public url to the image (served from /upload)
      const publicUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

      const newImage = new Image({ url: publicUrl });
      const savedImage = await newImage.save();
      res.status(200).json({
        success: true,
        data: savedImage,
        message: "Image uploaded successfully",
      });
    }
    catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading image",
        error: error.message,
      });
    }
  }
  // Get Images
  async getImages(req: Request, res: Response) {
    try {
      const images = await Image.find();
      res.status(200).json({
        success: true,
        data: images,
        message: "Images retrieved successfully",
      });
    }
    catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving images",
        error: error.message,
      });
    }
  }

  // Delete Image
  async deleteImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedImage = await Image.findByIdAndDelete(id);
      if (!deletedImage) {
        return res.status(404).json({
          success: false,
          message: "Image not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    }
    catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting image",
        error: error.message,
      });
    }
  }
}
