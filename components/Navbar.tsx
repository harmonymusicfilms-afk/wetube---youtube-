import React, { useState, useRef } from 'react';
import { Menu, Search, Mic, Video, Bell } from './Icons';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigateHome: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigateHome, searchQuery, onSearchChange }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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
        <button className="p-2 hover:bg-wetube-hover rounded-full hidden sm:block">
          <Video className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-wetube-hover rounded-full relative">
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute top-1 right-1 bg-wetube-red text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </button>
        <button className="p-2 hover:bg-wetube-hover rounded-full">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
            U
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;