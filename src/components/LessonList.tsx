import { Link } from 'react-router';
import { Play, FileText, CheckCircle, Lock } from 'lucide-react';
import type { ContentWithProgress } from '../services/courses';

interface LessonListProps {
    courseSlug: string;
    content: ContentWithProgress[];
    isPurchased: boolean;
    currentLessonId?: string;
}

export const LessonList = ({ courseSlug, content, isPurchased, currentLessonId }: LessonListProps) => {
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Course Content
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {content.length} lessons
                </p>
            </div>

            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {content.map((item, index) => {
                    const isCurrentLesson = item.id === currentLessonId;
                    const isCompleted = item.progress?.completed ?? false;
                    const canAccess = isPurchased || item.is_preview;

                    const LessonIcon = item.type === 'video' ? Play : FileText;

                    const lessonContent = (
                        <div className={`
                            flex items-center gap-3 p-4 transition-colors
                            ${isCurrentLesson
                                ? 'bg-amber-50 dark:bg-amber-900/20'
                                : canAccess
                                    ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    : 'opacity-60'
                            }
                        `}>
                            {/* Lesson number or status */}
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                ${isCompleted
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : isCurrentLesson
                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                }
                            `}>
                                {isCompleted ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : !canAccess ? (
                                    <Lock className="w-4 h-4" />
                                ) : (
                                    <span className="text-sm font-medium">{index + 1}</span>
                                )}
                            </div>

                            {/* Lesson info */}
                            <div className="grow min-w-0">
                                <div className="flex items-center gap-2">
                                    <LessonIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className={`
                                        text-sm truncate
                                        ${isCurrentLesson
                                            ? 'font-medium text-amber-700 dark:text-amber-300'
                                            : 'text-gray-700 dark:text-gray-300'
                                        }
                                    `}>
                                        {item.title}
                                    </span>
                                </div>

                                {/* Duration and preview badge */}
                                <div className="flex items-center gap-2 mt-1">
                                    {item.duration_seconds > 0 && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDuration(item.duration_seconds)}
                                        </span>
                                    )}
                                    {item.is_preview && !isPurchased && (
                                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                                            Preview
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Progress indicator for videos */}
                            {item.type === 'video' && item.progress && !isCompleted && item.progress.last_position_seconds > 0 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDuration(item.progress.last_position_seconds)} / {formatDuration(item.duration_seconds)}
                                </div>
                            )}
                        </div>
                    );

                    if (canAccess) {
                        return (
                            <li key={item.id}>
                                <Link to={`/courses/${courseSlug}/learn/${item.id}`}>
                                    {lessonContent}
                                </Link>
                            </li>
                        );
                    }

                    return (
                        <li key={item.id} className="cursor-not-allowed">
                            {lessonContent}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default LessonList;
