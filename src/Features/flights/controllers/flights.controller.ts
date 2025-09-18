import { Request, Response } from "express";
import axios from "axios";

export class FlightsController {
    private static GOL_API_BASE_URL = process.env.GOL_API_BASE_URL || "https://golapi.golibe.com/api";

    // Search flights - intermediary to GOL API
    static async searchFlights(req: Request, res: Response) {
        try {
            const { from, to, departure, return_date, adults, children, infants, cabin_class } = req.query;
            
            // Forward request to GOL API
            const golResponse = await axios.get(`${this.GOL_API_BASE_URL}/flights/search`, {
                params: {
                    from,
                    to,
                    departure,
                    return_date,
                    adults: adults || 1,
                    children: children || 0,
                    infants: infants || 0,
                    cabin_class: cabin_class || "economy"
                },
                headers: {
                    'Authorization': `Bearer ${process.env.GOL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return res.status(200).json({
                success: true,
                message: "Flight search completed successfully",
                data: golResponse.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to search flights",
                error: error.response?.data || error.message
            });
        }
    }

    // Get flight details - intermediary to GOL API
    static async getFlightById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            // Forward request to GOL API
            const golResponse = await axios.get(`${this.GOL_API_BASE_URL}/flights/${id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.GOL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return res.status(200).json({
                success: true,
                message: "Flight details retrieved successfully",
                data: golResponse.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve flight details",
                error: error.response?.data || error.message
            });
        }
    }

    // Get flight offers - intermediary to GOL API
    static async getFlightOffers(req: Request, res: Response) {
        try {
            const { category, destination, price_range } = req.query;
            
            // Forward request to GOL API
            const golResponse = await axios.get(`${this.GOL_API_BASE_URL}/flights/offers`, {
                params: {
                    category,
                    destination,
                    price_range
                },
                headers: {
                    'Authorization': `Bearer ${process.env.GOL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return res.status(200).json({
                success: true,
                message: "Flight offers retrieved successfully",
                data: golResponse.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve flight offers",
                error: error.response?.data || error.message
            });
        }
    }

    // Create flight booking with GOL API
    static async createFlightBooking(req: Request, res: Response) {
        try {
            // Forward booking request to GOL API
            const golResponse = await axios.post(`${this.GOL_API_BASE_URL}/bookings/flights`, req.body, {
                headers: {
                    'Authorization': `Bearer ${process.env.GOL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return res.status(201).json({
                success: true,
                message: "Flight booking created successfully",
                data: golResponse.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create flight booking",
                error: error.response?.data || error.message
            });
        }
    }

    // Get flight booking from GOL API
    static async getFlightBookingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            // Forward request to GOL API
            const golResponse = await axios.get(`${this.GOL_API_BASE_URL}/bookings/flights/${id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.GOL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return res.status(200).json({
                success: true,
                message: "Flight booking retrieved successfully",
                data: golResponse.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve flight booking",
                error: error.response?.data || error.message
            });
        }
    }

    // Cancel flight booking with GOL API
    static async cancelFlightBooking(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            // Forward cancellation request to GOL API
            const golResponse = await axios.put(`${this.GOL_API_BASE_URL}/bookings/flights/${id}/cancel`, req.body, {
                headers: {
                    'Authorization': `Bearer ${process.env.GOL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return res.status(200).json({
                success: true,
                message: "Flight booking cancelled successfully",
                data: golResponse.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to cancel flight booking",
                error: error.response?.data || error.message
            });
        }
    }

    // Get airports - intermediary to GOL API
    static async getAirports(req: Request, res: Response) {
        try {
            const { search, country } = req.query;
            
            // Forward request to GOL API
            const golResponse = await axios.get(`${this.GOL_API_BASE_URL}/airports`, {
                params: { search, country },
                headers: {
                    'Authorization': `Bearer ${process.env.GOL_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            return res.status(200).json({
                success: true,
                message: "Airports retrieved successfully",
                data: golResponse.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve airports",
                error: error.response?.data || error.message
            });
        }
    }
}
