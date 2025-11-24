
import React, { useState, useEffect } from 'react';
import { Video, Comment } from '../types';
import { ThumbsUp, MoreVertical, CornerDownRight, Share2, Flag, X, CheckCircle, Copy } from './Icons';
import { MOCK_VIDEOS, MOCK_COMMENTS } from '../constants';
import Button from './Button';
import CustomVideoPlayer from './CustomVideoPlayer';
import { AnalyticsAPI, VideoAPI } from '../services/api';

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const recommended = MOCK_VIDEOS.filter(v => v.id !== video.id);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  
  // Interaction States
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
     // Track View History
     AnalyticsAPI.recordView(video.id);
  }, [video.id]);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
    VideoAPI.likeVideo(video.id);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'https://ui-avatars.com/api/?name=You&background=ef4444&color=fff',
      text: newComment,
      timestamp: 'Just now',
      likes: 0,
      dislikes: 0
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likes);

    const toggleLike = () => {
       setIsLiked(!isLiked);
       setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
      <div className={`flex gap-3 ${isReply ? 'mt-3 ml-10' : 'mt-4'}`}>
         <img src={comment.avatar} className="w-8 h-8 rounded-full shrink-0" alt={comment.author} />
         <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-baseline gap-2">
               <span className="text-white text-sm font-semibold">{comment.author}</span>
               <span className="text-gray-400 text-xs">{comment.timestamp}</span>
            </div>
            <p className="text-white text-sm leading-relaxed">{comment.text}</p>
            <div className="flex items-center gap-4 mt-1">
               <button 
                 onClick={toggleLike}
                 className={`flex items-center gap-2 text-xs ${isLiked ? 'text-white' : 'text-gray-400 hover:text-white'}`}
               >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                  <span>{likeCount}</span>
               </button>
               <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-white">
                  <div className="rotate-180"><ThumbsUp className="w-4 h-4" /></div>
               </button>
               <button className="text-xs font-bold text-gray-400 hover:text-white">Reply</button>
            </div>

            {/* Recursive Replies */}
            {comment.replies && comment.replies.map(reply => (
               <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
         </div>
         <button className="p-1 hover:bg-[#303030] rounded-full h-fit text-gray-400 opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4" />
         </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-[1800px] mx-auto relative">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-[#222] border border-[#333] rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-white font-bold text-lg">Share</h3>
                 <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 mb-4 custom-scrollbar">
                 {['WhatsApp', 'Facebook', 'Twitter', 'Email', 'Reddit', 'Embed'].map(platform => (
                    <div key={platform} className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group">
                       <div className="w-12 h-12 rounded-full bg-[#333] group-hover:bg-[#444] flex items-center justify-center text-white font-bold text-lg">
                          {platform[0]}
                       </div>
                       <span className="text-xs text-gray-400">{platform}</span>
                    </div>
                 ))}
              </div>

              <div className="bg-[#111] border border-[#333] rounded-lg p-3 flex items-center gap-3">
                 <div className="flex-1 truncate text-gray-400 text-sm">https://wetube.com/watch?v={video.id}</div>
                 <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-1">
                    <Copy className="w-4 h-4" /> Copy
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Video Content */}
      <div className="flex-1">
        
        {/* Advanced Custom Video Player */}
        <CustomVideoPlayer 
          thumbnail={video.thumbnail} 
          title={video.title}
          autoPlayNext={true}
        />

        <h1 className="text-xl font-bold text-white mt-4 mb-2">{video.title}</h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3F3F3F]">
          <div className="flex items-center gap-3">
             <img src={video.channelAvatar} className="w-10 h-10 rounded-full" alt={video.channelName} />
             <div className="flex flex-col">
               <h3 className="text-white font-bold text-sm">{video.channelName}</h3>
               <span className="text-[#AAA] text-xs">1.2M subscribers</span>
             </div>
             <button 
               onClick={handleSubscribe}
               className={`px-4 py-2 rounded-full text-sm font-medium ml-4 transition-colors ${
                 isSubscribed ? 'bg-[#303030] text-white hover:bg-[#3F3F3F]' : 'bg-white text-black hover:bg-gray-200'
               }`}
             >
               {isSubscribed ? 'Subscribed' : 'Subscribe'}
             </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#222] rounded-full overflow-hidden border border-[#333]">
              <button 
                 onClick={handleLike}
                 className={`flex items-center gap-2 px-4 py-2 hover:bg-[#3F3F3F] border-r border-[#333] transition-colors ${liked ? 'text-white' : 'text-gray-300'}`}
              >
                <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} /> 
                <span className="text-sm font-medium">12K</span>
              </button>
              <button 
                 onClick={handleDislike}
                 className={`px-4 py-2 hover:bg-[#3F3F3F] transition-colors ${disliked ? 'text-white' : 'text-gray-300'}`}
              >
                <div className="rotate-180"><ThumbsUp className={`w-5 h-5 ${disliked ? 'fill-white' : ''}`} /></div>
              </button>
            </div>
            <button 
              onClick={() => setShowShareModal(true)}
              className="bg-[#222] flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#3F3F3F] border border-[#333] text-gray-300 hover:text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
            <button className="bg-[#222] p-2 rounded-full hover:bg-[#3F3F3F] border border-[#333] text-gray-300">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 bg-[#222] rounded-xl p-3 text-sm text-white hover:bg-[#2a2a2a] transition-colors cursor-pointer group">
           <div className="font-bold mb-1">{video.views} • {video.postedAt}</div>
           <p className="group-hover:line-clamp-none line-clamp-2 transition-all">{video.description}</p>
           <button className="text-gray-400 font-bold mt-2">Show more</button>
        </div>
        
        {/* Comments Section */}
        <div className="mt-6">
           <div className="flex items-center gap-8 mb-6">
             <h3 className="font-bold text-xl">{comments.length} Comments</h3>
             <div className="flex items-center gap-2 text-sm font-bold text-gray-400 cursor-pointer hover:text-white">
                <div className="w-5 h-5"><MoreVertical className="w-5 h-5 rotate-90" /></div>
                Sort by
             </div>
           </div>

           {/* Comment Input */}
           <div className="flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold shrink-0">Y</div>
              <div className="flex-1">
                 <input 
                   type="text" 
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                   placeholder="Add a comment..." 
                   className="bg-transparent w-full outline-none text-sm border-b border-[#3F3F3F] focus:border-white pb-2 transition-colors placeholder-gray-500 text-white" 
                 />
                 {newComment && (
                   <div className="flex justify-end gap-3 mt-2">
                     <Button variant="ghost" size="sm" onClick={() => setNewComment('')}>Cancel</Button>
                     <Button variant="primary" size="sm" onClick={handlePostComment}>Comment</Button>
                   </div>
                 )}
              </div>
           </div>

           <div className="space-y-2">
              {comments.map(comment => (
                 <CommentItem key={comment.id} comment={comment} />
              ))}
           </div>
        </div>
      </div>

      {/* Recommendations Sidebar */}
      <div className="w-full lg:w-[400px] flex flex-col gap-3">
        {recommended.map(v => (
          <div key={v.id} className="flex gap-2 cursor-pointer group">
            <div className="relative w-40 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-800">
              <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.title} />
              <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded text-white">{v.duration}</div>
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
