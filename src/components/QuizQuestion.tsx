import { useState } from 'react';

export interface QuizOption {
    id: string;
    text: string;
}

export interface QuizQuestionData {
    id: string;
    question: string;
    options: QuizOption[];
    correctOptionId: string;
    explanation: string;
}

interface QuizQuestionProps {
    data: QuizQuestionData;
    questionNumber?: number;
}

export const QuizQuestion = ({ data, questionNumber }: QuizQuestionProps) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);

    const handleSelect = (optionId: string) => {
        if (hasAnswered) return;
        setSelectedId(optionId);
        setHasAnswered(true);
    };

    const isCorrect = selectedId === data.correctOptionId;

    const getOptionClasses = (optionId: string) => {
        const base = 'quiz-option relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer';
        
        if (!hasAnswered) {
            return `${base} border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/20`;
        }

        if (optionId === data.correctOptionId) {
            return `${base} quiz-option-correct border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-400`;
        }

        if (optionId === selectedId && !isCorrect) {
            return `${base} quiz-option-incorrect border-rose-400 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-400`;
        }

        return `${base} border-gray-200 dark:border-gray-700 opacity-60`;
    };

    const getOptionLabel = (index: number) => {
        return String.fromCharCode(65 + index); // A, B, C, D...
    };

    return (
        <div className="quiz-question my-8 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-sm">
            {/* Question Header */}
            <div className="flex items-start gap-3 mb-5">
                {questionNumber && (
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white font-semibold text-sm">
                        {questionNumber}
                    </span>
                )}
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                    {data.question}
                </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-4">
                {data.options.map((option, index) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        disabled={hasAnswered}
                        className={getOptionClasses(option.id)}
                    >
                        <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                            hasAnswered && option.id === data.correctOptionId
                                ? 'bg-emerald-500 text-white'
                                : hasAnswered && option.id === selectedId && !isCorrect
                                    ? 'bg-rose-400 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                            {getOptionLabel(index)}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-left flex-1">
                            {option.text}
                        </span>
                        
                        {/* Feedback icons */}
                        {hasAnswered && option.id === data.correctOptionId && (
                            <span className="quiz-feedback-icon flex-shrink-0 text-emerald-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                        {hasAnswered && option.id === selectedId && !isCorrect && (
                            <span className="quiz-feedback-icon flex-shrink-0 text-rose-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Feedback & Explanation */}
            {hasAnswered && (
                <div className={`quiz-explanation p-4 rounded-lg mt-4 ${
                    isCorrect 
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700' 
                        : 'bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700'
                }`}>
                    <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                            <>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Correct!</span>
                                <span className="text-emerald-500">✓</span>
                            </>
                        ) : (
                            <>
                                <span className="text-amber-700 dark:text-amber-400 font-semibold">Not quite</span>
                                <span className="text-amber-600">→</span>
                            </>
                        )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {data.explanation}
                    </p>
                </div>
            )}
        </div>
    );
};

// End-of-chapter quiz wrapper with score tracking
interface ChapterQuizProps {
    title?: string;
    questions: QuizQuestionData[];
}

export const ChapterQuiz = ({ title = "Chapter Review", questions }: ChapterQuizProps) => {
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set());

    const handleQuestionAnswered = (questionId: string, isCorrect: boolean) => {
        setAnsweredQuestions(prev => new Set([...prev, questionId]));
        if (isCorrect) {
            setCorrectAnswers(prev => new Set([...prev, questionId]));
        }
    };

    const allAnswered = answeredQuestions.size === questions.length;
    const score = correctAnswers.size;

    return (
        <div className="chapter-quiz mt-16 pt-8 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </h2>
                {allAnswered && (
                    <div className="quiz-score-badge px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold shadow-lg">
                        Score: {score}/{questions.length}
                    </div>
                )}
            </div>
            
            <div className="space-y-6">
                {questions.map((q, index) => (
                    <QuestionWithCallback
                        key={q.id}
                        data={q}
                        questionNumber={index + 1}
                        onAnswered={(isCorrect) => handleQuestionAnswered(q.id, isCorrect)}
                    />
                ))}
            </div>

            {allAnswered && (
                <div className="quiz-complete-message mt-8 p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-700 text-center">
                    <p className="text-lg text-gray-800 dark:text-gray-200">
                        {score === questions.length 
                            ? "Perfect score! You've mastered this chapter's concepts." 
                            : score >= questions.length / 2 
                                ? "Good work! Review the explanations for any questions you missed."
                                : "Keep studying! Re-read the chapter and try again."}
                    </p>
                </div>
            )}
        </div>
    );
};

// Helper component to track individual question answers
interface QuestionWithCallbackProps {
    data: QuizQuestionData;
    questionNumber: number;
    onAnswered: (isCorrect: boolean) => void;
}

const QuestionWithCallback = ({ data, questionNumber, onAnswered }: QuestionWithCallbackProps) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);

    const handleSelect = (optionId: string) => {
        if (hasAnswered) return;
        setSelectedId(optionId);
        setHasAnswered(true);
        onAnswered(optionId === data.correctOptionId);
    };

    const isCorrect = selectedId === data.correctOptionId;

    const getOptionClasses = (optionId: string) => {
        const base = 'quiz-option relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer';
        
        if (!hasAnswered) {
            return `${base} border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/20`;
        }

        if (optionId === data.correctOptionId) {
            return `${base} quiz-option-correct border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-400`;
        }

        if (optionId === selectedId && !isCorrect) {
            return `${base} quiz-option-incorrect border-rose-400 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-400`;
        }

        return `${base} border-gray-200 dark:border-gray-700 opacity-60`;
    };

    const getOptionLabel = (index: number) => {
        return String.fromCharCode(65 + index);
    };

    return (
        <div className="quiz-question my-8 p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-start gap-3 mb-5">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white font-semibold text-sm">
                    {questionNumber}
                </span>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                    {data.question}
                </h3>
            </div>

            <div className="space-y-3 mb-4">
                {data.options.map((option, index) => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        disabled={hasAnswered}
                        className={getOptionClasses(option.id)}
                    >
                        <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                            hasAnswered && option.id === data.correctOptionId
                                ? 'bg-emerald-500 text-white'
                                : hasAnswered && option.id === selectedId && !isCorrect
                                    ? 'bg-rose-400 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                            {getOptionLabel(index)}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-left flex-1">
                            {option.text}
                        </span>
                        
                        {hasAnswered && option.id === data.correctOptionId && (
                            <span className="quiz-feedback-icon flex-shrink-0 text-emerald-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                        {hasAnswered && option.id === selectedId && !isCorrect && (
                            <span className="quiz-feedback-icon flex-shrink-0 text-rose-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {hasAnswered && (
                <div className={`quiz-explanation p-4 rounded-lg mt-4 ${
                    isCorrect 
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700' 
                        : 'bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700'
                }`}>
                    <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                            <>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Correct!</span>
                                <span className="text-emerald-500">✓</span>
                            </>
                        ) : (
                            <>
                                <span className="text-amber-700 dark:text-amber-400 font-semibold">Not quite</span>
                                <span className="text-amber-600">→</span>
                            </>
                        )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {data.explanation}
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuizQuestion;
