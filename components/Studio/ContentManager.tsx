
import React, { useState, useEffect } from 'react';
import { 
  Filter, Globe, Lock, EyeOff, PenSquare, BarChart2, 
  MessageSquare, ExternalLink, ChevronLeft, ChevronRight, 
  AlertCircle, CheckCircle, Eye, ThumbsUp, MoreVertical, Loader2
} from '../Icons';
import { VideoAPI } from '../../services/api';
import { Video } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const ContentManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Videos');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const fetchContent = async () => {
        if (!user) return;
        try {
           // In a real app, we'd use the user ID to fetch only their videos
           const data = await VideoAPI.getAll({ userId: user.id });
           setVideos(data);
        } catch (e) {
           console.error("Failed to fetch content", e);
        } finally {
           setIsLoading(false);
        }
     };
     fetchContent();
  }, [user]);

  const toggleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === videos.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(videos.map(i => i.id));
    }
  };

  const VisibilityBadge = ({ visibility }: { visibility: string }) => {
    switch (visibility) {
      case 'public':
        return (
          <div className="flex items-center gap-2 text-green-500">
            <Globe className="w-4 h-4" />
            <span>Public</span>
          </div>
        );
      case 'private':
        return (
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span>Private</span>
          </div>
        );
      case 'unlisted':
        return (
          <div className="flex items-center gap-2 text-gray-400">
            <EyeOff className="w-4 h-4" />
            <span>Unlisted</span>
          </div>
        );
      default:
        return <span className="text-gray-400 capitalize">{visibility}</span>;
    }
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen w-full">
      {/* 1. Header Section */}
      <div className="px-8 pt-8 pb-2">
        <h1 className="text-2xl font-bold text-white">Channel content</h1>
      </div>

      {/* Tabs Row */}
      <div className="px-6 border-b border-[#303030] flex items-center gap-8 overflow-x-auto custom-scrollbar">
        {['Videos', 'Live', 'Posts', 'Playlists'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-2 text-sm font-medium border-b-[3px] transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'border-wetube-red text-wetube-red' 
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 flex items-center gap-2 border-b border-[#303030]">
        <button className="flex items-center gap-2 text-white font-medium hover:bg-[#2a2a2a] px-2 py-1 rounded transition-colors">
          <Filter className="w-5 h-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Content Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
           <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-wetube-red animate-spin" />
           </div>
        ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
                <tr className="text-xs text-gray-400 font-medium border-b border-[#303030]">
                <th className="p-4 w-12">
                    <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-gray-500 bg-transparent border-gray-500 rounded cursor-pointer"
                    checked={selectedItems.length === videos.length && videos.length > 0}
                    onChange={toggleSelectAll}
                    />
                </th>
                <th className="p-4 w-[40%]">Video</th>
                <th className="p-4">Visibility</th>
                <th className="p-4">Restrictions</th>
                <th className="p-4">Date</th>
                <th className="p-4">Views</th>
                <th className="p-4">Comments</th>
                <th className="p-4">Likes</th>
                </tr>
            </thead>
            <tbody>
                {videos.map((item) => (
                <tr 
                    key={item.id} 
                    className="border-b border-[#303030] hover:bg-[#1F1F1F] group transition-colors"
                >
                    <td className="p-4 align-top pt-6">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-gray-500 bg-transparent border-gray-500 rounded cursor-pointer"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                    />
                    </td>
                    <td className="p-4">
                    <div className="flex gap-4">
                        <div className="relative w-[120px] h-[68px] rounded-md overflow-hidden bg-[#2a2a2a] shrink-0 group-hover:ring-1 ring-gray-500 transition-all">
                        <img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-90" />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white font-bold">
                            {item.duration}
                        </div>
                        
                        {/* Hover Overlay (Simulated Play) */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        </div>
                        <div className="flex flex-col justify-between py-0.5 max-w-md relative">
                        <div>
                            <h3 className="text-[15px] font-medium text-white line-clamp-1 cursor-pointer hover:text-blue-400 transition-colors">
                            {item.title}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {item.description}
                            </p>
                        </div>
                        
                        {/* Hover Actions Toolbar */}
                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                            <button title="Edit details" className="text-gray-400 hover:text-white"><PenSquare className="w-5 h-5" /></button>
                            <button title="Analytics" className="text-gray-400 hover:text-white"><BarChart2 className="w-5 h-5" /></button>
                            <button title="Comments" className="text-gray-400 hover:text-white"><MessageSquare className="w-5 h-5" /></button>
                            <button title="More actions" className="text-gray-400 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                        </div>
                    </div>
                    </td>
                    <td className="p-4 align-top pt-6 text-sm">
                    <VisibilityBadge visibility={item.visibility} />
                    </td>
                    <td className="p-4 align-top pt-6">
                    <span className="text-gray-400 text-sm">None</span>
                    </td>
                    <td className="p-4 align-top pt-6">
                    <div className="text-sm text-white mb-1">{item.uploadedAt}</div>
                    <div className="text-xs text-gray-400">Published</div>
                    </td>
                    <td className="p-4 align-top pt-6 text-sm text-white">
                    {item.views}
                    </td>
                    <td className="p-4 align-top pt-6 text-sm text-white">
                    0
                    </td>
                    <td className="p-4 align-top pt-6 w-32">
                        <span className="text-gray-400 text-sm">-</span>
                    </td>
                </tr>
                ))}
                {videos.length === 0 && (
                    <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                            No content found. Upload your first video!
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        )}
      </div>

      {/* Footer Pagination */}
      <div className="flex items-center justify-end gap-8 px-6 py-3 border-t border-[#303030] text-xs text-gray-400 font-medium bg-[#121212]">
        <div className="flex items-center gap-2">
          Rows per page:
          <select className="bg-transparent text-white border-none outline-none cursor-pointer">
            <option>10</option>
            <option>30</option>
            <option>50</option>
          </select>
        </div>
        
        <div>
          1–{videos.length} of {videos.length}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-600 cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
          <button className="text-gray-600 cursor-not-allowed"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
