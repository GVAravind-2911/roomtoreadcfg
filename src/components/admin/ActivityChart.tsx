import React from 'react';
import Image from 'next/image';

interface ActivityCardProps {
    title: string;
    description: string;
    imageUrl: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    completionStatus?: boolean;
    onClick?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
    title,
    description,
    imageUrl = '/placeholder-activity.jpg',
    difficulty = 'beginner',
    duration,
    completionStatus = false,
    onClick
}) => {
    const difficultyColors = {
        beginner: 'bg-green-100 text-green-800',
        intermediate: 'bg-yellow-100 text-yellow-800',
        advanced: 'bg-red-100 text-red-800'
    };

    const capitalizedDifficulty = difficulty 
        ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
        : 'Beginner';

    const [imgError, setImgError] = React.useState(false);
    const fallbackImage = '/placeholder-activity.jpg';

    // Generate descriptive alt text
    const imageAltText = `Activity image for ${title} - ${difficulty} level, ${duration} minutes`;

    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
            <div className="relative h-48 w-full">
                <Image
                    src={imgError ? fallbackImage : imageUrl}
                    alt={imageAltText}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => setImgError(true)}
                    priority={false}
                />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    {completionStatus && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Completed
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{description}</p>
                <div className="flex justify-between items-center">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${difficultyColors[difficulty] || difficultyColors.beginner}`}>
                        {capitalizedDifficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                        {duration} min
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;