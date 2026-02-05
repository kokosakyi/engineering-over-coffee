import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { getCourseBySlug } from '../../services/courses';
import type { Course } from '../../services/supabase';

export const PurchaseSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const courseSlug = searchParams.get('course');
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseSlug) {
                setIsLoading(false);
                return;
            }

            try {
                const courseData = await getCourseBySlug(courseSlug);
                setCourse(courseData);
            } catch (err) {
                console.error('Error fetching course:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [courseSlug]);

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-20">
            <div className="text-center">
                {/* Success icon */}
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Purchase Successful!
                </h1>

                {/* Message */}
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {course
                        ? `Thank you for purchasing "${course.title}". You now have lifetime access to all course content.`
                        : 'Thank you for your purchase. You now have lifetime access to your course.'}
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {course && (
                        <Link
                            to={`/courses/${course.slug}/learn`}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            Start Learning
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                    <Link
                        to="/courses"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Browse More Courses
                    </Link>
                </div>

                {/* Receipt note */}
                <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    A receipt has been sent to your email address.
                </p>
            </div>
        </div>
    );
};

export default PurchaseSuccessPage;
