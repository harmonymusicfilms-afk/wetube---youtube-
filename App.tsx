import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import ChatAssistant from './components/ChatAssistant';
import ThumbnailGenerator from './components/Studio/ThumbnailGenerator';
import ImageEditor from './components/Studio/ImageEditor';
import VideoUploader from './components/Studio/VideoUploader';
import CategoryPills from './components/CategoryPills';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import { ToastProvider } from './contexts/ToastContext';
import { MOCK_VIDEOS, CATEGORIES } from './constants';
import { View, Video } from './types';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setCurrentView(View.WATCH);
  };

  const handleNavigateHome = () => {
    setCurrentView(View.HOME);
    setSelectedVideo(null);
    setSelectedCategory('All');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    if (view !== View.WATCH) {
      setSelectedVideo(null);
    }
  };

  const handleVideoPublished = (newVideo: Video) => {
    setVideos([newVideo, ...videos]);
    setCurrentView(View.HOME);
  };

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.channelName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-wetube-dark text-white font-sans">
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNavigateHome={handleNavigateHome}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Hide Sidebar on Mobile, handled by MobileNavigation */}
      <div className="hidden md:block">
        <Sidebar 
          isOpen={isSidebarOpen} 
          currentView={currentView}
          onChangeView={handleViewChange}
        />
      </div>

      <main 
        className={`pt-14 transition-all duration-300 flex flex-col min-h-screen ${isSidebarOpen ? 'md:ml-60' : 'ml-0'}`}
      >
        <div className="flex-1 container mx-auto pb-16 md:pb-0">
          {currentView === View.HOME && (
            <>
              <div className="px-6">
                <CategoryPills 
                  categories={CATEGORIES} 
                  selectedCategory={selectedCategory} 
                  onSelectCategory={setSelectedCategory} 
                />
              </div>
              <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4">
                {filteredVideos.length > 0 ? (
                  filteredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 mt-10">
                    <p>No videos found.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {currentView === View.WATCH && selectedVideo && (
            <VideoPlayer video={selectedVideo} />
          )}

          {currentView === View.STUDIO_GENERATE && (
            <div className="animate-in fade-in duration-300">
              <ThumbnailGenerator />
            </div>
          )}

          {currentView === View.STUDIO_EDIT && (
            <div className="animate-in fade-in duration-300">
              <ImageEditor />
            </div>
          )}

          {currentView === View.STUDIO_UPLOAD && (
            <div className="animate-in fade-in duration-300">
              <VideoUploader onVideoPublished={handleVideoPublished} />
            </div>
          )}
        </div>

        <Footer />
      </main>

      <MobileNavigation currentView={currentView} onChangeView={handleViewChange} />
      <ChatAssistant />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}