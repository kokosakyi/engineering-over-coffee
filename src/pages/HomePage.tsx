import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { BookOpen, GraduationCap, ArrowRight, Play, Coffee } from "lucide-react";
import timberBookCover from "../assets/images/books/light_frame_wood_construction.jpg";
import transmissionLineBookCover from "../assets/images/books/transmisson_line_design.jpg";
import { getAllCourses, getUserPurchases, calculateCourseProgressPercentage } from "../services/courses";
import type { Course } from "../services/supabase";

interface Book {
    id: number;
    title: string;
    shortTitle: string;
    coverImage: string;
    link: string;
    available: boolean;
}

const featuredBooks: Book[] = [
    {
        id: 1,
        title: "Brewed Blueprints - Light Frame Wood Construction",
        shortTitle: "Light Frame Wood",
        coverImage: timberBookCover,
        link: "/timber-book",
        available: true,
    },
    {
        id: 2,
        title: "Distribution and Transmission Line Design",
        shortTitle: "Transmission Lines",
        coverImage: transmissionLineBookCover,
        link: "/transmission-line-book",
        available: true,
    },
];

interface CourseWithProgress extends Course {
    isPurchased: boolean;
    progressPercentage: number;
}

export const HomePage = () => {
    const { user, isSignedIn } = useUser();
    const [courses, setCourses] = useState<CourseWithProgress[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCourses = await getAllCourses();

                if (isSignedIn && user) {
                    const purchases = await getUserPurchases(user.id);
                    const purchasedCourseIds = new Set(purchases.map(p => p.course_id));

                    const coursesWithStatus = await Promise.all(
                        allCourses.slice(0, 3).map(async (course) => {
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
                    setCourses(allCourses.slice(0, 3).map(c => ({ ...c, isPurchased: false, progressPercentage: 0 })));
                }
            } catch {
                // Courses not available yet - that's okay
                setCourses([]);
            } finally {
                setIsLoadingCourses(false);
            }
        };
        fetchCourses();
    }, [user, isSignedIn]);

    const formatPrice = (cents: number): string => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-orange-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

                {/* Decorative elements */}
                <div className="absolute top-20 right-10 w-64 h-64 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20">
                    <div className="text-center">
                        {/* Logo/Icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 mb-6 sm:mb-8">
                            <Coffee className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
                            Engineering
                            <span className="block text-amber-600 dark:text-amber-400">Over Coffee</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
                            Learn structural engineering through casual conversations.
                            Interactive books and video courses that make complex concepts approachable.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                            <Link
                                to="/books"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
                            >
                                <BookOpen className="w-5 h-5" />
                                Browse Books
                            </Link>
                            <Link
                                to="/courses"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/25"
                            >
                                <GraduationCap className="w-5 h-5" />
                                View Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Books Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Interactive Books
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Learn through dialogue-style conversations between engineers
                            </p>
                        </div>
                        <Link
                            to="/books"
                            className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                        >
                            View all books
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {/* Books Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {featuredBooks.map((book) => (
                            <Link
                                key={book.id}
                                to={book.link}
                                className="group block"
                            >
                                <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                    {/* Book cover */}
                                    <div className="relative aspect-4/5 overflow-hidden">
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                                        {/* Badge */}
                                        {book.available && (
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                                                Available Now
                                            </div>
                                        )}

                                        {/* Title overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                                            <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                                                {book.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Action bar */}
                                    <div className="p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Interactive Book
                                        </span>
                                        <span className="inline-flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                                            Start Reading
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Coming Soon Card */}
                        <div className="relative bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <div className="aspect-4/5 flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                                    <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    More Coming Soon
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    Concrete, Steel, Seismic Engineering, and more
                                </p>
                            </div>
                            <div className="p-4 bg-gray-100/50 dark:bg-gray-800/30">
                                <span className="text-sm text-gray-500 dark:text-gray-500">
                                    Stay tuned for updates
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-linear-to-b from-amber-50/50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-12">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Video Courses
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Deep-dive into engineering topics with video lessons
                            </p>
                        </div>
                        <Link
                            to="/courses"
                            className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                        >
                            View all courses
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    {/* Courses Grid or Placeholder */}
                    {isLoadingCourses ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
                                    <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
                                    <div className="p-5">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4" />
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {courses.map((course) => (
                                <Link
                                    key={course.id}
                                    to={course.isPurchased ? `/courses/${course.slug}/learn` : `/courses/${course.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
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
                                            {!course.isPurchased && (
                                                <div className="absolute top-4 right-4 px-3 py-1 bg-gray-900/80 dark:bg-gray-100/90 text-white dark:text-gray-900 text-sm font-medium rounded-full">
                                                    {formatPrice(course.price_cents)}
                                                </div>
                                            )}

                                            {/* Progress bar for purchased courses */}
                                            {course.isPurchased && course.progressPercentage > 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600">
                                                    <div
                                                        className="h-full bg-amber-500 transition-all duration-300"
                                                        style={{ width: `${course.progressPercentage}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                {course.title}
                                            </h3>
                                            {course.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {course.description}
                                                </p>
                                            )}

                                            {/* Action */}
                                            <div className="mt-4 flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                                                {course.isPurchased ? (
                                                    <>
                                                        <Play className="w-4 h-4 mr-1" />
                                                        {course.progressPercentage > 0 ? 'Continue' : 'Start'} Learning
                                                    </>
                                                ) : (
                                                    <>
                                                        View Course
                                                        <ArrowRight className="w-4 h-4 ml-1" />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        /* Placeholder when no courses exist yet */
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Video Courses Coming Soon
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                We're working on comprehensive video courses to complement our interactive books.
                                Check back soon for updates!
                            </p>
                            <Link
                                to="/courses"
                                className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300"
                            >
                                Go to Courses
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Why Learn With Us?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border border-amber-100 dark:border-gray-700">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center mb-4">
                                <Coffee className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Conversational Style
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Learn through casual dialogues between junior and senior engineers,
                                just like a coffee shop conversation.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border border-blue-100 dark:border-gray-700">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Real Code References
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Every concept is tied to actual building codes like NBC 2020 and CSA O86,
                                with practical examples.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border border-green-100 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center mb-4">
                                <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Interactive Learning
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Test your knowledge with quizzes, explore interactive diagrams,
                                and track your progress as you learn.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 bg-linear-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Ready to Start Learning?
                    </h2>
                    <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
                        Dive into our engineering resources and level up your knowledge today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/books"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-amber-600 font-medium rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
                        >
                            <BookOpen className="w-5 h-5" />
                            Start with Books
                        </Link>
                        <Link
                            to="/courses"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-700/50 text-white font-medium rounded-xl hover:bg-amber-700/70 transition-colors border border-amber-400/30"
                        >
                            <GraduationCap className="w-5 h-5" />
                            Explore Courses
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
