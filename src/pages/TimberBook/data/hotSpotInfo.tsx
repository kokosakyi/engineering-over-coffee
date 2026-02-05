
import { X } from "lucide-react";

interface Hotspot {
    id: number;
    x: number;
    y: number;
    title: string;
    description: string;
}

interface HotSpotInfoProps {
    hotspot: Hotspot | null;
    onClose: () => void;
}

const HotSpotInfo: React.FC<HotSpotInfoProps> = ({ hotspot, onClose }) => {
    if (!hotspot) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-20 dark:bg-opacity-40 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{hotspot.title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{hotspot.description}</p>
            </div>
        </div>
    );
};

export default HotSpotInfo;