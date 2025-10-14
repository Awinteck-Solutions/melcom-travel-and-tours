# Google OAuth Authentication Setup

This API now supports Google OAuth authentication through the `/auth/google` endpoint.

## Setup Requirements

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add your domain to authorized origins

### 2. Environment Variables
Add these to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## API Usage

### Endpoint
```
POST /auth/google
```

### Request Body
```json
{
  "idToken": "google_id_token_from_frontend"
}
```

### Response (Success)
```json
{
  "status": true,
  "message": "Google authentication successful",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "role": "user_role",
    "image": "profile_image_url",
    "token": "jwt_token"
  }
}
```

### Response (Error)
```json
{
  "status": false,
  "message": "Google authentication failed",
  "error": "error_description"
}
```

## Frontend Implementation

### Using Google Sign-In JavaScript Library
```javascript
// Initialize Google Sign-In
gapi.load('auth2', function() {
  gapi.auth2.init({
    client_id: 'YOUR_GOOGLE_CLIENT_ID'
  });
});

// Handle sign-in
function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token;
  
  // Send to your API
  fetch('/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken: idToken
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status) {
      // Login successful
      localStorage.setItem('token', data.user.token);
      // Redirect or update UI
    } else {
      // Handle error
      console.error('Login failed:', data.message);
    }
  });
}
```

## Features

1. **Automatic User Registration**: If user doesn't exist, creates new account with Google profile info
2. **Existing User Login**: If user exists, logs them in and updates Google ID if needed
3. **Profile Picture**: Automatically sets user's Google profile picture
4. **Secure Token Verification**: Verifies Google ID token server-side
5. **JWT Token Generation**: Returns standard JWT token for API authentication

## Security Notes

- Google ID tokens are verified server-side using Google's official library
- User passwords are generated using Google ID as backup (for users created via Google auth)
- Google ID is stored securely and can be used for future logins
- Standard JWT tokens are issued for API access