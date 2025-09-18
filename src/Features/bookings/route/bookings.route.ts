import { Router } from "express";
import { BookingsController } from "../controllers/bookings.controller";

const bookingsRoutes = Router();
const bookingsController = new BookingsController();

// Bookings routes
bookingsRoutes.get("/bookings", bookingsController.getBookings.bind(bookingsController));
bookingsRoutes.get("/bookings/:id", bookingsController.getBookingById.bind(bookingsController));
bookingsRoutes.post("/bookings", bookingsController.createBooking.bind(bookingsController));
bookingsRoutes.put("/bookings/:id", bookingsController.updateBooking.bind(bookingsController));

// Booking actions
bookingsRoutes.put("/bookings/:id/cancel", bookingsController.cancelBooking.bind(bookingsController));
bookingsRoutes.put("/bookings/:id/confirm", bookingsController.confirmBooking.bind(bookingsController));
bookingsRoutes.put("/bookings/:id/payment-status", bookingsController.updatePaymentStatus.bind(bookingsController));

export default bookingsRoutes;