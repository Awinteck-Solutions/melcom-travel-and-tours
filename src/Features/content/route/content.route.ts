import { Router } from "express";
import { Request, Response } from "express";
import { ContentController } from "../controllers/content.controller";
import { upload } from "../../../helpers/uploader";
import { authentification } from "../../../middlewares/authentication.middleware";
import { authorization } from "../../../middlewares/authorization.middleware";
import { Roles } from "../../../enums/roles.enum";

const contentRoutes = Router();
const contentController = new ContentController();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}
 
contentRoutes.get(
  "/terms-and-conditions",
  contentController.getTermsAndConditions.bind(contentController)
);
contentRoutes.post(
  "/terms-and-conditions",
  contentController.createTermsAndConditions.bind(contentController)
);
contentRoutes.put(
  "/terms-and-conditions/",
  contentController.updateTermsAndConditions.bind(contentController)
);

contentRoutes.get(
  "/privacy-policy",
  contentController.getPrivacyPolicy.bind(contentController)
);
contentRoutes.post(
  "/privacy-policy",
  contentController.createPrivacyPolicy.bind(contentController)
);
contentRoutes.put(
  "/privacy-policy",
  contentController.updatePrivacyPolicy.bind(contentController)
);

contentRoutes.get(
  "/cookies",
  contentController.getCookiesPolicy.bind(contentController)
);
contentRoutes.post(
  "/cookies",
  contentController.createCookiesPolicy.bind(contentController)
);
contentRoutes.put(
  "/cookies/:id",
  contentController.updateCookiesPolicy.bind(contentController)
);
 
// Inquiry types
contentRoutes.get(
  "/inquiry-types",
  contentController.getInquiryTypes.bind(contentController)
);
// Admin endpoint - Get all inquiry types (including deleted)
contentRoutes.get(
  "/inquiry-types/admin",
  authentification,
  authorization([Roles.ADMIN]),
  contentController.getAllInquiryTypes.bind(contentController)
);
contentRoutes.post(
  "/inquiry-types",
  contentController.createInquiryType.bind(contentController)
);
contentRoutes.put(
  "/inquiry-types/:id",
  contentController.updateInquiryType.bind(contentController)
);
contentRoutes.delete(
  "/inquiry-types/:id",
  contentController.deleteInquiryType.bind(contentController)
);


// endpoint to upload image
contentRoutes.post(
  "/upload-image",
  upload.single("image"),
  (req: MulterRequest, res: Response) => {
    contentController.uploadImage(req, res);
  }
);

// endpoint to get images
contentRoutes.get(
  "/images",
  contentController.getImages.bind(contentController)
);

// endpoint to delete image
contentRoutes.delete(
  "/images/:id",
  contentController.deleteImage.bind(contentController)
);

export default contentRoutes;
