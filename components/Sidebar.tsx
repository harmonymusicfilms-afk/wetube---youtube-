
import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Wand2, ImageIcon, Upload, FileText, Settings, LayoutDashboard, DollarSign, Smartphone, Radio, Square, Shield, BarChart2, Copyright } from './Icons';
import { View } from '../types';

interface SidebarProps {
  isOpen: boolean;
  currentView: View;
  onChangeView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onChangeView }) => {
  if (!isOpen) return null;

  const NavItem = ({ 
    icon: Icon, 
    label, 
    active,
    onClick 
  }: { 
    icon: React.ElementType; 
    label: string; 
    active?: boolean;
    onClick?: () => void;
  }) => (
    <div 
      onClick={onClick}
      className={`flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer mb-1 ${active ? 'bg-wetube-hover font-medium' : 'hover:bg-wetube-hover'}`}
    >
      <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-white'}`} />
      <span className="text-sm truncate">{label}</span>
    </div>
  );

  return (
    <aside className="fixed top-14 left-0 w-60 h-[calc(100vh-56px)] bg-wetube-dark overflow-y-auto z-40 pb-4 custom-scrollbar flex flex-col">
      <div className="p-3 flex-1">
        <NavItem 
          icon={Home} 
          label="Home" 
          active={currentView === View.HOME}
          onClick={() => onChangeView(View.HOME)}
        />
        <NavItem 
          icon={Smartphone} 
          label="Shorts" 
          active={currentView === View.SHORTS}
          onClick={() => onChangeView(View.SHORTS)}
        />
        <NavItem icon={PlaySquare} label="Subscriptions" />
        
        <div className="my-3 border-t border-[#3F3F3F]" />

        <div className="px-3 py-2 text-base font-bold">You</div>
        <NavItem 
            icon={Clock} 
            label="History" 
            active={currentView === View.HISTORY}
            onClick={() => onChangeView(View.HISTORY)}
        />
        <NavItem 
            icon={ThumbsUp} 
            label="Liked videos" 
            active={currentView === View.LIKED_VIDEOS}
            onClick={() => onChangeView(View.LIKED_VIDEOS)}
        />
        
        <div className="my-3 border-t border-[#3F3F3F]" />
        
        <div className="px-3 py-2 text-base font-bold">Creator Studio</div>
        <NavItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={currentView === View.STUDIO_DASHBOARD}
          onClick={() => onChangeView(View.STUDIO_DASHBOARD)}
        />
        <NavItem 
          icon={Square} 
          label="Content" 
          active={currentView === View.STUDIO_CONTENT}
          onClick={() => onChangeView(View.STUDIO_CONTENT)}
        />
        <NavItem 
          icon={BarChart2} 
          label="Analytics" 
          active={currentView === View.STUDIO_ANALYTICS}
          onClick={() => onChangeView(View.STUDIO_ANALYTICS)}
        />
        <NavItem 
          icon={Copyright} 
          label="Copyright" 
          active={currentView === View.STUDIO_COPYRIGHT}
          onClick={() => onChangeView(View.STUDIO_COPYRIGHT)}
        />
        <NavItem 
          icon={Radio} 
          label="Go Live" 
          active={currentView === View.STUDIO_LIVE}
          onClick={() => onChangeView(View.STUDIO_LIVE)}
        />
        <NavItem 
          icon={DollarSign} 
          label="Monetization" 
          active={currentView === View.STUDIO_MONETIZATION}
          onClick={() => onChangeView(View.STUDIO_MONETIZATION)}
        />
        <NavItem 
          icon={Upload} 
          label="Upload Video" 
          active={currentView === View.STUDIO_UPLOAD}
          onClick={() => onChangeView(View.STUDIO_UPLOAD)}
        />
        <NavItem 
          icon={FileText} 
          label="Script Generator" 
          active={currentView === View.STUDIO_SCRIPT}
          onClick={() => onChangeView(View.STUDIO_SCRIPT)}
        />
        <NavItem 
          icon={Wand2} 
          label="Thumbnail Generator" 
          active={currentView === View.STUDIO_GENERATE}
          onClick={() => onChangeView(View.STUDIO_GENERATE)}
        />
        <NavItem 
          icon={ImageIcon} 
          label="Image Editor" 
          active={currentView === View.STUDIO_EDIT}
          onClick={() => onChangeView(View.STUDIO_EDIT)}
        />

        <div className="my-3 border-t border-[#3F3F3F]" />

        <div className="px-3 py-2 text-base font-bold text-gray-400 uppercase text-xs tracking-wider">Admin</div>
        <NavItem 
          icon={Shield} 
          label="Admin Panel" 
          active={currentView === View.ADMIN_DASHBOARD}
          onClick={() => onChangeView(View.ADMIN_DASHBOARD)}
        />
      </div>

      <div className="p-3 border-t border-[#3F3F3F]">
        <NavItem 
          icon={Settings} 
          label="Settings" 
          active={currentView === View.SETTINGS}
          onClick={() => onChangeView(View.SETTINGS)}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
