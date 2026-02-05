import { useRouteError, isRouteErrorResponse } from 'react-router';

import { Link } from 'react-router';

export default function ErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error) && error.status === 404) {
        return (
            <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8 max-w-3xl">
                    <div className="text-gray-900 dark:text-gray-100">Page not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {isRouteErrorResponse(error)
                        ? `${error.status} ${error.statusText}`
                        : error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred'}
                </p>
                <Link to="/" className="text-gray-900 dark:text-gray-100 hover:underline">Go Home</Link>
            </div>
        </div>
    );
}