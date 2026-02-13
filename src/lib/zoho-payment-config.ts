/**
 * Zoho Payment Gateway Configuration
 * 
 * IMPORTANT: Add your actual Zoho API credentials when you receive them from Zoho.
 * These placeholder values will not work for actual payments.
 * 
 * To get your API keys:
 * 1. Log in to Zoho Payment Gateway Dashboard
 * 2. Navigate to Settings > API Keys
 * 3. Copy your Organization ID, Gateway Key, and Salt Key
 * 4. Replace the placeholder values below
 */

// ========================================
// REPLACE THESE WITH YOUR ACTUAL API KEYS
// ========================================
export const ZOHO_ORGANIZATION_ID = import.meta.env.VITE_ZOHO_ORG_ID || "REPLACE_WITH_YOUR_ORGANIZATION_ID";
export const ZOHO_GATEWAY_KEY = import.meta.env.VITE_ZOHO_GATEWAY_KEY || "REPLACE_WITH_YOUR_GATEWAY_KEY";
export const ZOHO_SALT_KEY = import.meta.env.VITE_ZOHO_SALT_KEY || "REPLACE_WITH_YOUR_SALT_KEY";


// Environment - switch to 'production' when ready to go live
export const ZOHO_ENVIRONMENT: 'sandbox' | 'production' = 'sandbox';

// Payment Gateway URLs
export const ZOHO_PAYMENT_URLS = {
    sandbox: "https://payments-sandbox.zoho.com/v1/payment",
    production: "https://payments.zoho.com/v1/payment"
};

export const ZOHO_PAYMENT_URL = ZOHO_PAYMENT_URLS[ZOHO_ENVIRONMENT];

// Registration Fees
export const REGISTRATION_FEES = {
    individual: 1,      // ₹1 for individual registration
    team: 1000          // ₹1000 for team registration
};

// Return URLs - Update these based on your deployment
const BASE_URL = window.location.origin;

export const ZOHO_RETURN_URLS = {
    success: `${BASE_URL}/payment-success`,
    cancel: `${BASE_URL}/payment-cancel`,
    callback: `${BASE_URL}/payment-callback`
};

// Payment Configuration
export const PAYMENT_CONFIG = {
    currency: "INR",
    country: "IN",
    language: "en",
    // Auto-capture payment (set to false if you want manual capture)
    autoCapture: true
};

// Check if Zoho is configured
export const isZohoConfigured = () => {
    return ZOHO_ORGANIZATION_ID !== "REPLACE_WITH_YOUR_ORGANIZATION_ID" &&
        ZOHO_GATEWAY_KEY !== "REPLACE_WITH_YOUR_GATEWAY_KEY" &&
        ZOHO_SALT_KEY !== "REPLACE_WITH_YOUR_SALT_KEY";
};
