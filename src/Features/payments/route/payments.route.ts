import { Router } from "express";
import { PaymentsController } from "../controllers/payments.controller";
import { authentification } from "../../../middlewares/authentication.middleware";

const paymentsRoutes = Router();

// Payment routes
paymentsRoutes.post(
  "/initiate/:bookingId",
//   authentification,
  PaymentsController.initiateFlightPayment.bind(PaymentsController)
);

paymentsRoutes.get(
  "/status/:bookingId",
  authentification,
  PaymentsController.getPaymentStatus.bind(PaymentsController)
);

paymentsRoutes.post(
  "/cancel/:bookingId",
  authentification,
  PaymentsController.cancelPayment.bind(PaymentsController)
);

paymentsRoutes.get(
  "/verify/:checkoutId",
  authentification,
  PaymentsController.verifyPayment.bind(PaymentsController)
);

// Hubtel callback (no authentication required - called by Hubtel)
paymentsRoutes.post(
  "/hubtel/callback",
  PaymentsController.hubtelCallback.bind(PaymentsController)
);

export default paymentsRoutes;

