# Email Verification System Guide

## Overview

This application requires users to verify their email address before they can log in. This document explains how the email verification system works and how to use it.

## User Flow

### 1. Sign Up
- User creates an account at `/signup`
- A verification token is generated and stored in the database
- In **development mode**, the verification link is shown in a toast notification
- In **production**, an email would be sent (requires email service setup)

### 2. Email Verification
- User clicks the verification link (format: `/verify-email?token=xxx`)
- The system verifies the token and marks the email as verified
- User is redirected to the login page

### 3. Login
- User attempts to log in at `/login`
- If email is not verified, they receive a 403 error with a helpful message
- A link to resend the verification email is shown

### 4. Resend Verification (if needed)
- User can request a new verification email at `/resend-verification`
- Enter their email address
- A new verification token is generated
- In development mode, the link is displayed on screen

## API Endpoints

### POST `/api/auth/register`
Creates a new user account and generates a verification token.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (Development):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "john@example.com",
    "message": "Please verify your email to continue",
    "verificationUrl": "http://localhost:3000/verify-email?token=xxx"
  }
}
```

### GET `/api/auth/verify-email?token=xxx`
Verifies the user's email address.

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### POST `/api/auth/resend-verification`
Sends a new verification email to the user.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent successfully",
  "data": {
    "verificationUrl": "http://localhost:3000/verify-email?token=xxx"
  }
}
```

### POST `/api/auth/login`
Authenticates a user (requires verified email).

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (Unverified Email):**
```json
{
  "success": false,
  "message": "Please verify your email before logging in"
}
```
Status: 403

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "role": "user"
  }
}
```

## Pages

### `/signup` - Sign Up Page
- User registration form
- Shows verification link in development mode
- Redirects to login after successful registration

### `/login` - Login Page
- User authentication form
- Shows error if email is not verified
- Provides link to resend verification email
- Link to resend verification page

### `/verify-email` - Email Verification Page
- Automatically verifies email using token from URL
- Shows success/error message
- Redirects to login on success

### `/resend-verification` - Resend Verification Page
- Form to request new verification email
- Shows verification link in development mode
- Provides feedback on success

## Development Mode

In development mode (`NODE_ENV === "development"`), the verification URLs are displayed directly in:
1. Toast notifications after signup
2. The resend verification success page
3. Console logs (for debugging)

This allows you to test the verification flow without setting up an email service.

## Production Setup

For production, you need to:

1. **Set up an email service** (see `GMAIL_SMTP_SETUP.md` or `GMAIL_API_SETUP.md`)
2. **Update the registration endpoint** to send actual emails
3. **Update the resend verification endpoint** to send actual emails
4. **Set environment variables:**
   - `NEXT_PUBLIC_BASE_URL` - Your production URL
   - Email service credentials (see email setup guides)

### Example Email Service Integration

In `app/api/auth/register/route.ts` and `app/api/auth/resend-verification/route.ts`, add:

```typescript
import { sendEmail } from "@/lib/email";

// After generating verificationToken:
const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`;

await sendEmail({
  to: email,
  subject: "Verify Your Email Address",
  html: `
    <h1>Welcome!</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>If you didn't create an account, you can safely ignore this email.</p>
  `,
});
```

## Database Schema

The `User` model includes:
- `emailVerified` (Boolean) - Whether the email is verified
- `verificationToken` (String) - Token for email verification (cleared after verification)

## Security Considerations

1. **Token Security**: Verification tokens are 32-byte random strings
2. **Token Expiry**: Consider adding token expiration (not currently implemented)
3. **Rate Limiting**: Consider adding rate limiting to prevent abuse
4. **Email Privacy**: The resend endpoint doesn't reveal if an email exists in the system

## Troubleshooting

### User can't log in
- Check if their email is verified in the database
- Direct them to `/resend-verification` to get a new verification link

### Verification link doesn't work
- Check if the token matches in the database
- Ensure the user hasn't already verified (token is cleared after verification)
- Generate a new token via `/resend-verification`

### Development mode - not seeing verification links
- Check that `NODE_ENV` is set to `development`
- Look for toast notifications after signup
- Check the browser console for logs

## Testing the Flow

1. **Sign up a new user:**
   ```bash
   POST http://localhost:3000/api/auth/register
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Copy the verification URL from the response**

3. **Visit the verification URL in your browser**

4. **Try to log in:**
   ```bash
   POST http://localhost:3000/api/auth/login
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

5. **Should succeed after verification!**

## Quick Fix for Existing Users

If you have existing users in the database who haven't verified their emails, you can:

1. **Manually verify them in MongoDB:**
   ```javascript
   db.users.updateMany(
     { emailVerified: false },
     { $set: { emailVerified: true } }
   )
   ```

2. **Or have them use the resend verification flow**

## Future Enhancements

- Add token expiration (e.g., 24 hours)
- Add email templates with better styling
- Add rate limiting for verification requests
- Add admin panel to manually verify users
- Add option to change email address

