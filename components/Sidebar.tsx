import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Wand2, ImageIcon, Upload } from './Icons';
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
    <aside className="fixed top-14 left-0 w-60 h-[calc(100vh-56px)] bg-wetube-dark overflow-y-auto z-40 pb-4 custom-scrollbar">
      <div className="p-3">
        <NavItem 
          icon={Home} 
          label="Home" 
          active={currentView === View.HOME}
          onClick={() => onChangeView(View.HOME)}
        />
        <NavItem icon={Compass} label="Shorts" />
        <NavItem icon={PlaySquare} label="Subscriptions" />
        
        <div className="my-3 border-t border-[#3F3F3F]" />
        
        <div className="px-3 py-2 text-base font-bold">Creator Studio</div>
        <NavItem 
          icon={Upload} 
          label="Upload Video" 
          active={currentView === View.STUDIO_UPLOAD}
          onClick={() => onChangeView(View.STUDIO_UPLOAD)}
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

        <div className="px-3 py-2 text-base font-bold">You</div>
        <NavItem icon={Clock} label="History" />
        <NavItem icon={ThumbsUp} label="Liked videos" />
      </div>
    </aside>
  );
};

export default Sidebar;