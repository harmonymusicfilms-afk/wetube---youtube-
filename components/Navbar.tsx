
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Mic, Video, Bell, User, Settings, LogOut, LayoutDashboard } from './Icons';
import { View } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigateHome: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChangeView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigateHome, searchQuery, onSearchChange, onChangeView }) => {
  const [isListening, setIsListening] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const recognitionRef = useRef<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleVoiceSearch = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onSearchChange(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleMenuClick = (view: View) => {
    onChangeView(view);
    setShowUserMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-wetube-dark z-50 flex items-center justify-between px-4 border-b border-wetube-hover">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 hover:bg-wetube-hover rounded-full">
          <Menu className="w-6 h-6 text-white" />
        </button>
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-1 cursor-pointer"
        >
          <div className="w-8 h-6 bg-wetube-red rounded-lg flex items-center justify-center">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">Wetube</span>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-[720px] ml-10">
        <div className="flex flex-1 items-center">
          <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-l-full ml-8 px-4 py-[6px]">
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent w-full focus:outline-none text-white"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button className="bg-[#222] border border-l-0 border-[#303030] px-5 py-[6px] rounded-r-full hover:bg-[#303030]">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <button 
          onClick={handleVoiceSearch}
          className={`ml-4 p-2 rounded-full hover:bg-[#303030] transition-all ${
            isListening ? 'bg-wetube-red text-white animate-pulse' : 'bg-[#181818] text-white'
          }`}
          title="Search with your voice"
        >
          <Mic className={`w-5 h-5 ${isListening ? 'text-white' : ''}`} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-wetube-hover rounded-full hidden sm:block" onClick={() => handleMenuClick(View.STUDIO_UPLOAD)}>
          <Video className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-wetube-hover rounded-full relative">
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute top-1 right-1 bg-wetube-red text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </button>
        
        <div className="relative" ref={userMenuRef}>
          <button 
            className="p-1 ml-2 hover:bg-wetube-hover rounded-full"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold border border-transparent hover:border-gray-400">
              Y
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#282828] rounded-xl shadow-2xl border border-[#3F3F3F] overflow-hidden z-50 py-2">
              <div className="px-4 py-3 border-b border-[#3F3F3F] mb-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-base font-bold">Y</div>
                <div>
                  <p className="font-bold text-white">You</p>
                  <p className="text-sm text-gray-400">@you</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleMenuClick(View.PROFILE)}
                className="w-full text-left px-4 py-2.5 hover:bg-[#3F3F3F] flex items-center gap-3 text-gray-200"
              >
                <User className="w-5 h-5" /> Your Channel
              </button>
              
              <button 
                onClick={() => handleMenuClick(View.STUDIO_DASHBOARD)}
                className="w-full text-left px-4 py-2.5 hover:bg-[#3F3F3F] flex items-center gap-3 text-gray-200"
              >
                <LayoutDashboard className="w-5 h-5" /> Creator Studio
              </button>
              
              <button 
                onClick={() => handleMenuClick(View.SETTINGS)}
                className="w-full text-left px-4 py-2.5 hover:bg-[#3F3F3F] flex items-center gap-3 text-gray-200"
              >
                <Settings className="w-5 h-5" /> Settings
              </button>
              
              <div className="my-2 border-t border-[#3F3F3F]"></div>
              
              <button 
                className="w-full text-left px-4 py-2.5 hover:bg-[#3F3F3F] flex items-center gap-3 text-gray-200"
              >
                <LogOut className="w-5 h-5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
