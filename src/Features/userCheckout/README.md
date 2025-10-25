# UserCheckout Feature

This feature handles the complete checkout process for flight bookings, including payment processing with Hubtel and GOL API integration for flight reservations.

## Overview

The UserCheckout feature provides a seamless booking experience that:
1. Creates a booking with flight and traveler data
2. Initiates payment through Hubtel
3. Handles payment callbacks
4. Creates GOL API reservations upon successful payment
5. Updates booking status and provides transaction tracking

## API Endpoints

### 1. Create Checkout
**POST** `/api/checkout/create`

Creates a new checkout session and initiates payment with Hubtel.

**Request Body:**
```json
{
  "flight": {
    "id": 1,
    "from": "Accra Kotoka (ACC)",
    "fromCode": "ACC",
    "to": "LOS (LOS)",
    "toCode": "LOS",
    "airlineLogo": "/emirates.svg",
    "departure": "2025-10-31T06:30:00.000Z",
    "arrival": "2025-10-31T08:40:00.000Z",
    "airline": "AFRICA WORLD AIRLINES LIMITED",
    "planeType": "ER4",
    "flightType": "one-way",
    "returnDate": null,
    "price": 1842,
    "duration": "1h 10m",
    "stops": 0,
    "flightNumber": "208",
    "class": "Economy",
    "segment": [...],
    "bookingReference": "PD001",
    "currency": "GHS",
    "perPassenger": 1842,
    "segments": [...],
    "totalSegments": 1,
    "firstAirline": "AFRICA WORLD AIRLINES LIMITED",
    "firstAirlineCode": "AW"
  },
  "Traveler": [
    {
      "PassengerType": "ADT",
      "BirthDate": "1990-01-15",
      "Passport": "G12345678",
      "LoyaltyProgram": "",
      "Gender": "Male",
      "NamePrefix": "Mr",
      "GivenName": "John",
      "Surname": "Doe"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout created successfully",
  "data": {
    "checkoutId": "checkout_123456",
    "checkoutUrl": "https://checkout.hubtel.com/...",
    "bookingReference": "MT1703123456ABC",
    "status": "PENDING",
    "message": "Checkout created successfully. Redirect user to checkoutUrl for payment."
  },
  "instructions": {
    "redirect": "Redirect user to checkoutUrl for payment",
    "direct": "Use checkoutDirectUrl for inline payment"
  }
}
```

### 2. Check Payment Status
**GET** `/api/checkout/status/:checkoutId`

Checks the current payment status and updates it with Hubtel if needed.

**Response:**
```json
{
  "success": true,
  "message": "Payment status retrieved successfully",
  "data": {
    "checkoutId": "checkout_123456",
    "bookingReference": "MT1703123456ABC",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "transactionId": "TXN123456789",
    "golReservationId": "GOL_RES_123456",
    "totalAmount": 1842,
    "currency": "GHS",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:35:00.000Z"
  }
}
```

### 3. Get All Checkouts
**GET** `/api/checkout/`

Retrieves all checkouts for the authenticated user (or all checkouts for admin).

**Response:**
```json
{
  "success": true,
  "message": "Checkouts retrieved successfully",
  "data": [
    {
      "checkoutId": "checkout_123456",
      "bookingReference": "MT1703123456ABC",
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "totalAmount": 1842,
      "currency": "GHS",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### 4. Hubtel Payment Callback
**POST** `/api/checkout/payment/callback`

Handles payment callbacks from Hubtel (automatically called by Hubtel). This endpoint now includes automatic status verification with Hubtel using the ClientReference.

**Request Body (from Hubtel):**
```json
{
  "ResponseCode": "0000",
  "ResponseText": "Success",
  "Data": {
    "CheckoutId": "checkout_123456",
    "ClientReference": "MT1703123456ABC",
    "Amount": 1842.00,
    "Status": "Success",
    "TransactionId": "TXN123456789",
    "Description": "Flight Booking Payment"
  }
}
```

**Enhanced Response:**
```json
{
  "success": true,
  "message": "Payment callback processed successfully",
  "data": {
    "checkoutId": "checkout_123456",
    "bookingReference": "MT1703123456ABC",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "hubtelStatusCheck": "Verified"
  }
}
```

**Status Check Process:**
1. Receives callback from Hubtel
2. Performs additional status check using ClientReference
3. Uses verified status from Hubtel API if available
4. Updates booking status based on verified information
5. Creates GOL reservation if payment is successful

## Complete Checkout Flow

### 1. Frontend Initiation
```javascript
// Frontend creates checkout
const response = await fetch('/api/checkout/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  },
  body: JSON.stringify({
    flight: flightData,
    Traveler: travelerData
  })
});

const { data } = await response.json();
// Redirect user to data.checkoutUrl for payment
window.location.href = data.checkoutUrl;
```

### 2. Payment Processing
- User completes payment on Hubtel checkout page
- Hubtel sends callback to `/api/checkout/payment/callback`
- System updates booking status and creates GOL reservation

### 3. Status Checking
```javascript
// Frontend checks payment status
const statusResponse = await fetch(`/api/checkout/status/${checkoutId}`, {
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
});

const { data } = await statusResponse.json();
if (data.status === 'CONFIRMED' && data.paymentStatus === 'PAID') {
  // Payment successful, show confirmation
}
```

## Database Schema

The UserCheckout schema includes:

- **bookingReference**: Unique booking identifier
- **flight**: Complete flight information
- **travelers**: Array of passenger details
- **totalAmount**: Total booking amount
- **currency**: Currency code (default: GHS)
- **status**: Booking status (PENDING, CONFIRMED, CANCELLED, FAILED)
- **paymentStatus**: Payment status (PENDING, PAID, FAILED, REFUNDED)
- **checkoutId**: Hubtel checkout identifier
- **transactionId**: Hubtel transaction identifier
- **golReservationId**: GOL API reservation identifier
- **userId**: Associated user ID
- **contactInfo**: Contact information
- **notes**: Additional notes and tracking information

## Environment Variables

Required environment variables:

```env
HUBTEL_API_ID=your_hubtel_api_id
HUBTEL_API_KEY=your_hubtel_api_key
HUBTEL_MERCHANT_ACCOUNT_NUMBER=your_merchant_account_number
GOL_API_TOKEN=your_gol_api_token
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

## Error Handling

The system handles various error scenarios:

1. **Invalid Flight Data**: Returns 400 with validation message
2. **Hubtel API Errors**: Logs error and returns 500 with error details
3. **GOL API Errors**: Updates booking with payment success but notes GOL failure
4. **Database Errors**: Returns 500 with appropriate error message

## Testing

Use the provided Postman collection `Melcom-Travel-Checkout-API.postman_collection.json` to test all endpoints.

### Test Flow:
1. Create checkout with sample data
2. Use returned checkoutId to check status
3. Test callback with mock Hubtel response
4. Verify booking status updates

## Security Considerations

- All endpoints require authentication (except callback)
- Payment callbacks should be verified for authenticity
- Sensitive data is logged appropriately
- Database queries are parameterized to prevent injection

## Integration Notes

- **Hubtel Integration**: Uses Basic Auth with API credentials
- **GOL API Integration**: Uses Bearer token authentication
- **Frontend Integration**: Provides checkout URLs for seamless redirects
- **Status Tracking**: Real-time status updates via API calls
- **Status Verification**: Automatic status verification with Hubtel using ClientReference

## Status Check Enhancement

The system now includes enhanced status verification:

### **Automatic Status Check**
When a payment callback is received, the system automatically:
1. **Verifies with Hubtel**: Makes a status check call to `https://api-txnstatus.hubtel.com/transactions/status?clientReference={ClientReference}`
2. **Uses Verified Data**: Prioritizes the status from Hubtel's API over callback data
3. **Fallback Handling**: Uses callback data if status check fails
4. **Audit Trail**: Logs whether status was verified or callback-only

### **Manual Status Check**
The `/api/checkout/status/:checkoutId` endpoint also performs status checks:
- **For PENDING Payments**: Automatically checks with Hubtel
- **Real-time Updates**: Updates booking status based on current Hubtel status
- **Comprehensive Logging**: Records all status check attempts and results

### **Status Check API Call**
```bash
GET /transactions/status?clientReference={ClientReference} HTTP/1.1
Host: api-txnstatus.hubtel.com
Authorization: Basic {base64_encoded_credentials}
```

This ensures maximum reliability and prevents payment status discrepancies.
