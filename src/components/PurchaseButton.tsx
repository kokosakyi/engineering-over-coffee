import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { createCheckoutSession, redirectToCheckout, formatPrice } from '../services/stripe';

interface PurchaseButtonProps {
    courseId: string;
    courseSlug: string;
    priceCents: number;
}

export const PurchaseButton = ({ courseId, courseSlug, priceCents }: PurchaseButtonProps) => {
    const { user, isSignedIn } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePurchase = async () => {
        if (!isSignedIn || !user) {
            // Could trigger sign-in modal here
            setError('Please sign in to purchase this course');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const successUrl = `${window.location.origin}/purchase/success?course=${courseSlug}`;
            const cancelUrl = `${window.location.origin}/courses/${courseSlug}`;

            const { url } = await createCheckoutSession(
                courseId,
                user.id,
                user.emailAddresses[0]?.emailAddress || '',
                successUrl,
                cancelUrl
            );

            if (url) {
                redirectToCheckout(url);
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            console.error('Purchase error:', err);
            setError(err instanceof Error ? err.message : 'Failed to start checkout');
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <button
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-white font-medium rounded-lg transition-colors"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <ShoppingCart className="w-5 h-5" />
                        Buy for {formatPrice(priceCents)}
                    </>
                )}
            </button>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                </p>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                One-time purchase • Lifetime access
            </p>
        </div>
    );
};

export default PurchaseButton;
