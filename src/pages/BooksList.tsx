import { Link } from "react-router";
import { BookOpen, ArrowRight, Clock, MessageSquare } from "lucide-react";
import timberBookCover from "../assets/images/books/light_frame_wood_construction.jpg";
import transmissionLineBookCover from "../assets/images/books/transmisson_line_design.jpg";

interface Book {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    coverImage: string;
    link: string;
    chapters: number;
    readTime: string;
    available: boolean;
    tags: string[];
}

const books: Book[] = [
    {
        id: 1,
        title: "Brewed Blueprints",
        subtitle: "Light Frame Wood Construction Edition",
        description: "A casual, coffee-shop-style conversation between a junior and principal engineer explaining residential light-frame wood design in Canada. Uses NBC 2020 Part 9 prescriptive rules and CSA O86 engineering standards.",
        coverImage: timberBookCover,
        link: "/timber-book",
        chapters: 12,
        readTime: "4-6 hours",
        available: true,
        tags: ["Wood Design", "NBC 2020", "CSA O86", "Residential"],
    },
    {
        id: 2,
        title: "Distribution and Transmission Line Design",
        subtitle: "Power Systems Engineering",
        description: "Comprehensive guide to designing electrical distribution and transmission lines, covering conductor selection, structural design, and code compliance.",
        coverImage: transmissionLineBookCover,
        link: "/transmission-line-book",
        chapters: 8,
        readTime: "3-5 hours",
        available: true,
        tags: ["Electrical", "Power Systems", "Transmission"],
    },
];

const comingSoonBooks = [
    { title: "Concrete Design Fundamentals", tags: ["Concrete", "CSA A23.3"] },
    { title: "Steel Structures Essentials", tags: ["Steel", "CSA S16"] },
    { title: "Seismic Engineering Handbook", tags: ["Seismic", "NBC Part 4"] },
    { title: "Foundation Systems Guide", tags: ["Geotechnical", "Foundations"] },
];

export const BooksList = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <section className="pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 bg-linear-to-b from-amber-50/50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                            Books
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        Interactive engineering guides written as conversations between junior and senior engineers.
                        Learn at your own pace with real code references and practical examples.
                    </p>
                </div>
            </section>

            {/* Available Books */}
            <section className="py-8 sm:py-12 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Available Now
                    </h2>

                    <div className="space-y-6">
                        {books.map((book) => (
                            <Link
                                key={book.id}
                                to={book.link}
                                className="group block"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Cover Image */}
                                        <div className="md:w-64 lg:w-80 shrink-0">
                                            <div className="aspect-4/5 md:aspect-auto md:h-full overflow-hidden">
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="grow p-6 sm:p-8 flex flex-col">
                                            {/* Badge */}
                                            {book.available && (
                                                <span className="inline-flex self-start px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full mb-4">
                                                    Available to Read
                                                </span>
                                            )}

                                            {/* Title */}
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                {book.subtitle}
                                            </p>

                                            {/* Description */}
                                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
                                                {book.description}
                                            </p>

                                            {/* Meta info */}
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                                <span className="flex items-center gap-1.5">
                                                    <MessageSquare className="w-4 h-4" />
                                                    {book.chapters} chapters
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    {book.readTime}
                                                </span>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {book.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Action */}
                                            <div className="mt-auto">
                                                <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                                                    Start Reading
                                                    <ArrowRight className="w-4 h-4 ml-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coming Soon */}
            <section className="py-8 sm:py-12 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Coming Soon
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {comingSoonBooks.map((book, index) => (
                            <div
                                key={index}
                                className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                                    <BookOpen className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {book.title}
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {book.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BooksList;
