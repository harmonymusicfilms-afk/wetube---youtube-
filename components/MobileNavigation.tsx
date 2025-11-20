import React from 'react';
import { Home, Compass, PlusCircle, PlaySquare, User } from './Icons';
import { View } from '../types';

interface MobileNavigationProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, onChangeView }) => {
  const NavItem = ({ 
    icon: Icon, 
    label, 
    isActive,
    onClick 
  }: { 
    icon: React.ElementType; 
    label: string; 
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-1 flex-1"
    >
      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
      <span className={`text-[10px] ${isActive ? 'text-white' : 'text-gray-400'}`}>{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-wetube-dark border-t border-[#3F3F3F] z-40 md:hidden flex items-center justify-around px-2">
      <NavItem 
        icon={Home} 
        label="Home" 
        isActive={currentView === View.HOME}
        onClick={() => onChangeView(View.HOME)}
      />
      <NavItem 
        icon={Compass} 
        label="Shorts" 
        isActive={false}
        onClick={() => {}}
      />
      <div className="flex items-center justify-center -mt-6">
        <button 
          onClick={() => onChangeView(View.STUDIO_UPLOAD)}
          className="bg-wetube-red hover:bg-red-600 rounded-full p-3 text-white shadow-lg transition-transform hover:scale-105"
        >
          <PlusCircle className="w-8 h-8" />
        </button>
      </div>
      <NavItem 
        icon={PlaySquare} 
        label="Subscriptions" 
        isActive={false}
        onClick={() => {}}
      />
      <NavItem 
        icon={User} 
        label="Library" 
        isActive={currentView === View.STUDIO_GENERATE || currentView === View.STUDIO_EDIT}
        onClick={() => onChangeView(View.STUDIO_GENERATE)}
      />
    </div>
  );
};

export default MobileNavigation;