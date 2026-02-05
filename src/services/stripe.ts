import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
    if (!stripePromise && stripePublishableKey) {
        stripePromise = loadStripe(stripePublishableKey);
    }
    return stripePromise;
};

export interface CheckoutSessionResponse {
    sessionId: string;
    url: string;
}

// Create a checkout session via Supabase Edge Function
export const createCheckoutSession = async (
    courseId: string,
    userId: string,
    userEmail: string,
    successUrl: string,
    cancelUrl: string
): Promise<CheckoutSessionResponse> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            courseId,
            userId,
            userEmail,
            successUrl,
            cancelUrl,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionUrl: string) => {
    // Redirect directly to the Stripe checkout URL
    window.location.href = sessionUrl;
};

// Format price from cents to display string
export const formatPrice = (cents: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(cents / 100);
};
