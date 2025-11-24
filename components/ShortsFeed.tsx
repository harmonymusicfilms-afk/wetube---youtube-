import React from 'react';
import { ThumbsUp, MessageSquare, Share2, MoreVertical, Play } from './Icons';
import { MOCK_SHORTS } from '../constants';

const ShortsFeed: React.FC = () => {
  return (
    <div className="h-[calc(100vh-56px)] w-full flex justify-center bg-black overflow-hidden">
      <div className="h-full w-full max-w-[480px] overflow-y-scroll snap-y snap-mandatory custom-scrollbar">
        {MOCK_SHORTS.map(short => (
          <div key={short.id} className="snap-start w-full h-[calc(100vh-56px)] relative flex items-center justify-center py-4">
            <div className="relative w-full h-full md:h-[95%] md:rounded-2xl overflow-hidden bg-[#222] border border-[#333] shadow-2xl group">
              {/* Video Placeholder / Image */}
              <img 
                src={short.thumbnail} 
                alt={short.title} 
                className="w-full h-full object-cover" 
              />
              
              {/* Play Icon Overlay (simulating paused/playing) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>

              {/* Right Sidebar Actions */}
              <div className="absolute right-2 bottom-16 flex flex-col items-center gap-6 pb-4 z-10">
                <div className="flex flex-col items-center gap-1">
                  <button className="p-3 bg-[#2a2a2a]/60 hover:bg-[#3a3a3a] backdrop-blur-md rounded-full transition-all">
                    <ThumbsUp className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-xs font-bold">{short.likes}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <button className="p-3 bg-[#2a2a2a]/60 hover:bg-[#3a3a3a] backdrop-blur-md rounded-full transition-all">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-xs font-bold">Comment</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <button className="p-3 bg-[#2a2a2a]/60 hover:bg-[#3a3a3a] backdrop-blur-md rounded-full transition-all">
                    <Share2 className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-xs font-bold">Share</span>
                </div>

                <button className="p-3 hover:bg-[#3a3a3a]/50 rounded-full transition-all mt-2">
                  <MoreVertical className="w-6 h-6 text-white" />
                </button>

                {/* Channel Avatar Small */}
                 <div className="w-10 h-10 bg-gray-600 rounded-lg border-2 border-white mt-2 overflow-hidden">
                     <img src={`https://ui-avatars.com/api/?name=${short.channelName}&background=random`} alt={short.channelName} />
                 </div>
              </div>

              {/* Bottom Info Area */}
              <div className="absolute bottom-4 left-4 right-16 z-10 text-left">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gray-700 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-opacity-60 backdrop-blur-sm">
                        Short
                    </div>
                 </div>
                 <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2 text-shadow">{short.title}</h3>
                 <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">@{short.channelName}</span>
                    <button className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                        Subscribe
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortsFeed;