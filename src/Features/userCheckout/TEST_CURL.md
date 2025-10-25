# UserCheckout API Testing with cURL

## 1. Create Checkout

```bash
curl -X POST http://localhost:3000/api/checkout/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
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
      "segment": [
        {
          "flightNumber": "208",
          "airline": "AFRICA WORLD AIRLINES LIMITED",
          "aircraft": "ER4",
          "departure": {
            "airport": "ACC",
            "time": "2025-10-31T06:30:00",
            "terminal": "3"
          },
          "arrival": {
            "airport": "LOS",
            "time": "2025-10-31T08:40:00",
            "terminal": "2"
          },
          "duration": "PT1H10M",
          "cabinClass": "Economy"
        }
      ],
      "bookingReference": "PD001",
      "currency": "GHS",
      "perPassenger": 1842,
      "segments": [
        {
          "flightNumber": "208",
          "airline": "AFRICA WORLD AIRLINES LIMITED",
          "aircraft": "ER4",
          "departure": {
            "airport": "ACC",
            "time": "2025-10-31T06:30:00",
            "terminal": "3"
          },
          "arrival": {
            "airport": "LOS",
            "time": "2025-10-31T08:40:00",
            "terminal": "2"
          },
          "duration": "PT1H10M",
          "cabinClass": "Economy"
        }
      ],
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
        "Surname": "Doe",
        "email": "john.doe@example.com",
        "phone": "+233241234567"
      }
    ]
  }'
```

**Expected Response:**
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

## 2. Check Payment Status

```bash
curl -X GET http://localhost:3000/api/checkout/status/CHECKOUT_ID_FROM_CREATE_RESPONSE \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment status retrieved successfully",
  "data": {
    "checkoutId": "checkout_123456",
    "bookingReference": "MT1703123456ABC",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "transactionId": null,
    "golReservationId": null,
    "totalAmount": 1842,
    "currency": "GHS",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

## 3. Get All Checkouts

```bash
curl -X GET http://localhost:3000/api/checkout/ \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

## 4. Test Hubtel Payment Callback (Simulation)

```bash
curl -X POST http://localhost:3000/api/checkout/payment/callback \
  -H "Content-Type: application/json" \
  -d '{
    "ResponseCode": "0000",
    "ResponseText": "Success",
    "Data": {
      "CheckoutId": "CHECKOUT_ID_FROM_CREATE_RESPONSE",
      "ClientReference": "BOOKING_REFERENCE_FROM_CREATE_RESPONSE",
      "Amount": 1842.00,
      "Status": "Success",
      "TransactionId": "TXN123456789",
      "Description": "Flight Booking Payment"
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Payment callback processed successfully",
  "data": {
    "checkoutId": "checkout_123456",
    "bookingReference": "MT1703123456ABC",
    "status": "CONFIRMED",
    "paymentStatus": "PAID"
  }
}
```

## 5. Check Status After Payment (Should show CONFIRMED)

```bash
curl -X GET http://localhost:3000/api/checkout/status/CHECKOUT_ID_FROM_CREATE_RESPONSE \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
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

## Testing Notes

1. **Replace Placeholders:**
   - `YOUR_AUTH_TOKEN`: Replace with actual JWT token
   - `CHECKOUT_ID_FROM_CREATE_RESPONSE`: Use the checkoutId from step 1 response
   - `BOOKING_REFERENCE_FROM_CREATE_RESPONSE`: Use the bookingReference from step 1 response

2. **Environment Variables Required:**
   ```env
   HUBTEL_API_ID=your_hubtel_api_id
   HUBTEL_API_KEY=your_hubtel_api_key
   HUBTEL_MERCHANT_ACCOUNT_NUMBER=your_merchant_account_number
   GOL_API_TOKEN=your_gol_api_token
   BASE_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:3001
   ```

3. **Complete Flow:**
   - Create checkout → Get checkoutUrl
   - Redirect user to checkoutUrl for payment
   - Hubtel sends callback automatically
   - Check status to verify payment completion
   - GOL reservation is created automatically on successful payment

4. **Error Scenarios:**
   - Invalid flight data: Returns 400
   - Missing authentication: Returns 401
   - Hubtel API errors: Returns 500 with error details
   - GOL API errors: Payment succeeds but GOL reservation fails (noted in logs)
