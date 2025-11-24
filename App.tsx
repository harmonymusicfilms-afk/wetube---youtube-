
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import AuthPage from './components/AuthPage';
import CookieConsent from './components/CookieConsent';
import CategoryPills from './components/CategoryPills';
import ErrorBoundary from './components/ErrorBoundary';
import AnalyticsTracker from './components/AnalyticsTracker';
import VideoGrid from './components/VideoGrid';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CATEGORIES } from './constants';
import { View, Video } from './types';
import { Loader2, Clock, ThumbsUp } from './components/Icons';
import { VideoAPI } from './services/api';

// Lazy Load Pages for Performance Optimization
const ThumbnailGenerator = React.lazy(() => import('./components/Studio/ThumbnailGenerator'));
const ImageEditor = React.lazy(() => import('./components/Studio/ImageEditor'));
const VideoUploader = React.lazy(() => import('./components/Studio/VideoUploader'));
const ScriptGenerator = React.lazy(() => import('./components/Studio/ScriptGenerator'));
const StudioDashboard = React.lazy(() => import('./components/Studio/StudioDashboard'));
const ContentManager = React.lazy(() => import('./components/Studio/ContentManager'));
const Monetization = React.lazy(() => import('./components/Studio/Monetization'));
const LiveDashboard = React.lazy(() => import('./components/Studio/LiveDashboard'));
const CopyrightManager = React.lazy(() => import('./components/Studio/Copyright'));
const Analytics = React.lazy(() => import('./components/Studio/Analytics'));
const AdminDashboard = React.lazy(() => import('./components/Admin/AdminDashboard'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const Settings = React.lazy(() => import('./components/Settings'));
const ShortsFeed = React.lazy(() => import('./components/ShortsFeed'));
const HelpCenter = React.lazy(() => import('./components/HelpCenter'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="w-10 h-10 text-wetube-red animate-spin" />
  </div>
);

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  // Video Data State
  const [videos, setVideos] = useState<Video[]>([]);
  const [historyVideos, setHistoryVideos] = useState<Video[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Initial Fetch & Filter Effect
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchVideos = async () => {
      setIsLoadingVideos(true);
      try {
        if (currentView === View.HOME) {
            const data = await VideoAPI.getAll({
                query: searchQuery,
                category: selectedCategory
            });
            setVideos(data);
        } else if (currentView === View.HISTORY) {
            const data = await VideoAPI.getHistory();
            setHistoryVideos(data);
        } else if (currentView === View.LIKED_VIDEOS) {
            const data = await VideoAPI.getLiked();
            setLikedVideos(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos", error);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchVideos();
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, searchQuery, selectedCategory, currentView]);


  if (authLoading) {
    return (
      <div className="min-h-screen bg-wetube-dark flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-wetube-red animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setCurrentView(View.WATCH);
  };

  const handleNavigateHome = () => {
    setCurrentView(View.HOME);
    setSelectedVideo(null);
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    if (view !== View.WATCH) {
      setSelectedVideo(null);
    }
  };

  const handleVideoPublished = (newVideo: Video) => {
    // We don't strictly need to update state manually if we refetch on view change,
    // but for immediate feedback when switching to HOME:
    setVideos([newVideo, ...videos]);
    setCurrentView(View.HOME);
  };

  // Helper to decide if we need side padding
  const isShortsView = currentView === View.SHORTS;
  const isLiveDashboard = currentView === View.STUDIO_LIVE;
  const isContentManager = currentView === View.STUDIO_CONTENT;
  const isAdminDashboard = currentView === View.ADMIN_DASHBOARD;
  const isAnalytics = currentView === View.STUDIO_ANALYTICS;
  const isCopyright = currentView === View.STUDIO_COPYRIGHT;

  // Views that take full height/custom layout
  const isSpecialView = isShortsView || isLiveDashboard || isContentManager || isAdminDashboard || isAnalytics || isCopyright;

  return (
    <div className="min-h-screen bg-wetube-dark text-white font-sans">
      <AnalyticsTracker view={currentView} />
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNavigateHome={handleNavigateHome}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onChangeView={handleViewChange}
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
        {/* Special views usually take full screen or handle their own layout structure */}
        <div className={`flex-1 ${isSpecialView ? 'bg-[#121212]' : 'container mx-auto pb-16 md:pb-0'}`}>
          <Suspense fallback={<LoadingSpinner />}>
            {currentView === View.HOME && (
              <>
                <div className="px-6">
                  <CategoryPills 
                    categories={CATEGORIES} 
                    selectedCategory={selectedCategory} 
                    onSelectCategory={setSelectedCategory} 
                  />
                </div>
                
                {isLoadingVideos ? (
                   <div className="flex justify-center py-20">
                      <Loader2 className="w-10 h-10 text-wetube-red animate-spin" />
                   </div>
                ) : (
                  <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4">
                    {videos.length > 0 ? (
                      videos.map((video) => (
                        <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 mt-10">
                        <p>No videos found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            {currentView === View.HISTORY && (
                <VideoGrid 
                    videos={historyVideos} 
                    title="Watch History" 
                    icon={Clock} 
                    onVideoClick={handleVideoClick}
                    isLoading={isLoadingVideos}
                    emptyMessage="You haven't watched any videos yet."
                />
            )}

            {currentView === View.LIKED_VIDEOS && (
                <VideoGrid 
                    videos={likedVideos} 
                    title="Liked Videos" 
                    icon={ThumbsUp} 
                    onVideoClick={handleVideoClick}
                    isLoading={isLoadingVideos}
                    emptyMessage="Videos you like will appear here."
                />
            )}

            {currentView === View.WATCH && selectedVideo && (
              <VideoPlayer video={selectedVideo} />
            )}

            {currentView === View.SHORTS && <ShortsFeed />}
            
            {currentView === View.PROFILE && <UserProfile />}
            
            {currentView === View.SETTINGS && <Settings />}

            {currentView === View.STUDIO_DASHBOARD && <StudioDashboard />}

            {currentView === View.STUDIO_CONTENT && <ContentManager />}
            
            {currentView === View.STUDIO_ANALYTICS && <Analytics />}

            {currentView === View.STUDIO_COPYRIGHT && <CopyrightManager />}
            
            {currentView === View.STUDIO_LIVE && <LiveDashboard />}

            {currentView === View.ADMIN_DASHBOARD && <AdminDashboard />}

            {currentView === View.STUDIO_MONETIZATION && <Monetization />}

            {currentView === View.STUDIO_GENERATE && (
              <div className="px-6"><ThumbnailGenerator /></div>
            )}

            {currentView === View.STUDIO_EDIT && (
              <div className="px-6"><ImageEditor /></div>
            )}

            {currentView === View.STUDIO_UPLOAD && (
              <div className="px-6"><VideoUploader onVideoPublished={handleVideoPublished} /></div>
            )}

            {currentView === View.STUDIO_SCRIPT && (
              <div className="px-6"><ScriptGenerator /></div>
            )}

            {currentView === View.HELP && <HelpCenter />}
          </Suspense>
        </div>

        {!isSpecialView && <Footer />}
      </main>

      <MobileNavigation currentView={currentView} onChangeView={handleViewChange} />
      <CookieConsent />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
