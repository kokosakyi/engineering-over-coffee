import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Types for database tables
export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price_cents: number;
    stripe_product_id: string | null;
    stripe_price_id: string | null;
    thumbnail_url: string | null;
    created_at: string;
    updated_at: string;
    published: boolean;
}

export interface CourseContent {
    id: string;
    course_id: string;
    title: string;
    description: string | null;
    type: 'video' | 'pdf';
    content_url: string;
    order_index: number;
    duration_seconds: number;
    is_preview: boolean;
    created_at: string;
    updated_at: string;
}

export interface Purchase {
    id: string;
    user_id: string;
    course_id: string;
    stripe_payment_intent_id: string | null;
    stripe_checkout_session_id: string | null;
    amount_cents: number;
    purchased_at: string;
}

export interface Progress {
    id: string;
    user_id: string;
    content_id: string;
    completed: boolean;
    last_position_seconds: number;
    updated_at: string;
}

// Helper to set the user's JWT for RLS policies
export const setSupabaseAuth = async (token: string | null) => {
    if (token) {
        await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
        });
    }
};
