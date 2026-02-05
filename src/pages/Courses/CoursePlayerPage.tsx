import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import { Loader2, ArrowLeft, Download, Menu, X } from 'lucide-react';
import type { Course } from '../../services/supabase';
import {
    getCourseBySlug,
    hasUserPurchasedCourse,
    getCourseContentWithProgress,
    updateProgress,
    markContentComplete,
} from '../../services/courses';
import type { ContentWithProgress } from '../../services/courses';
import { VideoPlayer } from '../../components/VideoPlayer';
import { LessonList } from '../../components/LessonList';

export const CoursePlayerPage = () => {
    const { slug, lessonId } = useParams<{ slug: string; lessonId?: string }>();
    const { user, isSignedIn } = useUser();

    const [course, setCourse] = useState<Course | null>(null);
    const [content, setContent] = useState<ContentWithProgress[]>([]);
    const [currentLesson, setCurrentLesson] = useState<ContentWithProgress | null>(null);
    const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [initialTime, setInitialTime] = useState(0);

    useEffect(() => {
        const fetchCourseAndContent = async () => {
            if (!slug || !isSignedIn || !user) return;

            try {
                setIsLoading(true);

                const courseData = await getCourseBySlug(slug);
                if (!courseData) {
                    setError('Course not found');
                    return;
                }
                setCourse(courseData);

                // Check purchase status
                const purchased = await hasUserPurchasedCourse(user.id, courseData.id);
                setIsPurchased(purchased);

                if (!purchased) return;

                // Get content with progress
                const contentWithProgress = await getCourseContentWithProgress(user.id, courseData.id);
                setContent(contentWithProgress);

                // Set current lesson
                let lesson: ContentWithProgress | undefined;
                if (lessonId) {
                    lesson = contentWithProgress.find(c => c.id === lessonId);
                }
                if (!lesson && contentWithProgress.length > 0) {
                    // Find first incomplete lesson, or first lesson
                    lesson = contentWithProgress.find(c => !c.progress?.completed) || contentWithProgress[0];
                }

                if (lesson) {
                    setCurrentLesson(lesson);
                    // Set initial playback position
                    if (lesson.progress?.last_position_seconds) {
                        setInitialTime(lesson.progress.last_position_seconds);
                    }
                }
            } catch (err) {
                console.error('Error loading course:', err);
                setError('Failed to load course');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseAndContent();
    }, [slug, lessonId, user, isSignedIn]);

    // Handle progress updates
    const handleProgress = useCallback(async (currentTime: number, _duration: number) => {
        if (!user || !currentLesson) return;

        try {
            await updateProgress(user.id, currentLesson.id, Math.floor(currentTime), false);
        } catch (err) {
            console.error('Error saving progress:', err);
        }
    }, [user, currentLesson]);

    // Handle video completion
    const handleComplete = useCallback(async () => {
        if (!user || !currentLesson) return;

        try {
            await markContentComplete(user.id, currentLesson.id);
            // Update local state
            setContent(prev => prev.map(c =>
                c.id === currentLesson.id
                    ? { ...c, progress: { ...c.progress, completed: true } as ContentWithProgress['progress'] }
                    : c
            ));
        } catch (err) {
            console.error('Error marking complete:', err);
        }
    }, [user, currentLesson]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    // Not signed in
    if (!isSignedIn) {
        return <Navigate to={`/courses/${slug}`} replace />;
    }

    // Not purchased
    if (isPurchased === false) {
        return <Navigate to={`/courses/${slug}`} replace />;
    }

    // Error or no course
    if (error || !course) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12 text-center">
                <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Course not found'}</p>
                <Link
                    to="/courses"
                    className="inline-block px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                    Back to Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top bar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/courses"
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">All Courses</span>
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {course.title}
                        </h1>
                    </div>

                    {/* Mobile sidebar toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 text-gray-600 dark:text-gray-400"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
                {/* Main content area */}
                <div className="grow lg:pr-6 p-4 lg:p-6">
                    {currentLesson ? (
                        <>
                            {/* Video or PDF viewer */}
                            {currentLesson.type === 'video' ? (
                                <VideoPlayer
                                    src={currentLesson.content_url}
                                    title={currentLesson.title}
                                    initialTime={initialTime}
                                    onProgress={handleProgress}
                                    onComplete={handleComplete}
                                />
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        {currentLesson.title}
                                    </h2>
                                    {currentLesson.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {currentLesson.description}
                                        </p>
                                    )}
                                    <a
                                        href={currentLesson.content_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                                        onClick={() => handleComplete()}
                                    >
                                        <Download className="w-4 h-4" />
                                        Download PDF
                                    </a>
                                </div>
                            )}

                            {/* Lesson info */}
                            <div className="mt-6">
                                <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {currentLesson.title}
                                </h2>
                                {currentLesson.description && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {currentLesson.description}
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                Select a lesson to get started
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar - Lesson list */}
                <div className={`
                    lg:w-80 lg:shrink-0 lg:block
                    ${sidebarOpen ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:block'}
                `}>
                    {/* Mobile overlay */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    <div className={`
                        ${sidebarOpen
                            ? 'fixed right-0 top-0 bottom-0 w-80 bg-gray-50 dark:bg-gray-900 overflow-y-auto lg:relative lg:bg-transparent'
                            : ''
                        }
                        lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto p-4 lg:p-6 lg:pl-0
                    `}>
                        {sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden absolute top-4 right-4 p-2 text-gray-600 dark:text-gray-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                        <LessonList
                            courseSlug={slug!}
                            content={content}
                            isPurchased={true}
                            currentLessonId={currentLesson?.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayerPage;
