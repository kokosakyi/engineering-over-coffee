# Courses Section Setup Guide

This guide walks you through setting up the paid courses section with video hosting, Stripe payments, and progress tracking.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Stripe account (test mode for development)
- A video hosting account (Bunny Stream recommended)

## 1. Supabase Setup

### Create a Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from Settings > API

### Run the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create all tables and RLS policies

### Configure Clerk Integration (Optional but Recommended)

For seamless auth, you can sync Clerk users with Supabase:

1. In Supabase, go to Authentication > Providers
2. The app uses Clerk for auth, so Supabase RLS policies use the Clerk user ID directly

## 2. Stripe Setup

### Create Products

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Enable Test Mode for development
3. Go to Products and create a product for each course
4. Note the Product ID and Price ID (or let the app create them automatically)

### Set Up Webhook

1. Go to Developers > Webhooks
2. Add endpoint: `https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/stripe-webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook signing secret

## 3. Video Hosting Setup (Bunny Stream)

### Why Bunny Stream?

- ~$1/month per 1000 views + $0.005/GB storage
- HLS adaptive streaming
- Basic DRM/signed URLs
- Built-in video player

### Setup Steps

1. Go to [bunny.net](https://bunny.net) and create an account
2. Create a new Stream Library
3. Upload your course videos
4. Copy the Library ID and API Key
5. For each video, get the embed URL from the video details

### Video URL Format

Bunny Stream embed URLs look like:

```
https://iframe.mediadelivery.net/embed/{library_id}/{video_id}
```

Store this URL in the `content_url` field of your `course_content` table.

## 4. Deploy Supabase Edge Functions

### Install Supabase CLI

```bash
npm install -g supabase
```

### Login and Link Project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### Set Secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Deploy Functions

```bash
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

## 5. Environment Variables

Add these to your `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (client-side only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Note: Server-side secrets are set via Supabase CLI, not in .env
```

## 6. Add Course Data

### Via Supabase Dashboard

1. Go to Table Editor > courses
2. Insert a new course:

   ```json
   {
     "title": "Your Course Title",
     "slug": "your-course-slug",
     "description": "Course description...",
     "price_cents": 4999,
     "published": true
   }
   ```

3. Go to Table Editor > course_content
4. Add lessons:
   ```json
   {
     "course_id": "uuid-from-step-2",
     "title": "Lesson 1: Introduction",
     "type": "video",
     "content_url": "https://iframe.mediadelivery.net/embed/xxx/yyy",
     "order_index": 1,
     "duration_seconds": 300,
     "is_preview": true
   }
   ```

## Testing the Flow

1. Start the dev server: `npm run dev`
2. Navigate to `/courses`
3. Click on a course to see its detail page
4. Click "Buy" to test the Stripe checkout (use test card 4242 4242 4242 4242)
5. After purchase, you should be redirected to the success page
6. Navigate to `/courses/your-slug/learn` to watch videos

## Alternative Video Hosting Options

### Cloudflare Stream

- $5/month + $1 per 1000 minutes watched
- Great CDN performance
- Signed URLs for protection

### Mux

- $0.007/min encoded + $0.004/min streamed
- Developer-friendly API
- Excellent video quality

### YouTube Unlisted

- Free
- No DRM (links can be shared)
- Good for non-premium content

## Troubleshooting

### Webhook Not Receiving Events

- Check the webhook endpoint URL is correct
- Verify the webhook secret matches
- Check Supabase function logs for errors

### Video Not Playing

- Ensure the content_url is the embed URL, not the direct video URL
- Check browser console for CORS errors
- Verify the video is published in your hosting provider

### Purchase Not Recording

- Check Supabase function logs
- Verify the webhook is receiving `checkout.session.completed` events
- Check RLS policies allow inserts from the service role
