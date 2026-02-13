# Zoho Payment Gateway Setup Guide

This guide will help you configure the Zoho Payment Gateway for the Codekar registration system.

## Prerequisites

Before you begin, ensure you have:
- A Zoho account
- Applied for Zoho Payment Gateway access
- Received your API credentials from Zoho

## Step 1: Obtain Zoho API Credentials

1. Log in to your [Zoho Payment Gateway Dashboard](https://www.zoho.com/in/checkout/)
2. Navigate to **Settings** → **API Keys** or **Developers** section
3. You'll need to obtain the following credentials:
   - **Organization ID** (also called Merchant ID)
   - **Gateway Key** (API Key or Public Key)
   - **Salt Key** (Secret Key for checksum generation)

> [!IMPORTANT]
> Keep your API keys secure and never commit them to version control in plain text.

## Step 2: Configure API Keys

### Option A: Using Environment Variables (Recommended)

1. Create a `.env` file in your project root if it doesn't exist:
   ```bash
   touch .env
   ```

2. Add your Zoho credentials to the `.env` file:
   ```env
   VITE_ZOHO_ORG_ID=your_organization_id_here
   VITE_ZOHO_GATEWAY_KEY=your_gateway_key_here
   VITE_ZOHO_SALT_KEY=your_salt_key_here
   ```

3. Make sure `.env` is in your `.gitignore` file

### Option B: Direct Configuration (Not Recommended for Production)

Edit `src/lib/zoho-payment-config.ts` and replace the placeholder values:

```typescript
export const ZOHO_ORGANIZATION_ID = "your_actual_organization_id";
export const ZOHO_GATEWAY_KEY = "your_actual_gateway_key";
export const ZOHO_SALT_KEY = "your_actual_salt_key";
```

> [!WARNING]
> Never commit real API keys to your repository!

## Step 3: Configure Environment

In `src/lib/zoho-payment-config.ts`, set the environment:

```typescript
// For testing
export const ZOHO_ENVIRONMENT: 'sandbox' | 'production' = 'sandbox';

// For production
export const ZOHO_ENVIRONMENT: 'sandbox' | 'production' = 'production';
```

## Step 4: Update Return URLs (Important!)

When deploying to production, update the return URLs in `src/lib/zoho-payment-config.ts`:

```typescript
export const ZOHO_RETURN_URLS = {
    success: `${BASE_URL}/payment-success`,  // Where to redirect after successful payment
    cancel: `${BASE_URL}/payment-cancel`,    // Where to redirect if payment is cancelled
    callback: `${BASE_URL}/payment-callback` // Webhook URL for payment verification
};
```

You may need to create these routes/pages in your application.

## Step 5: Update Zoho Payment Service

The current implementation in `src/lib/zoho-payment-service.ts` contains a basic payment integration structure. You may need to update it based on Zoho's actual API documentation:

1. Review Zoho's official API documentation
2. Update the `initiateZohoPayment` function with the correct API endpoint
3. Update the checksum generation in `generatePaymentChecksum` to match Zoho's algorithm
4. Implement proper payment callback verification

> [!NOTE]
> Zoho may provide SDK or specific integration guidelines. Follow their official documentation for the most accurate implementation.

## Step 6: Test the Integration

### In Sandbox Mode

1. Ensure `ZOHO_ENVIRONMENT` is set to `'sandbox'`
2. Open your registration form
3. Fill in the details
4. Click "Proceed to Payment"
5. Use Zoho's test card details (provided in their documentation)
6. Verify the payment flow works correctly

### Test Card Details (typically provided by Zoho)

Zoho will provide test credentials. Common test scenarios include:
- Successful payment
- Failed payment
- Cancelled payment
- Pending payment

## Step 7: Go Live

When ready to accept real payments:

1. Switch environment to production:
   ```typescript
   export const ZOHO_ENVIRONMENT: 'sandbox' | 'production' = 'production';
   ```

2. Ensure you're using production API keys (not sandbox keys)

3. Test thoroughly in production environment with small amounts first

4. Monitor the first few transactions closely

## Troubleshooting

### Payment Gateway Not Configured Message

If users see "Payment Gateway Configuration Pending":
- Check that API keys are properly set in the config file
- Verify environment variables are loaded correctly
- Check browser console for any errors

### Payment Initiation Fails

- Verify API keys are correct
- Check network tab for API errors
- Ensure CORS is properly configured
- Review Zoho's API documentation for required fields

### Callback/Webhook Issues

- Ensure callback URL is accessible publicly (not localhost)
- Verify checksum validation logic matches Zoho's requirements
- Check server logs for callback data

## Security Best Practices

1. **Never expose API keys**: Use environment variables
2. **Validate all callbacks**: Always verify checksums/signatures
3. **Use HTTPS**: Ensure your site uses SSL certificate
4. **Sanitize inputs**: Validate all user inputs before sending to payment gateway
5. **Log transactions**: Keep detailed logs for debugging and auditing

## Support

- **Zoho Support**: Contact Zoho's payment gateway support team
- **Documentation**: Refer to Zoho's official API documentation
- **Community**: Check Zoho developer forums for common issues

## Payment Flow Overview

```
User fills form → Clicks "Proceed to Payment" → 
→ Generate Order ID → Call Zoho API → 
→ Redirect to Zoho Gateway → User completes payment → 
→ Zoho redirects back → Verify payment → 
→ Store in Google Sheets → Send confirmation email → 
→ Show success message
```

## Additional Configuration

### Registration Fees

To update registration fees, edit `src/lib/zoho-payment-config.ts`:

```typescript
export const REGISTRATION_FEES = {
    individual: 1,      // Change amount for individual
    team: 1000          // Change amount for team
};
```

### Payment Methods

Zoho Payment Gateway supports:
- Credit/Debit Cards
- UPI
- Net Banking
- Wallets

Configure accepted payment methods in your Zoho dashboard.

---

## Quick Start Checklist

- [ ] Obtain Zoho API credentials
- [ ] Add credentials to `.env` file or config
- [ ] Set environment (sandbox/production)
- [ ] Update return URLs for your domain
- [ ] Review and update payment service code
- [ ] Test in sandbox mode
- [ ] Switch to production when ready
- [ ] Monitor first transactions

For any issues or questions, refer to Zoho's official documentation or contact their support team.
