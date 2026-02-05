import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { getCourseBySlug, hasUserPurchasedCourse } from '../services/courses';

interface PurchasedRouteProps {
    children: React.ReactNode;
}

export const PurchasedRoute = ({ children }: PurchasedRouteProps) => {
    const { slug } = useParams<{ slug: string }>();
    const { user, isLoaded: isUserLoaded } = useUser();
    const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
    const [courseExists, setCourseExists] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            if (!isUserLoaded || !user || !slug) {
                setIsLoading(false);
                return;
            }

            try {
                // First check if course exists
                const course = await getCourseBySlug(slug);
                if (!course) {
                    setCourseExists(false);
                    setIsLoading(false);
                    return;
                }
                setCourseExists(true);

                // Then check if user has purchased
                const purchased = await hasUserPurchasedCourse(user.id, course.id);
                setIsPurchased(purchased);
            } catch (error) {
                console.error('Error checking course access:', error);
                setIsPurchased(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAccess();
    }, [slug, user, isUserLoaded]);

    // Show loading while checking
    if (isLoading || !isUserLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
            <SignedIn>
                {/* Course doesn't exist */}
                {courseExists === false && (
                    <Navigate to="/courses" replace />
                )}

                {/* Not purchased - redirect to course detail page */}
                {courseExists && isPurchased === false && (
                    <Navigate to={`/courses/${slug}`} replace />
                )}

                {/* Purchased - show content */}
                {courseExists && isPurchased && children}
            </SignedIn>
        </>
    );
};

export default PurchasedRoute;
