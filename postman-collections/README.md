# Melcom Travel & Tours - Postman Collections

This directory contains comprehensive Postman collections for testing the Melcom Travel & Tours API. The collections are organized by feature to make it easy to test specific functionality.

## Collections Overview

### 1. Melcom-Travel-API-Complete.postman_collection.json
**Complete API Collection** - Contains all endpoints organized by feature:
- Authentication (register, login, profile management)
- User Management (admin operations)
- Flights (search, deals, bookings)
- Blogs (CRUD operations, categories)
- Content Management (countries, legal pages, FAQs, contact forms)
- Bookings (flight, hotel, ride bookings)
- Analytics (dashboard metrics)
- Test Routes

### 2. Melcom-Travel-Flights-API.postman_collection.json
**Flights-Specific Collection** - Focused on flight operations:
- Flight Search (one-way, return, multi-city, business class, family)
- Flight Deals (get deals, categories)
- Flight Bookings (create, manage bookings)
- Utilities (airports)

### 3. Melcom-Travel-Auth-API.postman_collection.json
**Authentication Collection** - User authentication and management:
- Authentication (register, login, Google auth, password management)
- Profile Management (get, update profile with/without image)
- Notifications (alerts, status updates)
- User Management (admin operations)

### 4. Melcom-Travel-Content-API.postman_collection.json
**Content Management Collection** - Content and blog management:
- Blogs (CRUD operations, categories)
- Recommended Countries (destination management)
- Legal Pages (terms, privacy, cookies)
- Contact Information (contact forms, inquiry types)
- FAQs (frequently asked questions)

### 5. Melcom-Travel-Bookings-Analytics-API.postman_collection.json
**Bookings & Analytics Collection** - Booking management and analytics:
- Bookings Management (flight, hotel, ride bookings)
- Analytics Dashboard (logs, metrics, reports)

### 6. Melcom-Travel-Environment.postman_environment.json
**Environment Variables** - Shared environment configuration

## Setup Instructions

### 1. Import Collections
1. Open Postman
2. Click "Import" button
3. Select all `.postman_collection.json` files from this directory
4. Import the environment file: `Melcom-Travel-Environment.postman_environment.json`

### 2. Configure Environment
1. Select the "Melcom Travel & Tours - Development" environment
2. Update the `baseUrl` variable if your server runs on a different port
3. The `authToken` will be automatically set when you login

### 3. Authentication Flow
1. Start with the "Register New User" request in the Auth collection
2. Use the "Login User" request to get an authentication token
3. The token will be automatically stored in the `authToken` environment variable
4. All subsequent requests will use this token for authentication

## API Endpoints Overview

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/google` - Google authentication
- `POST /auth/forget-password` - Password reset
- `POST /auth/change-password` - Change password
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile

### Flight Endpoints
- `POST /flights/search` - Search flights
- `GET /flight-deals` - Get flight deals
- `GET /flight-deals/:id` - Get specific deal
- `GET /flight-deals-categories` - Get deal categories
- `GET /flight-bookings` - Get all bookings
- `POST /flight-bookings` - Create booking
- `GET /flight-bookings/:id` - Get booking by ID
- `GET /airports` - Get airports list

### Blog Endpoints
- `GET /blogs` - Get all blogs
- `GET /blogs/:id` - Get blog by ID
- `POST /blogs` - Create blog
- `PUT /blogs/:id` - Update blog
- `DELETE /blogs/:id` - Delete blog
- `GET /blogs-categories` - Get categories
- `POST /blogs-categories` - Create category
- `PUT /blogs-categories/:id` - Update category
- `DELETE /blogs-categories/:id` - Delete category

### Content Endpoints
- `GET /recommended-country-list` - Get recommended countries
- `POST /recommended-country-list` - Create country
- `PUT /recommended-country-list/:id` - Update country
- `DELETE /recommended-country-list/:id` - Delete country
- `GET /terms-and-conditions` - Get terms
- `GET /privacy-policy` - Get privacy policy
- `GET /cookies` - Get cookies policy
- `GET /contact-info` - Get contact info
- `POST /contact-us-form` - Submit contact form
- `GET /contact-us-form` - Get form submissions
- `PUT /contact-us-form/:id` - Update form status
- `GET /inquiry-types` - Get inquiry types
- `GET /faqs` - Get FAQs
- `POST /faqs` - Create FAQ
- `PUT /faqs/:id` - Update FAQ
- `DELETE /faqs/:id` - Delete FAQ

### Booking Endpoints
- `GET /bookings` - Get all bookings
- `GET /bookings/:id` - Get booking by ID
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking
- `PUT /bookings/:id/cancel` - Cancel booking
- `PUT /bookings/:id/confirm` - Confirm booking
- `PUT /bookings/:id/payment-status` - Update payment status

### Analytics Endpoints
- `GET /logs` - Get activity logs
- `GET /total-users` - Get user analytics
- `GET /total-bookings` - Get booking analytics
- `GET /total-amount` - Get revenue analytics
- `GET /total-cancelations` - Get cancellation analytics
- `GET /total-contact-info` - Get contact analytics

### User Management Endpoints
- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `PATCH /users/update-user/:id` - Update user (admin)
- `PATCH /users/update-user` - Update current user
- `PATCH /users/change-password` - Change password
- `GET /users/profile` - Get user profile
- `DELETE /users/delete-user/:id` - Delete user

## Sample Request Bodies

### Flight Search
```json
{
  "origin": "ACC",
  "destination": "LHR",
  "departureDate": "2024-12-25",
  "returnDate": "2025-01-05",
  "adults": 2,
  "children": 1,
  "infants": 0,
  "cabin": "ECO",
  "tripType": "return",
  "directFlightsOnly": false,
  "currency": "GHS"
}
```

### User Registration
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phoneNumber": "+233123456789",
  "gender": "male",
  "nationality": "Ghanaian",
  "dateOfBirth": "1990-01-01"
}
```

### Flight Booking
```json
{
  "offerId": "offer_123",
  "passengers": [
    {
      "title": "Mr",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "nationality": "Ghanaian",
      "passengerType": "ADT",
      "passportNumber": "G12345678",
      "passportExpiry": "2030-01-01",
      "passportCountry": "Ghana",
      "email": "john.doe@example.com",
      "phone": "+233123456789"
    }
  ],
  "contactEmail": "john.doe@example.com",
  "contactPhone": "+233123456789"
}
```

## Environment Variables

The environment file includes the following variables:
- `baseUrl` - API base URL (default: http://localhost:3000)
- `authToken` - JWT authentication token (auto-set on login)
- `userId` - Current user ID (auto-set on login)
- `bookingId` - Booking ID for testing
- `blogId` - Blog ID for testing
- `categoryId` - Category ID for testing
- `countryId` - Country ID for testing
- `faqId` - FAQ ID for testing
- `contactFormId` - Contact form ID for testing
- `notificationId` - Notification ID for testing
- `dealId` - Deal ID for testing
- `offerId` - Offer ID for testing

## Testing Workflow

1. **Start the server** - Ensure your Melcom Travel API server is running
2. **Import collections** - Import all Postman collections
3. **Set environment** - Select the development environment
4. **Register/Login** - Create a user account or login
5. **Test endpoints** - Use the organized collections to test different features
6. **Check responses** - Verify API responses and status codes

## Notes

- All authenticated endpoints require the `Authorization: Bearer {token}` header
- File uploads (profile images) use `multipart/form-data`
- Some endpoints are admin-only and require appropriate user roles
- The collections include pre-request scripts to automatically set environment variables
- Test scripts are included to automatically extract and store response data

## Support

For API documentation, see:
- `API_DOCUMENTATION.md` - General API documentation
- `FLIGHT_API_DOCUMENTATION.md` - Flight-specific documentation
- `GOOGLE_AUTH_SETUP.md` - Google authentication setup

For issues or questions, please refer to the project documentation or contact the development team.
