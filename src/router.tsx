import { createBrowserRouter } from "react-router";

import { RootLayout } from "./layouts/RootLayout.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { PurchasedRoute } from "./components/PurchasedRoute.tsx";
import BooksList from "./pages/BooksList.tsx";

import TimberBookTOC from "./pages/TimberBook/timber_book_toc.tsx";
import { Introduction } from "./pages/TimberBook/introduction/Introduction.tsx";
import { ChapterOne } from "./pages/TimberBook/chapter_one/chapter_one.tsx";
import { ChapterTwo } from "./pages/TimberBook/chapter_two/chapter_two.tsx";

import TransmissionLineBookTOC from "./pages/TransmissonLineBook/transmission_line_book_toc.tsx";

import { CoursesListPage } from "./pages/Courses/CoursesListPage.tsx";
import { CourseDetailPage } from "./pages/Courses/CourseDetailPage.tsx";
import { CoursePlayerPage } from "./pages/Courses/CoursePlayerPage.tsx";
import { PurchaseSuccessPage } from "./pages/Courses/PurchaseSuccessPage.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'books',
                element: <BooksList />,
            },
            {
                path: 'timber-book',
                element: (
                    <ProtectedRoute>
                        <TimberBookTOC />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'timber-book/introduction',
                element: (
                    <ProtectedRoute>
                        <Introduction />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'timber-book/chapter-one',
                element: (
                    <ProtectedRoute>
                        <ChapterOne />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'timber-book/chapter-two',
                element: (
                    <ProtectedRoute>
                        <ChapterTwo />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'transmission-line-book',
                element: (
                    <ProtectedRoute>
                        <TransmissionLineBookTOC />
                    </ProtectedRoute>
                ),
            },
            // Course routes
            {
                path: 'courses',
                element: <CoursesListPage />,
            },
            {
                path: 'courses/:slug',
                element: <CourseDetailPage />,
            },
            {
                path: 'courses/:slug/learn',
                element: (
                    <PurchasedRoute>
                        <CoursePlayerPage />
                    </PurchasedRoute>
                ),
            },
            {
                path: 'courses/:slug/learn/:lessonId',
                element: (
                    <PurchasedRoute>
                        <CoursePlayerPage />
                    </PurchasedRoute>
                ),
            },
            {
                path: 'purchase/success',
                element: (
                    <ProtectedRoute>
                        <PurchaseSuccessPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;