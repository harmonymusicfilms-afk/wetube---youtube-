
import React, { useState } from 'react';
import { Post } from '../types';
import { ThumbsUp, MessageSquare, MoreVertical, Share2 } from './Icons';

interface CommunityPostProps {
  post: Post;
}

const CommunityPost: React.FC<CommunityPostProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
          <div>
            <div className="text-white font-bold text-sm">{post.author}</div>
            <div className="text-gray-500 text-xs">{post.timestamp}</div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#303030]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-200 text-sm mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.image && (
        <div className="rounded-lg overflow-hidden border border-[#3F3F3F] mb-3">
          <img src={post.image} alt="Post attachment" className="w-full object-cover max-h-[400px]" />
        </div>
      )}

      <div className="flex items-center gap-6 mt-2">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm transition-colors ${liked ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
        >
          <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span>{likeCount}</span>
        </button>

        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <MessageSquare className="w-5 h-5" />
          <span>{post.comments}</span>
        </button>

        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CommunityPost;
