import { useState } from "react";
import { Link, useLocation } from "react-router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <Link
                        to="/"
                        className="text-xl font-medium text-gray-900 dark:text-gray-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        Engineering Library
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-medium transition-colors ${isHomePage
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/books"
                            className={`text-sm font-medium transition-colors ${location.pathname === "/books"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                }`}
                        >
                            Books
                        </Link>
                        <Link
                            to="/courses"
                            className={`text-sm font-medium transition-colors ${location.pathname.startsWith("/courses")
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                }`}
                        >
                            Courses
                        </Link>
                    </div>

                    {/* Right side: Theme toggle and Auth */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <SignedOut>
                            <SignInButton
                                mode="modal"
                                appearance={{
                                    elements: {
                                        footer: "hidden",
                                        footerPages: "hidden",
                                    }
                                }}
                            >
                                <button className="hidden sm:block px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9"
                                    }
                                }}
                            />
                        </SignedIn>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col gap-4">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-sm font-medium transition-colors ${isHomePage
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/books"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-sm font-medium transition-colors ${location.pathname === "/books"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                    }`}
                            >
                                Books
                            </Link>
                            <Link
                                to="/courses"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-sm font-medium transition-colors ${location.pathname.startsWith("/courses")
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                                    }`}
                            >
                                Courses
                            </Link>
                            <SignedOut>
                                <SignInButton
                                    mode="modal"
                                    appearance={{
                                        elements: {
                                            footer: "hidden",
                                            footerPages: "hidden",
                                        }
                                    }}
                                >
                                    <button className="w-full text-left px-0 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
