import React from 'react';
import { Plus } from 'lucide-react';
import { Story } from '../data/mockData';

interface StoriesTrayProps {
  stories: Story[];
  onSelectStory: (index: number) => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  onSelectStory,
}) => {
  return (
    <div className="bg-[#121212] border-b border-[#222222] py-3.5 px-4 overflow-x-auto no-scrollbar select-none">
      <div className="flex items-center gap-4">
        {/* Your Story (+) */}
        <div 
          onClick={() => onSelectStory(0)}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] bg-[#262626] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Your Story"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#A9003D] border-2 border-[#121212] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium tracking-tight">
            Your Story
          </span>
        </div>

        {/* Contact Stories with Instagram Gradient Ring */}
        {stories.map((story, idx) => (
          <button
            key={story.id}
            onClick={() => onSelectStory(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            <div
              className={`w-16 h-16 rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 ${
                story.hasUnseen
                  ? 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]'
                  : 'bg-[#2a2a2a]'
              }`}
            >
              <div className="w-full h-full rounded-full bg-[#121212] p-[2px]">
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] text-neutral-300 font-medium tracking-tight max-w-[68px] truncate">
              {story.userName.split('_')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
