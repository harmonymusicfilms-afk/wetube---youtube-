import React from 'react';
import { Globe, Flag, HelpCircle } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-wetube-dark border-t border-[#3F3F3F] mt-12 py-8 px-6 text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 bg-wetube-red rounded-md flex items-center justify-center">
              <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="text-lg font-bold text-white tracking-tighter">Wetube</span>
          </div>
          <p>The next generation of video sharing powered by AI.</p>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white mb-1">About</h4>
          <a href="#" className="hover:text-white transition-colors">Press</a>
          <a href="#" className="hover:text-white transition-colors">Copyright</a>
          <a href="#" className="hover:text-white transition-colors">Creators</a>
          <a href="#" className="hover:text-white transition-colors">Advertise</a>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white mb-1">Terms</h4>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Community Guidelines</a>
          <a href="#" className="hover:text-white transition-colors">Safety</a>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-white mb-1">Support</h4>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <HelpCircle className="w-4 h-4" /> Help Center
          </div>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <Flag className="w-4 h-4" /> Report Issue
          </div>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <Globe className="w-4 h-4" /> English (US)
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-[#3F3F3F] text-center text-xs text-gray-600">
        © 2025 Wetube LLC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;