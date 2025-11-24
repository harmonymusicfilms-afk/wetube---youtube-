
import React, { useState, useEffect } from 'react';
import { Cookie, X } from './Icons';
import Button from './Button';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('wetube_cookie_consent');
    if (!consent) {
      // Delay showing to be less intrusive on load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('wetube_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // In a real app, this would disable non-essential cookies
    localStorage.setItem('wetube_cookie_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto bg-[#1F1F1F] border border-[#3F3F3F] rounded-xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="bg-[#2a2a2a] p-3 rounded-full shrink-0 hidden md:block">
           <Cookie className="w-6 h-6 text-wetube-red" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold mb-1 flex items-center gap-2 md:hidden">
             <Cookie className="w-5 h-5 text-wetube-red" /> Cookie Policy
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            We use cookies to enhance your experience, analyze site traffic, and personalize content. 
            By continuing to use our site, you consent to our use of cookies in accordance with our 
            <a href="#" className="text-blue-400 hover:underline ml-1">Privacy Policy</a> and 
            <a href="#" className="text-blue-400 hover:underline ml-1">Terms of Service</a>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <Button variant="ghost" size="sm" onClick={handleDecline} className="flex-1 md:flex-none">
             Decline
           </Button>
           <Button variant="primary" size="sm" onClick={handleAccept} className="flex-1 md:flex-none">
             Accept All
           </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
