import React from 'react';
import { Video } from '../types';
import { MoreVertical } from './Icons';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const isLive = video.duration === 'LIVE' || video.postedAt === 'LIVE';

  return (
    <div className="flex flex-col gap-3 cursor-pointer group" onClick={() => onClick(video)}>
      <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-800">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
        {isLive ? (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-xs font-bold text-white">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        ) : (
          <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded font-medium">
            {video.duration}
          </div>
        )}
      </div>
      <div className="flex gap-3 items-start">
        <img src={video.channelAvatar} alt={video.channelName} className="w-9 h-9 rounded-full mt-1" />
        <div className="flex flex-col flex-1">
          <h3 className="text-white font-semibold text-base line-clamp-2 leading-tight">{video.title}</h3>
          <div className="text-[#AAA] text-sm mt-1 hover:text-white">{video.channelName}</div>
          <div className="text-[#AAA] text-sm">
            {video.views} • {video.postedAt}
          </div>
          <div className="text-[#777] text-xs mt-0.5">
            Uploaded: {video.uploadedAt}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 -mr-2 p-1 hover:bg-wetube-hover rounded-full">
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;