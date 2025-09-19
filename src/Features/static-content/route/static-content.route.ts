import * as express from "express";
import { Response, Request } from "express";
import { StaticContentController } from "../controllers/static-content.controller";
import { authentification } from "../../../middlewares/authentication.middleware";

const Router = express.Router();

// ----------------------------------------- STATIC CONTENT ROUTES ---------------------------------------------------

// PUBLIC ROUTES
Router.get("/terms-and-conditions", (req: Request, res: Response) => {
  StaticContentController.getTermsAndConditions(req, res);
});

Router.get("/privacy-policy", (req: Request, res: Response) => {
  StaticContentController.getPrivacyPolicy(req, res);
});

Router.get("/cookies", (req: Request, res: Response) => {
  StaticContentController.getCookiesPolicy(req, res);
});

Router.get("/contact-info", (req: Request, res: Response) => {
  StaticContentController.getContactInfo(req, res);
});

Router.get("/faqs", (req: Request, res: Response) => {
  StaticContentController.getFAQs(req, res);
});

Router.get("/faq-categories", (req: Request, res: Response) => {
  StaticContentController.getFAQCategories(req, res);
});

// ADMIN ROUTES (Protected)
Router.post(
  "/static-content",
  authentification,
  (req: Request, res: Response) => {
    StaticContentController.createOrUpdateStaticContent(req, res);
  }
);

Router.post("/faqs", authentification, (req: Request, res: Response) => {
  StaticContentController.createFAQ(req, res);
});

Router.put("/faqs/:id", authentification, (req: Request, res: Response) => {
  StaticContentController.updateFAQ(req, res);
});

Router.delete("/faqs/:id", authentification, (req: Request, res: Response) => {
  StaticContentController.deleteFAQ(req, res);
});

Router.put("/contact-info", authentification, (req: Request, res: Response) => {
  StaticContentController.updateContactInfo(req, res);
});

export default Router;
