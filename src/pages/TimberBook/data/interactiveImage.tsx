import { useState } from "react";
import HotSpot from "./hotSpot";
import HotSpotInfo from "./hotSpotInfo";

interface Hotspot {
    id: number;
    x: number;
    y: number;
    title: string;
    description: string;
}

interface InteractiveImageProps {
    imageUrl: string;
    hotspots: Hotspot[];
}

const InteractiveImage: React.FC<InteractiveImageProps> = ({ imageUrl, hotspots }) => {
    const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

    return (
        <div className="relative w-full">
            <img
                src={imageUrl}
                alt="Chapter illustration"
                className="w-full h-auto rounded border border-gray-200 dark:border-gray-700"
            />
            {hotspots.map(hotspot => (
                <HotSpot
                    key={hotspot.id}
                    x={hotspot.x}
                    y={hotspot.y}
                    isActive={activeHotspot?.id === hotspot.id}
                    onClick={() => setActiveHotspot(hotspot)}
                />
            ))}
            <HotSpotInfo
                hotspot={activeHotspot}
                onClose={() => setActiveHotspot(null)}
            />
        </div>
    );
};

export default InteractiveImage;