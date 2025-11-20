import React from 'react';
import { Video } from '../types';
import { ThumbsUp, MoreVertical } from './Icons';
import { MOCK_VIDEOS } from '../constants';

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const recommended = MOCK_VIDEOS.filter(v => v.id !== video.id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-[1800px] mx-auto">
      {/* Main Video Content */}
      <div className="flex-1">
        {/* Video Placeholder */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden relative group shadow-2xl border border-[#2a2a2a]">
          <img src={video.thumbnail} className="w-full h-full object-cover opacity-50" alt={video.title} />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center pl-1 cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent"></div>
             </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"></div>
        </div>

        <h1 className="text-xl font-bold text-white mt-4 mb-2">{video.title}</h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3F3F3F]">
          <div className="flex items-center gap-3">
             <img src={video.channelAvatar} className="w-10 h-10 rounded-full" alt={video.channelName} />
             <div className="flex flex-col">
               <h3 className="text-white font-bold text-sm">{video.channelName}</h3>
               <span className="text-[#AAA] text-xs">1.2M subscribers</span>
             </div>
             <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium ml-4 hover:bg-gray-200">
               Subscribe
             </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#222] rounded-full overflow-hidden">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#3F3F3F] border-r border-[#3F3F3F]">
                <ThumbsUp className="w-5 h-5" /> 
                <span className="text-sm font-medium">12K</span>
              </button>
              <button className="px-4 py-2 hover:bg-[#3F3F3F]">
                <div className="rotate-180"><ThumbsUp className="w-5 h-5" /></div>
              </button>
            </div>
            <button className="bg-[#222] p-2 rounded-full hover:bg-[#3F3F3F]">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 bg-[#222] rounded-xl p-3 text-sm text-white">
           <div className="font-bold mb-1">{video.views} • {video.postedAt}</div>
           <p>{video.description}</p>
           <button className="text-gray-400 font-bold mt-2">Show more</button>
        </div>
        
        {/* Comments Section Placeholder */}
        <div className="mt-6">
           <div className="flex items-center gap-8 mb-4">
             <h3 className="font-bold text-xl">482 Comments</h3>
           </div>
           {/* Comment Input */}
           <div className="flex gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold shrink-0">U</div>
              <div className="flex-1 border-b border-[#3F3F3F] pb-2">
                 <input type="text" placeholder="Add a comment..." className="bg-transparent w-full outline-none text-sm" />
              </div>
           </div>
        </div>
      </div>

      {/* Recommendations Sidebar */}
      <div className="w-full lg:w-[400px] flex flex-col gap-3">
        {recommended.map(v => (
          <div key={v.id} className="flex gap-2 cursor-pointer group">
            <div className="relative w-40 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-800">
              <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.title} />
              <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">{v.duration}</div>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-gray-300">{v.title}</h4>
              <div className="text-xs text-[#AAA]">{v.channelName}</div>
              <div className="text-xs text-[#AAA]">{v.views} • {v.postedAt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;