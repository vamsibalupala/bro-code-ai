import React, { useState, useEffect } from 'react';
import { X, Heart, Send, Sparkles, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { Story } from '../data/mockData';
import { SUPPORTED_LANGUAGES } from '../utils/translation';

interface StoryViewerModalProps {
  story: Story | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  onClose,
  onNext,
  onPrev,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  useEffect(() => {
    if (!story) return;
    setProgress(0);
    setLiked(false);
    setReplyText('');

    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev >= 100) {
            onNext();
            return 0;
          }
          return prev + 2;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [story, isPaused, onNext]);

  if (!story) return null;

  const handleLike = () => {
    setLiked(!liked);
    const newHeart = { id: Date.now(), x: Math.random() * 80 + 10 };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    // simulated reply
    setReplyText('');
    handleLike();
  };

  const lang = SUPPORTED_LANGUAGES[story.language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4">
      <div 
        className="relative w-full max-w-sm h-[90vh] max-h-[750px] bg-[#121212] rounded-3xl overflow-hidden border border-[#262626] flex flex-col justify-between shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={story.mediaUrl}
            alt={story.userName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
        </div>

        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {floatingHearts.map((h) => (
            <div
              key={h.id}
              className="absolute bottom-20 text-rose-500 animate-float-heart text-3xl font-bold"
              style={{ left: `${h.x}%` }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Top Progress Bar & Header */}
        <div className="relative z-10 p-4">
          {/* Progress bar */}
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={story.userAvatar}
                alt={story.userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold text-sm tracking-wide">
                    {story.userName}
                  </span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full border border-rose-500/40">
                    {lang.flag}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                  <span>{story.timestamp}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" /> E2E 24h
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation tap targets (left / right half of screen) */}
        <div className="absolute inset-y-16 inset-x-0 z-0 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          />
        </div>

        {/* Bottom Caption & Reply Bar */}
        <div className="relative z-10 p-4 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
          {story.caption && (
            <p className="text-white text-sm font-medium leading-relaxed drop-shadow-md">
              {story.caption}
            </p>
          )}

          <div className="flex items-center gap-2">
            <form onSubmit={handleSendReply} className="flex-1 flex items-center">
              <input
                type="text"
                placeholder={`Reply to ${story.userName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-white/50 text-xs px-4 py-2.5 rounded-full border border-white/20 focus:outline-none focus:border-white backdrop-blur-md"
              />
            </form>

            <button
              onClick={handleLike}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-75 ${
                liked ? 'bg-rose-600 text-white' : 'bg-white/15 text-white hover:bg-white/25'
              } backdrop-blur-md`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleSendReply}
              className="w-10 h-10 rounded-full bg-[#A9003D] hover:bg-[#c31258] text-white flex items-center justify-center transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
