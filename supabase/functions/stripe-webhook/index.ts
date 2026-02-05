// Supabase Edge Function: Stripe Webhook Handler
// Deploy with: supabase functions deploy stripe-webhook
// Set webhook secret: supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') as string;

serve(async (req) => {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return new Response('Missing stripe-signature header', { status: 400 });
    }

    try {
        const body = await req.text();
        
        // Verify webhook signature
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );

        // Create Supabase client with service role key
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                
                const courseId = session.metadata?.course_id;
                const userId = session.metadata?.user_id;

                if (!courseId || !userId) {
                    console.error('Missing metadata in checkout session');
                    return new Response('Missing metadata', { status: 400 });
                }

                // Check if purchase already exists (idempotency)
                const { data: existingPurchase } = await supabase
                    .from('purchases')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('course_id', courseId)
                    .single();

                if (existingPurchase) {
                    console.log('Purchase already exists, skipping');
                    return new Response(JSON.stringify({ received: true }), {
                        headers: { 'Content-Type': 'application/json' },
                    });
                }

                // Record the purchase
                const { error: insertError } = await supabase
                    .from('purchases')
                    .insert({
                        user_id: userId,
                        course_id: courseId,
                        stripe_checkout_session_id: session.id,
                        stripe_payment_intent_id: session.payment_intent as string,
                        amount_cents: session.amount_total || 0,
                    });

                if (insertError) {
                    console.error('Error inserting purchase:', insertError);
                    return new Response('Database error', { status: 500 });
                }

                console.log(`Purchase recorded: user ${userId}, course ${courseId}`);
                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
                // Additional handling if needed
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log(`PaymentIntent failed: ${paymentIntent.id}`);
                // Could notify the user or log for analytics
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error('Webhook error:', err);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
});
