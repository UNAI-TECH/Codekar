/**
 * Zoho Payment Service
 * Handles payment gateway integration with Zoho
 */

import {
    ZOHO_ORGANIZATION_ID,
    ZOHO_GATEWAY_KEY,
    ZOHO_SALT_KEY,
    ZOHO_PAYMENT_URL,
    ZOHO_RETURN_URLS,
    PAYMENT_CONFIG,
    isZohoConfigured
} from './zoho-payment-config';

// Payment Request Interface
export interface ZohoPaymentRequest {
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    orderId: string;
    description?: string;
    registrationType: 'individual' | 'team';
}

// Payment Response Interface
export interface ZohoPaymentResponse {
    success: boolean;
    paymentUrl?: string;
    transactionId?: string;
    error?: string;
}

// Payment Status Interface
export interface PaymentStatus {
    status: 'success' | 'pending' | 'failed' | 'cancelled';
    transactionId: string;
    amount: number;
    timestamp: string;
}

/**
 * Generate a simple checksum for payment verification
 * Note: This is a basic implementation. In production, Zoho will provide
 * their specific checksum/hash generation algorithm.
 */
export const generatePaymentChecksum = (data: Record<string, any>): string => {
    // Basic checksum generation - replace with Zoho's actual algorithm when available
    const sortedKeys = Object.keys(data).sort();
    const concatenated = sortedKeys
        .map(key => `${key}=${data[key]}`)
        .join('&');

    // Simple hash (in production, use Zoho's provided algorithm with SALT_KEY)
    return btoa(`${concatenated}|${ZOHO_SALT_KEY}`);
};

/**
 * Initiate Zoho payment gateway session
 */
export const initiateZohoPayment = async (
    paymentRequest: ZohoPaymentRequest
): Promise<ZohoPaymentResponse> => {
    try {
        // Check if Zoho is configured
        if (!isZohoConfigured()) {
            return {
                success: false,
                error: "Zoho Payment Gateway is not configured. Please add your API keys."
            };
        }

        // Prepare payment data
        const paymentData = {
            organization_id: ZOHO_ORGANIZATION_ID,
            gateway_key: ZOHO_GATEWAY_KEY,
            amount: paymentRequest.amount,
            currency: PAYMENT_CONFIG.currency,
            country: PAYMENT_CONFIG.country,
            language: PAYMENT_CONFIG.language,
            order_id: paymentRequest.orderId,
            customer_name: paymentRequest.customerName,
            customer_email: paymentRequest.customerEmail,
            customer_phone: paymentRequest.customerPhone || '',
            description: paymentRequest.description || `Registration for ${paymentRequest.registrationType}`,
            return_url: ZOHO_RETURN_URLS.success,
            cancel_url: ZOHO_RETURN_URLS.cancel,
            callback_url: ZOHO_RETURN_URLS.callback,
            timestamp: new Date().toISOString()
        };

        // Generate checksum
        const checksum = generatePaymentChecksum(paymentData);

        // In a real implementation, you would make an API call to Zoho here
        // For now, we'll prepare the data structure

        // NOTE: Zoho's actual implementation may require server-side processing
        // This is a client-side example. You may need to create a backend endpoint.

        const response = await fetch(ZOHO_PAYMENT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...paymentData,
                checksum
            })
        });

        if (!response.ok) {
            throw new Error(`Payment gateway error: ${response.statusText}`);
        }

        const result = await response.json();

        // Return the payment URL where user should be redirected
        return {
            success: true,
            paymentUrl: result.payment_url || result.redirect_url,
            transactionId: result.transaction_id || paymentRequest.orderId
        };

    } catch (error: any) {
        console.error('Zoho payment initiation error:', error);
        return {
            success: false,
            error: error.message || 'Failed to initiate payment'
        };
    }
};

/**
 * Verify payment callback from Zoho
 */
export const verifyPaymentCallback = (callbackData: Record<string, any>): PaymentStatus => {
    try {
        // Extract checksum from callback
        const receivedChecksum = callbackData.checksum;
        delete callbackData.checksum;

        // Regenerate checksum to verify
        const calculatedChecksum = generatePaymentChecksum(callbackData);

        if (receivedChecksum !== calculatedChecksum) {
            return {
                status: 'failed',
                transactionId: callbackData.transaction_id || 'unknown',
                amount: parseFloat(callbackData.amount) || 0,
                timestamp: new Date().toISOString()
            };
        }

        // Check payment status from callback
        const status = callbackData.status?.toLowerCase();

        return {
            status: status === 'success' ? 'success' :
                status === 'pending' ? 'pending' :
                    status === 'cancelled' ? 'cancelled' : 'failed',
            transactionId: callbackData.transaction_id || callbackData.order_id,
            amount: parseFloat(callbackData.amount) || 0,
            timestamp: callbackData.timestamp || new Date().toISOString()
        };

    } catch (error) {
        console.error('Payment callback verification error:', error);
        return {
            status: 'failed',
            transactionId: 'unknown',
            amount: 0,
            timestamp: new Date().toISOString()
        };
    }
};

/**
 * Get payment status by transaction ID
 * Note: This would typically make an API call to Zoho's status endpoint
 */
export const getPaymentStatus = async (transactionId: string): Promise<PaymentStatus> => {
    try {
        if (!isZohoConfigured()) {
            throw new Error("Zoho Payment Gateway is not configured");
        }

        // In production, make an API call to Zoho's status endpoint
        // const response = await fetch(`${ZOHO_API_URL}/status/${transactionId}`, {...});

        // Placeholder return
        return {
            status: 'pending',
            transactionId,
            amount: 0,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Get payment status error:', error);
        throw error;
    }
};

/**
 * Generate a unique order ID for the payment
 */
export const generateOrderId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `CODEKAR-${timestamp}-${random}`;
};
