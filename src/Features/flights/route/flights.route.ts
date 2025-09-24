import * as express from "express";
const Router = express.Router();

// Temporary endpoints for flights
Router.get("/flight-deals", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Flight deals endpoint working",
    data: []
  });
});

Router.get("/flight-deals/:id", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Flight deal by ID endpoint working",
    data: { id: req.params.id }
  });
});

Router.get("/flight-deals-categories", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Flight deal categories endpoint working",
    data: []
  });
});

Router.get("/flight-bookings", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Flight bookings endpoint working",
    data: []
  });
});

Router.post("/flight-bookings", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Create flight booking endpoint working",
    data: { bookingReference: "FL" + Date.now() }
  });
});

Router.get("/flight-bookings/:id", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Flight booking by ID endpoint working",
    data: { id: req.params.id }
  });
});

export default Router;