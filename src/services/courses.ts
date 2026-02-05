import { supabase } from './supabase';
import type { Course, CourseContent, Purchase, Progress } from './supabase';

// ============================================
// COURSE QUERIES
// ============================================

export const getAllCourses = async (): Promise<Course[]> => {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const getCourseBySlug = async (slug: string): Promise<Course | null> => {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const getCourseContent = async (courseId: string): Promise<CourseContent[]> => {
    const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
};

export const getContentById = async (contentId: string): Promise<CourseContent | null> => {
    const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('id', contentId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

// ============================================
// PURCHASE QUERIES
// ============================================

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
    const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data || [];
};

export const hasUserPurchasedCourse = async (userId: string, courseId: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
};

export const getUserPurchasedCourses = async (userId: string): Promise<Course[]> => {
    const { data, error } = await supabase
        .from('purchases')
        .select(`
            course_id,
            courses (*)
        `)
        .eq('user_id', userId);

    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data?.map((p: any) => p.courses as Course).filter(Boolean) || [];
};

// ============================================
// PROGRESS QUERIES
// ============================================

export const getContentProgress = async (userId: string, contentId: string): Promise<Progress | null> => {
    const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
};

export const getCourseProgress = async (userId: string, courseId: string): Promise<Progress[]> => {
    const { data, error } = await supabase
        .from('progress')
        .select(`
            *,
            course_content!inner (course_id)
        `)
        .eq('user_id', userId)
        .eq('course_content.course_id', courseId);

    if (error) throw error;
    return data || [];
};

export const updateProgress = async (
    userId: string,
    contentId: string,
    lastPositionSeconds: number,
    completed: boolean = false
): Promise<Progress> => {
    const { data, error } = await supabase
        .from('progress')
        .upsert({
            user_id: userId,
            content_id: contentId,
            last_position_seconds: lastPositionSeconds,
            completed,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id,content_id'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const markContentComplete = async (userId: string, contentId: string): Promise<Progress> => {
    const { data, error } = await supabase
        .from('progress')
        .upsert({
            user_id: userId,
            content_id: contentId,
            completed: true,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id,content_id'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// ============================================
// COURSE PROGRESS CALCULATIONS
// ============================================

export const calculateCourseProgressPercentage = async (
    userId: string,
    courseId: string
): Promise<number> => {
    const content = await getCourseContent(courseId);
    if (content.length === 0) return 0;

    const progress = await getCourseProgress(userId, courseId);
    const completedCount = progress.filter(p => p.completed).length;

    return Math.round((completedCount / content.length) * 100);
};

// ============================================
// CONTENT WITH PROGRESS
// ============================================

export interface ContentWithProgress extends CourseContent {
    progress?: Progress;
}

export const getCourseContentWithProgress = async (
    userId: string,
    courseId: string
): Promise<ContentWithProgress[]> => {
    const content = await getCourseContent(courseId);
    const progressList = await getCourseProgress(userId, courseId);

    const progressMap = new Map(progressList.map(p => [p.content_id, p]));

    return content.map(c => ({
        ...c,
        progress: progressMap.get(c.id),
    }));
};
