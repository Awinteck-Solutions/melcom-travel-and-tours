# Hubtel Payment Integration

This module handles payment processing for Melcom Travel & Tours using Hubtel's payment gateway.

## 🏗️ Architecture

### **Payment Flow**
1. **Flight Booking Created** → Status: `PENDING`
2. **Payment Initiated** → Hubtel checkout created
3. **User Pays** → Redirected to Hubtel payment page
4. **Payment Callback** → Hubtel notifies our system
5. **Booking Confirmed** → Status: `CONFIRMED`, Payment: `PAID`

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# Hubtel API Credentials
HUBTEL_API_ID=your_hubtel_api_id
HUBTEL_API_KEY=your_hubtel_api_key
HUBTEL_MERCHANT_ACCOUNT_NUMBER=your_merchant_account_number

# Application URLs
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

## 📋 API Endpoints

### **1. Initiate Payment**
```http
POST /api/payments/initiate/:bookingId
Authorization: Bearer {token}
Content-Type: application/json

{
  "returnUrl": "https://melcomtravel.com/booking/success",
  "cancellationUrl": "https://melcomtravel.com/booking/cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "bookingId": "booking_id",
    "bookingReference": "MT1703123456ABC",
    "payment": {
      "checkoutUrl": "https://payproxyapi.hubtel.com/checkout/...",
      "checkoutId": "checkout_id",
      "clientReference": "MT1703123456ABC",
      "checkoutDirectUrl": "https://payproxyapi.hubtel.com/direct/...",
      "amount": 1500.00,
      "currency": "USD"
    },
    "instructions": {
      "redirect": "Redirect user to checkoutUrl for payment",
      "direct": "Use checkoutDirectUrl for inline payment"
    }
  }
}
```

### **2. Get Payment Status**
```http
GET /api/payments/status/:bookingId
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment status retrieved successfully",
  "data": {
    "bookingId": "booking_id",
    "bookingReference": "MT1703123456ABC",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "paymentReference": "TXN123456789",
    "totalAmount": 1500.00,
    "currency": "USD",
    "bookingDate": "2024-12-01T10:00:00.000Z",
    "confirmationDate": "2024-12-01T10:05:00.000Z"
  }
}
```

### **3. Cancel Payment/Booking**
```http
POST /api/payments/cancel/:bookingId
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Customer requested cancellation"
}
```

### **4. Verify Payment (Manual)**
```http
GET /api/payments/verify/:checkoutId
Authorization: Bearer {token}
```

### **5. Hubtel Callback (Internal)**
```http
POST /api/payments/hubtel/callback
Content-Type: application/json

{
  "ResponseCode": "0000",
  "ResponseText": "Success",
  "Data": {
    "CheckoutId": "checkout_id",
    "ClientReference": "MT1703123456ABC",
    "Amount": 1500.00,
    "Status": "Success",
    "TransactionId": "TXN123456789",
    "Description": "Flight Booking Payment"
  }
}
```

## 🔄 Payment Status Flow

### **Booking Statuses**
- `PENDING` → Initial booking state
- `CONFIRMED` → Payment successful, booking confirmed
- `CANCELLED` → Booking cancelled by user or system
- `FAILED` → Payment failed or booking failed
- `COMPLETED` → Booking completed (travel completed)

### **Payment Statuses**
- `PENDING` → Payment initiated, awaiting completion
- `PAID` → Payment successful
- `FAILED` → Payment failed
- `REFUNDED` → Payment refunded
- `PARTIAL` → Partial payment (if applicable)

## 🧪 Testing

### **cURL Examples**

#### **1. Initiate Payment**
```bash
curl -X POST http://localhost:3000/api/payments/initiate/BOOKING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "returnUrl": "https://melcomtravel.com/booking/success",
    "cancellationUrl": "https://melcomtravel.com/booking/cancelled"
  }'
```

#### **2. Check Payment Status**
```bash
curl -X GET http://localhost:3000/api/payments/status/BOOKING_ID \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

#### **3. Cancel Booking**
```bash
curl -X POST http://localhost:3000/api/payments/cancel/BOOKING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "reason": "Customer requested cancellation"
  }'
```

#### **4. Test Hubtel Callback**
```bash
curl -X POST http://localhost:3000/api/payments/hubtel/callback \
  -H "Content-Type: application/json" \
  -d '{
    "ResponseCode": "0000",
    "ResponseText": "Success",
    "Data": {
      "CheckoutId": "test_checkout_id",
      "ClientReference": "MT1703123456ABC",
      "Amount": 1500.00,
      "Status": "Success",
      "TransactionId": "TXN123456789",
      "Description": "Flight Booking Payment"
    }
  }'
```

## 🔐 Security

### **Authentication**
- All payment endpoints require user authentication
- Hubtel callback endpoint is public (called by Hubtel)
- Basic Auth used for Hubtel API communication

### **Validation**
- Booking ownership validation
- Payment amount validation
- Status transition validation

## 📊 Integration Points

### **With Flight Booking**
- Integrates with existing flight booking system
- Updates booking status based on payment results
- Stores payment references for tracking

### **With Email System**
- Sends confirmation emails on successful payment
- Sends cancellation emails on failed payments
- TODO: Implement email notifications

### **With Analytics**
- Tracks payment success/failure rates
- Monitors booking conversion rates
- TODO: Add payment analytics

## 🚀 Deployment

### **Production Setup**
1. Update environment variables with production Hubtel credentials
2. Configure callback URLs to point to production domain
3. Set up SSL certificates for secure communication
4. Configure webhook endpoints in Hubtel dashboard

### **Monitoring**
- Monitor payment callback endpoints
- Set up alerts for failed payments
- Track payment processing times
- Monitor booking confirmation rates

## 📝 Notes

- Payment callbacks are processed asynchronously
- Failed payments can be retried
- Cancelled bookings can be refunded (manual process)
- All payment data is logged for audit purposes
- Integration supports both redirect and inline payment flows

