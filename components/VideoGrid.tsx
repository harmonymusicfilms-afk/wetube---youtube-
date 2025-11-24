
import React from 'react';
import { Video } from '../types';
import VideoCard from './VideoCard';
import { Loader2 } from './Icons';

interface VideoGridProps {
  videos: Video[];
  title: string;
  icon: React.ElementType;
  isLoading?: boolean;
  onVideoClick: (video: Video) => void;
  emptyMessage?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ 
  videos, 
  title, 
  icon: Icon, 
  isLoading, 
  onVideoClick,
  emptyMessage = "No videos found."
}) => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
         <div className="p-3 bg-[#1F1F1F] rounded-full border border-[#3F3F3F]">
            <Icon className="w-6 h-6 text-wetube-red" />
         </div>
         <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>

      {isLoading ? (
         <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-wetube-red animate-spin" />
         </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onClick={onVideoClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
           <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
