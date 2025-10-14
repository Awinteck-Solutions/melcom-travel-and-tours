import { Router } from "express";
import { ContentController } from "../controllers/content.controller";

const contentRoutes = Router();
const contentController = new ContentController();

// Content routes
contentRoutes.get(
  "/recommended-country-list",
  contentController.getRecommendedCountries.bind(contentController)
);
contentRoutes.get(
  "/recommended-country",
  contentController.getRecommendedCountriesByFilter.bind(contentController)
);

// CRUD operations for recommended countries
contentRoutes.post(
  "/recommended-country-list",
  contentController.createRecommendedCountry.bind(contentController)
);
contentRoutes.put(
  "/recommended-country-list/:id",
  contentController.updateRecommendedCountry.bind(contentController)
);
contentRoutes.delete(
  "/recommended-country-list/:id",
  contentController.deleteRecommendedCountry.bind(contentController)
);
contentRoutes.get(
  "/terms-and-conditions",
  contentController.getTermsAndConditions.bind(contentController)
);
contentRoutes.get(
  "/privacy-policy",
  contentController.getPrivacyPolicy.bind(contentController)
);
contentRoutes.get(
  "/cookies",
  contentController.getCookiesPolicy.bind(contentController)
);
contentRoutes.get(
  "/contact-info",
  contentController.getContactInfo.bind(contentController)
);

// Contact form routes
contentRoutes.post(
  "/contact-us-form",
  contentController.submitContactForm.bind(contentController)
);
contentRoutes.get(
  "/contact-us-form",
  contentController.getContactFormSubmissions.bind(contentController)
);
contentRoutes.put(
  "/contact-us-form/:id",
  contentController.updateContactFormStatus.bind(contentController)
);

// Inquiry types
contentRoutes.get(
  "/inquiry-types",
  contentController.getInquiryTypes.bind(contentController)
);

// FAQ routes
contentRoutes.get("/faqs", contentController.getFAQs.bind(contentController));
contentRoutes.post(
  "/faqs",
  contentController.createFAQ.bind(contentController)
);
contentRoutes.put(
  "/faqs/:id",
  contentController.updateFAQ.bind(contentController)
);
contentRoutes.delete(
  "/faqs/:id",
  contentController.deleteFAQ.bind(contentController)
);

export default contentRoutes;
