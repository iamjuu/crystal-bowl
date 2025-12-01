# Admin System Setup Guide

## Overview
The admin system has been successfully migrated from Sacred-holy to crystel. All admin functionality, API routes, and components are now organized in crystel.

## Project Structure

```
crystel/
├── app/
│   ├── (user)/          # User-facing routes (existing shop, services, etc.)
│   ├── (admin)/         # Admin routes
│   │   ├── login/       # Admin login page
│   │   └── dashboard/   # Admin dashboard
│   │       ├── page.tsx            # Dashboard overview
│   │       ├── layout.tsx          # Dashboard layout with sidebar
│   │       ├── products/           # Product management
│   │       ├── orders/             # Order management
│   │       ├── sessions/           # Yoga session management
│   │       ├── users/              # User management
│   │       ├── blogs/              # Blog management
│   │       └── events/             # Events management
│   ├── api/             # API routes
│   │   ├── admin/       # Admin API endpoints
│   │   ├── auth/        # Authentication endpoints
│   │   ├── products/    # Product API
│   │   ├── orders/      # Orders API
│   │   ├── bookings/    # Bookings API
│   │   ├── sessions/    # Sessions API
│   │   └── seed/        # Database seeding
│   └── layout.tsx       # Root layout with SiteShell
├── components/
│   ├── user/            # User-facing components
│   │   ├── AddToCartButton.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── CartLink.tsx
│   │   ├── InstantBuyButton.tsx
│   │   └── SiteShell.tsx
│   ├── admin/           # Admin dashboard components
│   │   ├── AdminLogoutButton.tsx
│   │   ├── DashboardNav.tsx
│   │   └── DashboardBreadcrumb.tsx
│   └── dashboard/       # Reserved for additional dashboard components
├── lib/                 # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── email.ts         # Email sending utilities
│   ├── mongodb.ts       # Database connection
│   ├── countries.ts     # Country data
│   └── admin/
│       └── stats.ts     # Dashboard statistics
├── models/              # Mongoose models
│   ├── Administrator.ts
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   ├── Booking.ts
│   └── YogaSession.ts
├── stores/              # Zustand state management
│   └── useCart.ts
├── hooks/               # React hooks
│   └── useAuthSync.ts
├── types/               # TypeScript types
│   └── index.ts
└── middleware.ts        # Next.js middleware for route protection
```

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the crystel directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string (use a password generator)
- `GMAIL_USER` & `GMAIL_APP_PASSWORD`: For sending OTP emails

### 2. Install Dependencies
Dependencies have been installed. If you need to reinstall:

```bash
npm install
```

### 3. Setup MongoDB
Make sure MongoDB is running and create the database:

```bash
# Using MongoDB locally
mongod
```

Or use MongoDB Atlas (cloud) and update your MONGODB_URI accordingly.

### 4. Seed Admin User
Create your first admin user by calling the seed endpoint:

```bash
# Make a POST request to seed admin
curl -X POST http://localhost:3000/api/seed/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@crystelstudio.com",
    "password": "your-secure-password",
    "name": "Admin"
  }'
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at:
- User site: http://localhost:3000
- Admin login: http://localhost:3000/login
- Admin dashboard: http://localhost:3000/dashboard

## Features Migrated

### ✅ Authentication System
- JWT-based authentication
- OTP email verification
- Admin and user role separation
- Secure password hashing with bcrypt
- Token-based API protection

### ✅ Admin Dashboard
- Overview with statistics and charts
- Product management (CRUD)
- Order management
- Yoga session bookings
- User management
- Blog management (placeholder)
- Events management (placeholder)

### ✅ API Routes (31+ endpoints)
- `/api/admin/*` - Admin operations
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/orders/*` - Order processing
- `/api/bookings/*` - Session bookings
- `/api/sessions/*` - Yoga sessions
- `/api/payment/*` - Payment gateway integration
- `/api/seed/*` - Database seeding

### ✅ User Features
- Shopping cart with Zustand
- Product browsing and instant buy
- Session booking system
- User profile management
- Multiple addresses support
- Email notifications

### ✅ Middleware
- Route protection for admin/user areas
- Automatic redirect based on authentication status
- Admin cannot access user routes (and vice versa)

## Access Levels

### Admin Routes (requires admin role)
- `/login` - Admin login page
- `/dashboard/*` - All dashboard pages

### User Routes
- `/` - Home page
- `/(user)/*` - User pages (shop, services, events, etc.)
- `/products`, `/cart`, `/profile` - Shopping features

### Public Routes
- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/products` - Browse products
- `/api/sessions` - Browse sessions

## Next Steps

1. **Customize Admin Pages**: The dashboard pages (products, orders, sessions, users) are created with placeholders. You can add the full CRUD interfaces.

2. **Add Charts**: Install `recharts` if you want to add the dashboard charts:
   ```bash
   npm install recharts
   ```

3. **Configure Email**: Set up Gmail App Password for OTP emails (see GMAIL_SMTP_SETUP.md in Sacred-holy for instructions).

4. **Payment Integration**: Configure Razorpay or Stripe for payments.

5. **Customize Branding**: Update the "Crystal Bowl Studio" branding throughout the app.

## Troubleshooting

### "Cannot find module" errors
Make sure all imports use the correct paths with `@/` prefix.

### Authentication issues
1. Check JWT_SECRET is set in .env.local
2. Verify MongoDB connection
3. Clear browser localStorage and cookies

### Admin cannot login
1. Make sure you've seeded the admin user
2. Check the password is correct
3. Verify the JWT_SECRET matches

## Security Notes

- **Never commit** `.env.local` to version control
- Use strong passwords for admin accounts
- Keep JWT_SECRET secure and rotate it periodically
- Enable HTTPS in production
- Set `NODE_ENV=production` for production builds


