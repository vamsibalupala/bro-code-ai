import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Flame, 
  Clock, 
  Lock,
  Plus
} from 'lucide-react';
import { Story } from '../data/mockData';

interface StoriesFeedViewProps {
  stories: Story[];
  onSelectStory: (index: number) => void;
  onOpenChatWithUser?: (userName: string) => void;
}

export const StoriesFeedView: React.FC<StoriesFeedViewProps> = ({
  stories,
  onSelectStory,
}) => {
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleToggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen pb-20 select-none">
      {/* Top Header */}
      <div className="p-4 sm:px-6 bg-[#161616] border-b border-[#242424] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Stories &amp; Moments</span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              24-HR VANISH
            </span>
          </h2>
          <p className="text-xs text-neutral-400">
            End-to-end encrypted ephemeral photos, audio clips, and movie reactions
          </p>
        </div>

        <button
          onClick={() => alert('Camera opened for new 24h Vanish Story')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#A9003D] hover:bg-[#c31258] text-white text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Story</span>
        </button>
      </div>

      {/* Stories Cards Stream */}
      <div className="p-4 max-w-md mx-auto w-full space-y-5">
        {stories.map((story, idx) => {
          const isLiked = !!likedMap[story.id];
          return (
            <div
              key={story.id}
              className="bg-[#1a1a1a] border border-[#282828] rounded-[24px] overflow-hidden shadow-xl"
            >
              {/* User Header */}
              <div className="p-3.5 flex items-center justify-between">
                <div
                  onClick={() => onSelectStory(idx)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]">
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      className="w-full h-full rounded-full object-cover border border-black"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                      {story.userName}
                    </h4>
                    <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-neutral-500" />
                      <span>{story.timestamp} • 🔒 E2EE</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-neutral-500 font-mono">
                  24h Vanish
                </span>
              </div>

              {/* Story Visual Media */}
              <div
                onClick={() => onSelectStory(idx)}
                className="relative aspect-[4/5] bg-neutral-900 cursor-pointer overflow-hidden group"
              >
                <img
                  src={story.mediaUrl || story.userAvatar}
                  alt="Story content"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Caption Overlay */}
                {story.caption && (
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium leading-relaxed drop-shadow-md">
                    <p className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 inline-block">
                      {story.caption}
                    </p>
                  </div>
                )}
              </div>


              {/* Interaction Bar */}
              <div className="p-3.5 flex items-center justify-between border-t border-[#242424]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(story.id)}
                    className="flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 transition-transform active:scale-125 ${
                        isLiked ? 'fill-[#E1306C] text-[#E1306C]' : 'text-neutral-400 hover:text-white'
                      }`}
                    />
                    <span className={isLiked ? 'text-[#E1306C] font-bold' : 'text-neutral-400'}>
                      {isLiked ? 'Liked' : 'Like'}
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectStory(idx)}
                    className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Quick Emoji Reactions */}
                <div className="flex items-center gap-1.5 text-sm">
                  {['🔥', '❤️', '🍿', '😂'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        handleToggleLike(story.id);
                        alert(`Sent ${emoji} to ${story.userName}`);
                      }}
                      className="hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
