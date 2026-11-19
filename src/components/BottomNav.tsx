import React from 'react';
import { 
  MessageSquare, 
  Tv, 
  Phone, 
  Layers, 
  User 
} from 'lucide-react';

export type MainTabType = 'chats' | 'watch' | 'calls' | 'stories' | 'profile';

interface BottomNavProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 2,
}) => {
  const tabs: { id: MainTabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'chats', label: 'CHATS', icon: MessageSquare },
    { id: 'watch', label: 'WATCH', icon: Tv },
    { id: 'calls', label: 'CALLS', icon: Phone },
    { id: 'stories', label: 'STORIES', icon: Layers },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-40 w-full bg-[#121212] border-t border-[#242424] px-2 py-2 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all group relative ${
              isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div className="relative">
              <Icon 
                className={`w-5 h-5 transition-transform group-active:scale-90 ${
                  isActive ? 'text-white stroke-[2.3]' : 'stroke-[1.8]'
                }`} 
              />
              {/* Unread badge on Chats */}
              {tab.id === 'chats' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#E1306C] text-[9px] font-bold text-white flex items-center justify-center border border-[#121212]">
                  {unreadCount}
                </span>
              )}
              {/* Live badge on Watch */}
              {tab.id === 'watch' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>

            <span className={`text-[10px] tracking-wider uppercase mt-1 font-semibold ${
              isActive ? 'font-bold text-white' : 'text-neutral-500'
            }`}>
              {tab.label}
            </span>

            {/* Active subtle pill dot */}
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
