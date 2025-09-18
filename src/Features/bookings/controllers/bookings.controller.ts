import { Request, Response } from 'express';
import { Bookings } from '../schema/bookings.schema';
import { BookingsDTO } from '../dto/bookings.dto';

export class BookingsController {
    // Get all bookings with filtering
    async getBookings(req: Request, res: Response) {
        try {
            const { userId, bookingType, status, paymentStatus, startDate, endDate } = req.query;
            
            const filter: any = {};
            if (userId) filter.userId = userId;
            if (bookingType) filter.bookingType = bookingType;
            if (status) filter.status = status;
            if (paymentStatus) filter.paymentStatus = paymentStatus;
            
            if (startDate || endDate) {
                filter.bookingDate = {};
                if (startDate) filter.bookingDate.$gte = new Date(startDate as string);
                if (endDate) filter.bookingDate.$lte = new Date(endDate as string);
            }
            
            const bookings = await Bookings.find(filter).sort({ bookingDate: -1 });
            const bookingsDTO = bookings.map(booking => new BookingsDTO(booking));
            
            res.status(200).json({
                success: true,
                data: bookingsDTO,
                message: 'Bookings retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving bookings',
                error: error.message
            });
        }
    }

    // Get booking by ID
    async getBookingById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const booking = await Bookings.findById(id);
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            
            const bookingDTO = new BookingsDTO(booking);
            
            res.status(200).json({
                success: true,
                data: bookingDTO,
                message: 'Booking retrieved successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving booking',
                error: error.message
            });
        }
    }

    // Create new booking
    async createBooking(req: Request, res: Response) {
        try {
            // Generate unique booking reference
            const bookingReference = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
            
            const bookingData = new Bookings({
                ...req.body,
                bookingReference
            });
            
            const savedBooking = await bookingData.save();
            const bookingDTO = new BookingsDTO(savedBooking);
            
            res.status(201).json({
                success: true,
                data: bookingDTO,
                message: 'Booking created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating booking',
                error: error.message
            });
        }
    }

    // Update booking
    async updateBooking(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const updatedBooking = await Bookings.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            
            const bookingDTO = new BookingsDTO(updatedBooking);
            
            res.status(200).json({
                success: true,
                data: bookingDTO,
                message: 'Booking updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating booking',
                error: error.message
            });
        }
    }

    // Cancel booking
    async cancelBooking(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { cancellationReason } = req.body;
            
            const updatedBooking = await Bookings.findByIdAndUpdate(
                id, 
                { 
                    status: 'CANCELLED',
                    cancellationDate: new Date(),
                    cancellationReason: cancellationReason || 'User requested cancellation'
                }, 
                { new: true }
            );
            
            if (!updatedBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            
            const bookingDTO = new BookingsDTO(updatedBooking);
            
            res.status(200).json({
                success: true,
                data: bookingDTO,
                message: 'Booking cancelled successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error cancelling booking',
                error: error.message
            });
        }
    }

    // Confirm booking
    async confirmBooking(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const updatedBooking = await Bookings.findByIdAndUpdate(
                id, 
                { 
                    status: 'CONFIRMED',
                    confirmationDate: new Date()
                }, 
                { new: true }
            );
            
            if (!updatedBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            
            const bookingDTO = new BookingsDTO(updatedBooking);
            
            res.status(200).json({
                success: true,
                data: bookingDTO,
                message: 'Booking confirmed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error confirming booking',
                error: error.message
            });
        }
    }

    // Update payment status
    async updatePaymentStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { paymentStatus, paymentReference, paymentMethod } = req.body;
            
            const updateData: any = { paymentStatus };
            if (paymentReference) updateData.paymentReference = paymentReference;
            if (paymentMethod) updateData.paymentMethod = paymentMethod;
            
            const updatedBooking = await Bookings.findByIdAndUpdate(id, updateData, { new: true });
            
            if (!updatedBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            
            const bookingDTO = new BookingsDTO(updatedBooking);
            
            res.status(200).json({
                success: true,
                data: bookingDTO,
                message: 'Payment status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating payment status',
                error: error.message
            });
        }
    }
}