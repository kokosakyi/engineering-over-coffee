import { useEffect, useRef, useCallback } from 'react';

interface VideoPlayerProps {
    src: string;
    title: string;
    onProgress?: (currentTime: number, duration: number) => void;
    onComplete?: () => void;
    initialTime?: number;
    completionThreshold?: number; // Percentage (0-100) at which video is considered complete
}

export const VideoPlayer = ({
    src,
    title,
    onProgress,
    onComplete,
    initialTime = 0,
    completionThreshold = 90,
}: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasCompletedRef = useRef(false);
    const progressIntervalRef = useRef<number | null>(null);

    // Set initial time when video loads
    useEffect(() => {
        const video = videoRef.current;
        if (video && initialTime > 0) {
            video.currentTime = initialTime;
        }
    }, [initialTime]);

    // Handle progress tracking
    const handleTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        const currentTime = video.currentTime;
        const duration = video.duration;

        if (onProgress && duration > 0) {
            onProgress(currentTime, duration);
        }

        // Check for completion
        if (!hasCompletedRef.current && duration > 0) {
            const percentWatched = (currentTime / duration) * 100;
            if (percentWatched >= completionThreshold) {
                hasCompletedRef.current = true;
                onComplete?.();
            }
        }
    }, [onProgress, onComplete, completionThreshold]);

    // Save progress periodically (every 5 seconds)
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !onProgress) return;

        progressIntervalRef.current = window.setInterval(() => {
            if (video.currentTime > 0 && video.duration > 0) {
                onProgress(video.currentTime, video.duration);
            }
        }, 5000);

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [onProgress]);

    // Save progress when leaving/pausing
    const handlePause = useCallback(() => {
        const video = videoRef.current;
        if (video && onProgress && video.duration > 0) {
            onProgress(video.currentTime, video.duration);
        }
    }, [onProgress]);

    // Handle video end
    const handleEnded = useCallback(() => {
        if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete?.();
        }
    }, [onComplete]);

    // Check if this is a Bunny Stream URL and convert to embed
    const getVideoSource = (url: string) => {
        // Bunny Stream embed URL format
        if (url.includes('iframe.mediadelivery.net') || url.includes('bunny')) {
            return { type: 'bunny', url };
        }
        // Regular video URL
        return { type: 'native', url };
    };

    const videoSource = getVideoSource(src);

    // Render Bunny Stream iframe
    if (videoSource.type === 'bunny') {
        return (
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                    src={videoSource.url}
                    title={title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    // Render native video player
    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full"
                controls
                onTimeUpdate={handleTimeUpdate}
                onPause={handlePause}
                onEnded={handleEnded}
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-white text-sm">
                {title}
            </div>
        </div>
    );
};

export default VideoPlayer;
