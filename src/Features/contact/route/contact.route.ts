import * as express from "express";
import { Response, Request } from "express";
import { ContactController } from "../controllers/contact.controller";
import { authentification } from "../../../middlewares/authentication.middleware";

const Router = express.Router();

// ----------------------------------------- CONTACT ROUTES ---------------------------------------------------

// PUBLIC ROUTES
Router.post("/contact-us-form", (req: Request, res: Response) => {
  ContactController.submitContactForm(req, res);
});

Router.get("/inquiry-types", (req: Request, res: Response) => {
  ContactController.getInquiryTypes(req, res);
});

// ADMIN ROUTES (Protected)
Router.get(
  "/contact-forms",
  authentification,
  (req: Request, res: Response) => {
    ContactController.getContactForms(req, res);
  }
);

Router.get(
  "/contact-forms/:id",
  authentification,
  (req: Request, res: Response) => {
    ContactController.getContactFormById(req, res);
  }
);

Router.patch(
  "/contact-forms/:id/status",
  authentification,
  (req: Request, res: Response) => {
    ContactController.updateContactFormStatus(req, res);
  }
);

Router.get(
  "/contact-form-stats",
  authentification,
  (req: Request, res: Response) => {
    ContactController.getContactFormStats(req, res);
  }
);

Router.post(
  "/inquiry-types",
  authentification,
  (req: Request, res: Response) => {
    ContactController.createInquiryType(req, res);
  }
);

Router.put(
  "/inquiry-types/:id",
  authentification,
  (req: Request, res: Response) => {
    ContactController.updateInquiryType(req, res);
  }
);

Router.delete(
  "/inquiry-types/:id",
  authentification,
  (req: Request, res: Response) => {
    ContactController.deleteInquiryType(req, res);
  }
);

export default Router;
