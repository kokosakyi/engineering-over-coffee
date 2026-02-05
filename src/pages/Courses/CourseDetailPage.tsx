import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import { Loader2, Play, FileText, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import type { Course, CourseContent } from '../../services/supabase';
import { getCourseBySlug, getCourseContent, hasUserPurchasedCourse } from '../../services/courses';
import { formatPrice } from '../../services/stripe';
import { PurchaseButton } from '../../components/PurchaseButton';

export const CourseDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { user, isSignedIn } = useUser();
    const [course, setCourse] = useState<Course | null>(null);
    const [content, setContent] = useState<CourseContent[]>([]);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!slug) return;

            try {
                setIsLoading(true);
                const courseData = await getCourseBySlug(slug);

                if (!courseData) {
                    setError('Course not found');
                    return;
                }

                setCourse(courseData);

                const contentData = await getCourseContent(courseData.id);
                setContent(contentData);

                // Check if user has purchased
                if (isSignedIn && user) {
                    const purchased = await hasUserPurchasedCourse(user.id, courseData.id);
                    setIsPurchased(purchased);
                }
            } catch (err) {
                console.error('Error fetching course:', err);
                setError('Failed to load course');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [slug, user, isSignedIn]);

    // If user has purchased, redirect to player
    if (isPurchased && course) {
        return <Navigate to={`/courses/${course.slug}/learn`} replace />;
    }

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalDuration = content.reduce((sum, c) => sum + c.duration_seconds, 0);
    const videoCount = content.filter(c => c.type === 'video').length;
    const pdfCount = content.filter(c => c.type === 'pdf').length;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center py-20">
                    <p className="text-red-600 dark:text-red-400">{error || 'Course not found'}</p>
                    <Link
                        to="/courses"
                        className="mt-4 inline-block px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Back link */}
            <Link
                to="/courses"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                All Courses
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2">
                    {/* Course header */}
                    <div className="mb-8">
                        {course.thumbnail_url && (
                            <img
                                src={course.thumbnail_url}
                                alt={course.title}
                                className="w-full aspect-video object-cover rounded-lg mb-6"
                            />
                        )}
                        <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-4">
                            {course.title}
                        </h1>
                        {course.description && (
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {course.description}
                            </p>
                        )}
                    </div>

                    {/* Course stats */}
                    <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600 dark:text-gray-400">
                        {videoCount > 0 && (
                            <div className="flex items-center gap-1">
                                <Play className="w-4 h-4" />
                                {videoCount} video{videoCount !== 1 ? 's' : ''}
                            </div>
                        )}
                        {pdfCount > 0 && (
                            <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {pdfCount} resource{pdfCount !== 1 ? 's' : ''}
                            </div>
                        )}
                        {totalDuration > 0 && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {Math.round(totalDuration / 60)} min total
                            </div>
                        )}
                    </div>

                    {/* Course content preview */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="font-medium text-gray-900 dark:text-gray-100">
                                Course Content
                            </h2>
                        </div>
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {content.map((item, index) => {
                                const Icon = item.type === 'video' ? Play : FileText;
                                return (
                                    <li
                                        key={item.id}
                                        className="flex items-center gap-3 p-4"
                                    >
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center
                                            ${item.is_preview
                                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                            }
                                        `}>
                                            {index + 1}
                                        </div>
                                        <div className="grow min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {item.duration_seconds > 0 && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDuration(item.duration_seconds)}
                                                    </span>
                                                )}
                                                {item.is_preview && (
                                                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                                                        Free Preview
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Sidebar - Purchase card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="text-center mb-6">
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {formatPrice(course.price_cents)}
                            </div>
                        </div>

                        <PurchaseButton
                            courseId={course.id}
                            courseSlug={course.slug}
                            priceCents={course.price_cents}
                        />

                        {/* What's included */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                                This course includes:
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                {videoCount > 0 && (
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {videoCount} video lesson{videoCount !== 1 ? 's' : ''}
                                    </li>
                                )}
                                {pdfCount > 0 && (
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {pdfCount} downloadable resource{pdfCount !== 1 ? 's' : ''}
                                    </li>
                                )}
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Lifetime access
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Progress tracking
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
