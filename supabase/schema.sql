-- Supabase Database Schema for Courses Section
-- Run this in your Supabase SQL Editor after creating a project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    stripe_product_id TEXT,
    stripe_price_id TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published BOOLEAN DEFAULT FALSE
);

-- Index for faster slug lookups
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_published ON courses(published);

-- ============================================
-- COURSE CONTENT TABLE (Videos, PDFs)
-- ============================================
CREATE TABLE course_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('video', 'pdf')),
    content_url TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster course content lookups
CREATE INDEX idx_course_content_course_id ON course_content(course_id);
CREATE INDEX idx_course_content_order ON course_content(course_id, order_index);

-- ============================================
-- PURCHASES TABLE
-- ============================================
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,  -- Clerk user ID
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    amount_cents INTEGER NOT NULL,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Index for faster purchase lookups
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_course_id ON purchases(course_id);

-- ============================================
-- PROGRESS TABLE
-- ============================================
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,  -- Clerk user ID
    content_id UUID NOT NULL REFERENCES course_content(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    last_position_seconds INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- Index for faster progress lookups
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_content_id ON progress(content_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Courses: Anyone can read published courses
CREATE POLICY "Anyone can view published courses"
    ON courses FOR SELECT
    USING (published = TRUE);

-- Course Content: Preview content is public, full content requires purchase
CREATE POLICY "Anyone can view preview content"
    ON course_content FOR SELECT
    USING (is_preview = TRUE);

CREATE POLICY "Purchasers can view all course content"
    ON course_content FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM purchases
            WHERE purchases.course_id = course_content.course_id
            AND purchases.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- Purchases: Users can only see their own purchases
CREATE POLICY "Users can view own purchases"
    ON purchases FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Progress: Users can view and update their own progress
CREATE POLICY "Users can view own progress"
    ON progress FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own progress"
    ON progress FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own progress"
    ON progress FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user has purchased a course
CREATE OR REPLACE FUNCTION has_purchased_course(p_user_id TEXT, p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM purchases
        WHERE user_id = p_user_id AND course_id = p_course_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get course progress percentage
CREATE OR REPLACE FUNCTION get_course_progress(p_user_id TEXT, p_course_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_content INTEGER;
    completed_content INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_content
    FROM course_content WHERE course_id = p_course_id;
    
    IF total_content = 0 THEN
        RETURN 0;
    END IF;
    
    SELECT COUNT(*) INTO completed_content
    FROM progress p
    JOIN course_content cc ON p.content_id = cc.id
    WHERE cc.course_id = p_course_id
    AND p.user_id = p_user_id
    AND p.completed = TRUE;
    
    RETURN (completed_content * 100) / total_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to insert sample course data

/*
INSERT INTO courses (title, slug, description, price_cents, published) VALUES
(
    'Structural Engineering Fundamentals',
    'structural-engineering-fundamentals',
    'Learn the core concepts of structural engineering through practical examples and real-world applications.',
    4999,
    TRUE
);

INSERT INTO course_content (course_id, title, type, content_url, order_index, duration_seconds, is_preview) 
SELECT 
    id,
    'Course Introduction',
    'video',
    'https://example.com/video1.mp4',
    1,
    300,
    TRUE
FROM courses WHERE slug = 'structural-engineering-fundamentals';
*/
