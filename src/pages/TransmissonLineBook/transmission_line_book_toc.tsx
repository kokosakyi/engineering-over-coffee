import { Link } from "react-router";
import frontCover from "../../assets/images/books/transmisson_line_design.jpg";

const TransmissionLineBookTOC = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 mb-8 text-center">
                Distribution and Transmission Line Design Book
            </h1>
            <div className="mb-12 flex justify-center">
                <img
                    src={frontCover}
                    alt="Distribution and Transmission Line Design Book"
                    className="w-3/4 max-w-2xl h-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                />
            </div>
            <div className="space-y-8">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                        <Link
                            to="/transmission-line-book/introduction"
                            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            Introduction:
                        </Link>
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        This book is a guide to the design and construction of distribution and transmission lines. It covers the basics of line design, construction, and maintenance.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default TransmissionLineBookTOC;