// Supabase Edge Function: Create Stripe Checkout Session
// Deploy with: supabase functions deploy create-checkout

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { courseId, userId, userEmail, successUrl, cancelUrl } = await req.json();

        // Validate required fields
        if (!courseId || !userId || !successUrl || !cancelUrl) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Create Supabase client with service role key
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch course details
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .eq('published', true)
            .single();

        if (courseError || !course) {
            return new Response(
                JSON.stringify({ error: 'Course not found' }),
                { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Check if user already purchased this course
        const { data: existingPurchase } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (existingPurchase) {
            return new Response(
                JSON.stringify({ error: 'Course already purchased' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Create or get Stripe price
        let stripePriceId = course.stripe_price_id;

        if (!stripePriceId) {
            // Create Stripe product and price if not exists
            const product = await stripe.products.create({
                name: course.title,
                description: course.description || undefined,
                metadata: {
                    course_id: course.id,
                    course_slug: course.slug,
                },
            });

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: course.price_cents,
                currency: 'usd',
            });

            stripePriceId = price.id;

            // Update course with Stripe IDs
            await supabase
                .from('courses')
                .update({
                    stripe_product_id: product.id,
                    stripe_price_id: price.id,
                })
                .eq('id', courseId);
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: stripePriceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: userEmail || undefined,
            metadata: {
                course_id: courseId,
                user_id: userId,
            },
            allow_promotion_codes: true,
        });

        return new Response(
            JSON.stringify({ 
                sessionId: session.id, 
                url: session.url 
            }),
            { 
                status: 200, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
        );

    } catch (error) {
        console.error('Checkout error:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
