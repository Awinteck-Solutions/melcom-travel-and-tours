import mongoose, { Schema } from "mongoose";

// Bookings Schema for storing local booking data
const BookingsSchema = new Schema({
    bookingReference: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    bookingType: {
        type: String,
        enum: ["FLIGHT", "HOTEL", "RIDE"],
        required: true
    },
    // Flight booking details (when bookingType is FLIGHT)
    flightDetails: {
        golBookingId: String, // Reference to GOL API booking
        departureCity: String,
        arrivalCity: String,
        departureDate: Date,
        returnDate: Date,
        airline: String,
        flightNumber: String,
        passengers: [{
            title: String,
            firstName: String,
            lastName: String,
            dateOfBirth: Date,
            passport: String,
            nationality: String
        }]
    },
    // Hotel booking details (when bookingType is HOTEL)
    hotelDetails: {
        hotelName: String,
        location: String,
        checkInDate: Date,
        checkOutDate: Date,
        rooms: Number,
        guests: Number
    },
    // Ride booking details (when bookingType is RIDE)
    rideDetails: {
        pickupLocation: String,
        dropoffLocation: String,
        pickupDate: Date,
        vehicleType: String,
        duration: String
    },
    // Contact information
    contactInfo: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    // Payment details
    totalAmount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentMethod: String,
    paymentReference: String,
    // Status tracking
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "FAILED"],
        default: "PENDING"
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIAL"],
        default: "PENDING"
    },
    // Booking metadata
    bookingDate: {
        type: Date,
        default: Date.now
    },
    confirmationDate: Date,
    cancellationDate: Date,
    cancellationReason: String,
    notes: String,
    // External API references
    externalReferences: {
        golApiId: String,
        hotelApiId: String,
        rideApiId: String
    }
}, { timestamps: true });

// Create and export model
const Bookings = mongoose.model("Bookings", BookingsSchema);

export { Bookings };
export default Bookings;