export class BookingsDTO {
    id: string
    bookingReference: string
    userId: string
    bookingType: string
    flightDetails?: {
        golBookingId?: string
        departureCity?: string
        arrivalCity?: string
        departureDate?: Date
        returnDate?: Date
        airline?: string
        flightNumber?: string
        passengers?: Array<{
            title?: string
            firstName?: string
            lastName?: string
            dateOfBirth?: Date
            passport?: string
            nationality?: string
        }>
    }
    hotelDetails?: {
        hotelName?: string
        location?: string
        checkInDate?: Date
        checkOutDate?: Date
        rooms?: number
        guests?: number
    }
    rideDetails?: {
        pickupLocation?: string
        dropoffLocation?: string
        pickupDate?: Date
        vehicleType?: string
        duration?: string
    }
    contactInfo: {
        email: string
        phone: string
    }
    totalAmount: number
    currency: string
    paymentMethod?: string
    paymentReference?: string
    status: string
    paymentStatus: string
    bookingDate: Date
    confirmationDate?: Date
    cancellationDate?: Date
    cancellationReason?: string
    notes?: string
    externalReferences?: {
        golApiId?: string
        hotelApiId?: string
        rideApiId?: string
    }
    createdAt: Date
    updatedAt: Date

    constructor(data) {
        this.id = data.id || data._id;
        this.bookingReference = data.bookingReference;
        this.userId = data.userId;
        this.bookingType = data.bookingType;
        this.flightDetails = data.flightDetails;
        this.hotelDetails = data.hotelDetails;
        this.rideDetails = data.rideDetails;
        this.contactInfo = data.contactInfo;
        this.totalAmount = data.totalAmount;
        this.currency = data.currency;
        this.paymentMethod = data.paymentMethod;
        this.paymentReference = data.paymentReference;
        this.status = data.status;
        this.paymentStatus = data.paymentStatus;
        this.bookingDate = data.bookingDate;
        this.confirmationDate = data.confirmationDate;
        this.cancellationDate = data.cancellationDate;
        this.cancellationReason = data.cancellationReason;
        this.notes = data.notes;
        this.externalReferences = data.externalReferences;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}