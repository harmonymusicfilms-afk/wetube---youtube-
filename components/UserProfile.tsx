
import React, { useState } from 'react';
import { Camera, Edit3, Search, ImageIcon, Send } from './Icons';
import Button from './Button';
import { MOCK_VIDEOS, MOCK_POSTS } from '../constants';
import VideoCard from './VideoCard';
import CommunityPost from './CommunityPost';
import { Video, Post } from '../types';
import Input from './Input';

const UserProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'community' | 'about'>('videos');
  const [isEditing, setIsEditing] = useState(false);
  const [channelName, setChannelName] = useState('You');
  const [bio, setBio] = useState('Creating content about tech, travel, and life. Join me on this journey!');
  
  // Post Creation State
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  // Filter mock videos to show "My" videos (using a fake filter for demo)
  const myVideos = MOCK_VIDEOS.slice(0, 4); 

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: channelName,
      avatar: "https://ui-avatars.com/api/?name=You&background=ef4444&color=fff",
      content: newPostContent,
      likes: 0,
      comments: 0,
      timestamp: 'Just now'
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Banner */}
      <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-purple-900 to-blue-900 group">
        {isEditing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
            <Camera className="w-10 h-10 text-white opacity-80" />
          </div>
        )}
      </div>

      {/* Header Info */}
      <div className="px-6 md:px-12 -mt-16 flex flex-col md:flex-row items-start md:items-end gap-6 pb-6 border-b border-[#3F3F3F]">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-[#0F0F0F] bg-purple-600 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
            Y
          </div>
          {isEditing && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer">
              <Camera className="w-8 h-8 text-white opacity-80" />
            </div>
          )}
        </div>
        
        <div className="flex-1 mb-2">
          {isEditing ? (
            <input 
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="bg-[#121212] border border-[#3F3F3F] rounded px-2 py-1 text-3xl font-bold text-white w-full max-w-md mb-1"
            />
          ) : (
            <h1 className="text-3xl font-bold text-white">{channelName}</h1>
          )}
          
          <div className="flex flex-wrap gap-x-4 text-gray-400 text-sm mt-1">
            <span>@you</span>
            <span>•</span>
            <span>1.2M subscribers</span>
            <span>•</span>
            <span>4 videos</span>
          </div>
          
          {isEditing ? (
             <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-[#121212] border border-[#3F3F3F] rounded px-2 py-1 text-gray-400 mt-2 w-full max-w-xl resize-none h-20"
             />
          ) : (
            <p className="text-gray-400 mt-2 max-w-xl line-clamp-2">{bio}</p>
          )}
        </div>

        <div className="flex gap-3 mb-2">
          {isEditing ? (
             <Button variant="primary" onClick={() => setIsEditing(false)}>
               Save Changes
             </Button>
          ) : (
             <>
               <Button variant="secondary" onClick={() => setIsEditing(true)}>
                 Customize Channel
               </Button>
               <Button variant="secondary">
                 Manage Videos
               </Button>
             </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 md:px-12 mt-2 flex gap-8 border-b border-[#3F3F3F]">
        <button 
          onClick={() => setActiveTab('videos')}
          className={`py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'videos' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Videos
        </button>
        <button 
          onClick={() => setActiveTab('community')}
          className={`py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'community' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          Community
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'about' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          About
        </button>
        <button className="py-3 font-medium text-sm border-b-2 border-transparent text-gray-400 hover:text-white flex items-center gap-2 ml-auto">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:px-12 py-8">
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4">
            {myVideos.map((video) => (
              <VideoCard key={video.id} video={video} onClick={() => {}} />
            ))}
          </div>
        )}

        {activeTab === 'community' && (
          <div className="max-w-2xl mx-auto">
            {/* Create Post Input */}
            <div className="bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl p-4 mb-8 flex gap-4">
               <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold shrink-0">Y</div>
               <div className="flex-1">
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent text-white text-sm resize-none outline-none h-20 placeholder-gray-500"
                  />
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#3F3F3F]">
                     <button className="text-gray-400 hover:text-white transition-colors">
                        <ImageIcon className="w-5 h-5" />
                     </button>
                     <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                     >
                        Post
                     </Button>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               {posts.map(post => (
                 <CommunityPost key={post.id} post={post} />
               ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-white mb-4">Description</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{bio}</p>
              
              <h3 className="text-lg font-bold text-white mt-8 mb-4">Details</h3>
              <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
                 <span className="text-gray-400">Location:</span>
                 <span className="text-white">United States</span>
                 <span className="text-gray-400">Joined:</span>
                 <span className="text-white">May 15, 2025</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Stats</h3>
              <div className="flex flex-col gap-3 text-sm border-t border-[#3F3F3F] py-4">
                 <span className="text-white">Joined May 15, 2025</span>
                 <span className="text-white">1,205,032 views</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;