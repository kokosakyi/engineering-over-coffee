import { Info } from "lucide-react";

interface HotSpotProps {
    x: number;
    y: number;
    onClick: () => void;
    isActive: boolean;
}

const HotSpot = ({ x, y, onClick, isActive }: HotSpotProps) => {
    return (
        <button
            onClick={onClick}
            className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 transition-all ${isActive
                ? 'bg-gray-800 dark:bg-gray-600 border-gray-600 dark:border-gray-400 scale-125'
                : 'bg-gray-700 dark:bg-gray-500 border-white dark:border-gray-200 hover:scale-110 hover:bg-gray-800 dark:hover:bg-gray-600'
                } cursor-pointer shadow-md`}
            style={{ left: `${x}%`, top: `${y}%` }}
        >
            <Info className="w-4 h-4 text-white mx-auto" />
        </button>
    )
}

export default HotSpot;