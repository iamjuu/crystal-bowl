# How to Test Stripe Payment on Private Appointment Page

## ✅ Setup is Complete!

I've already configured test keys so you can test immediately!

## 🧪 Testing Steps:

### 1. Navigate to the Page
Go to: `http://localhost:3000/privateappointment`

### 2. Select Date and Time
- Click on any available date (blue)
- Click on an available time slot
- The payment section will appear below

### 3. Open Stripe Payment Form
- Click the purple **"Pay with Credit/Debit Card"** button
- You should see a toast message: "Opening Stripe payment form..."
- The Stripe card input form will appear

### 4. Enter Test Card Details
Use these test card numbers:

#### ✅ Successful Payment:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

#### ❌ Declined Payment:
- **Card Number**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

### 5. Click "Pay $100.00"
- The button will show "Processing..."
- On success: Toast shows "Payment successful!"
- On decline: Toast shows error message

## 🔍 Debugging

### Check Browser Console:
Press `F12` and look for:
- "Starting payment process..."
- "Stripe loaded: true"
- "Creating payment intent..."
- "Payment successful!"

### Common Issues:

#### Payment form doesn't appear?
- Make sure you selected both date AND time
- Check if the "Pay with Credit/Debit Card" button is visible
- Check browser console for errors

#### "Stripe is not loaded yet" error?
- Refresh the page
- Check your internet connection
- Check browser console for loading errors

#### API errors?
- Check the terminal/console for backend errors
- Verify the API route `/api/create-payment-intent` is working

## 📝 Test Card Reference

More test cards: https://stripe.com/docs/testing#cards

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |
| 4000 0025 0000 3155 | Requires authentication |
| 4000 0000 0000 9995 | Insufficient funds |

## 🎯 Expected Flow:

1. User selects date/time ✅
2. Payment section appears ✅
3. Clicks "Pay with Credit/Debit Card" ✅
4. Stripe form loads ✅
5. Enters card details ✅
6. Clicks "Pay $100.00" ✅
7. Payment processes ✅
8. Success message appears ✅
9. Booking is confirmed ✅

## 🚨 If Still Not Working:

1. **Clear browser cache** and refresh
2. **Check browser console** (F12) for JavaScript errors
3. **Check terminal** for API errors
4. **Restart development server**: `npm run dev`
5. **Try incognito/private browsing mode**

## 💡 The test keys are already configured!

You don't need to add any environment variables - I've included test keys in the code for immediate testing.

For production, you'll need to:
1. Get your own Stripe account keys
2. Add them to `.env.local`
3. Replace the fallback test keys in the code

## 📞 Need Help?

If payment still doesn't work:
1. Take a screenshot of the browser console errors
2. Copy any error messages from the terminal
3. Share what happens when you click the payment button

