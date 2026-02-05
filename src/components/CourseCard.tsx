import { Link } from 'react-router';
import { Play, CheckCircle, Clock } from 'lucide-react';
import type { Course } from '../services/supabase';
import { formatPrice } from '../services/stripe';

interface CourseCardProps {
    course: Course;
    isPurchased?: boolean;
    progressPercentage?: number;
}

export const CourseCard = ({ course, isPurchased = false, progressPercentage = 0 }: CourseCardProps) => {
    const linkTo = isPurchased
        ? `/courses/${course.slug}/learn`
        : `/courses/${course.slug}`;

    return (
        <Link
            to={linkTo}
            className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {course.thumbnail_url ? (
                    <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                )}

                {/* Progress overlay for purchased courses */}
                {isPurchased && progressPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600">
                        <div
                            className="h-full bg-amber-500 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                )}

                {/* Status badge */}
                {isPurchased ? (
                    progressPercentage === 100 ? (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                        </div>
                    ) : progressPercentage > 0 ? (
                        <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {progressPercentage}% complete
                        </div>
                    ) : null
                ) : (
                    <div className="absolute top-3 right-3 bg-gray-900/80 dark:bg-gray-100/80 text-white dark:text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        {formatPrice(course.price_cents)}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {course.title}
                </h3>
                {course.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {course.description}
                    </p>
                )}

                {/* Action hint */}
                <div className="mt-4 flex items-center text-sm font-medium text-amber-600 dark:text-amber-400">
                    {isPurchased ? (
                        <>
                            <Play className="w-4 h-4 mr-1" />
                            {progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}
                        </>
                    ) : (
                        <>
                            View Course
                            <span className="ml-1">→</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
