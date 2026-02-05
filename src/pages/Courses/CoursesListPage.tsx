import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { Loader2, GraduationCap, Play, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import type { Course } from '../../services/supabase';
import { getAllCourses, getUserPurchases, calculateCourseProgressPercentage } from '../../services/courses';

interface CourseWithStatus extends Course {
    isPurchased: boolean;
    progressPercentage: number;
}

const formatPrice = (cents: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
};

export const CoursesListPage = () => {
    const { user, isSignedIn } = useUser();
    const [courses, setCourses] = useState<CourseWithStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                const allCourses = await getAllCourses();

                if (isSignedIn && user) {
                    const purchases = await getUserPurchases(user.id);
                    const purchasedCourseIds = new Set(purchases.map(p => p.course_id));

                    const coursesWithStatus = await Promise.all(
                        allCourses.map(async (course) => {
                            const isPurchased = purchasedCourseIds.has(course.id);
                            let progressPercentage = 0;
                            if (isPurchased) {
                                progressPercentage = await calculateCourseProgressPercentage(user.id, course.id);
                            }
                            return { ...course, isPurchased, progressPercentage };
                        })
                    );
                    setCourses(coursesWithStatus);
                } else {
                    setCourses(allCourses.map(course => ({
                        ...course,
                        isPurchased: false,
                        progressPercentage: 0,
                    })));
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [user, isSignedIn]);

    const purchasedCourses = courses.filter(c => c.isPurchased);
    const availableCourses = courses.filter(c => !c.isPurchased);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <section className="pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 bg-linear-to-b from-amber-50/50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                            Courses
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        Deepen your engineering knowledge with video courses. Each course includes
                        practical examples, downloadable materials, and progress tracking.
                    </p>
                </div>
            </section>

            {/* My Courses Section */}
            {purchasedCourses.length > 0 && (
                <section className="py-8 sm:py-12 px-4 sm:px-6 bg-amber-50/50 dark:bg-gray-800/30">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                            My Courses
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {purchasedCourses.map(course => (
                                <Link
                                    key={course.id}
                                    to={`/courses/${course.slug}/learn`}
                                    className="group block"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                            {course.thumbnail_url ? (
                                                <img
                                                    src={course.thumbnail_url}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
                                                    <Play className="w-12 h-12 text-amber-500/50" />
                                                </div>
                                            )}

                                            {/* Progress bar */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200 dark:bg-gray-600">
                                                <div
                                                    className="h-full bg-amber-500 transition-all duration-300"
                                                    style={{ width: `${course.progressPercentage}%` }}
                                                />
                                            </div>

                                            {/* Status badge */}
                                            {course.progressPercentage === 100 ? (
                                                <div className="absolute top-3 right-3 px-2.5 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Completed
                                                </div>
                                            ) : course.progressPercentage > 0 ? (
                                                <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {course.progressPercentage}%
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                                                <Play className="w-4 h-4 mr-1" />
                                                {course.progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Available Courses Section */}
            <section className="py-8 sm:py-12 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        {purchasedCourses.length > 0 ? 'More Courses' : 'Available Courses'}
                    </h2>

                    {availableCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableCourses.map(course => (
                                <Link
                                    key={course.id}
                                    to={`/courses/${course.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                            {course.thumbnail_url ? (
                                                <img
                                                    src={course.thumbnail_url}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
                                                    <Play className="w-12 h-12 text-amber-500/50" />
                                                </div>
                                            )}

                                            {/* Price badge */}
                                            <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/80 dark:bg-gray-100/90 text-white dark:text-gray-900 text-sm font-medium rounded-full">
                                                {formatPrice(course.price_cents)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                {course.title}
                                            </h3>
                                            {course.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                    {course.description}
                                                </p>
                                            )}

                                            <div className="flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                                                View Course
                                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 sm:p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Courses Coming Soon
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                We're working on comprehensive video courses to complement our interactive books.
                                Check back soon for updates!
                            </p>
                        </div>
                    ) : (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                You have access to all courses!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Great job! You've purchased all available courses.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CoursesListPage;
