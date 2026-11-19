import React, { useState, useRef, useEffect } from 'react';
import { 
  Pin, 
  Lock, 
  Flame, 
  ChevronRight, 
  Archive, 
  ArchiveRestore, 
  Trash2 
} from 'lucide-react';
import { Conversation } from '../data/mockData';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../utils/translation';

interface SwipeableConversationItemProps {
  convo: Conversation;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (convo: Conversation) => void;
  onArchive: (convoId: string) => void;
  onDelete: (convoId: string) => void;
  currentLanguage: LanguageCode;
}

const ACTION_BUTTONS_WIDTH = 152; // Width in px of Archive (76px) + Delete (76px)
const SWIPE_THRESHOLD = 65; // Minimum px dragged left to snap open

export const SwipeableConversationItem: React.FC<SwipeableConversationItemProps> = ({
  convo,
  isOpen,
  onOpen,
  onClose,
  onSelect,
  onArchive,
  onDelete,
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // References to track drag coordinates
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const lockDirectionRef = useRef<'none' | 'horizontal' | 'vertical'>('none');
  const wasOpenRef = useRef<boolean>(false);
  const dragDistanceRef = useRef<number>(0);

  // Sync open state from parent
  useEffect(() => {
    if (isOpen) {
      setOffsetX(-ACTION_BUTTONS_WIDTH);
    } else {
      setOffsetX(0);
    }
  }, [isOpen]);

  // Touch Event Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isExiting) return;
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    currentXRef.current = touch.clientX;
    lockDirectionRef.current = 'none';
    wasOpenRef.current = isOpen;
    dragDistanceRef.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isExiting) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startXRef.current;
    const deltaY = touch.clientY - startYRef.current;

    // Detect direction lock in early movement
    if (lockDirectionRef.current === 'none') {
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
        lockDirectionRef.current = 'vertical';
        return; // Allow standard browser vertical scroll
      } else if (Math.abs(deltaX) > 8) {
        lockDirectionRef.current = 'horizontal';
      } else {
        return;
      }
    }

    if (lockDirectionRef.current === 'vertical') return;

    // We are swiping horizontally: prevent page scroll
    if (e.cancelable) {
      e.preventDefault();
    }

    dragDistanceRef.current = Math.abs(deltaX);

    // Calculate base offset based on whether it was already open
    const baseOffset = wasOpenRef.current ? -ACTION_BUTTONS_WIDTH : 0;
    let targetOffset = baseOffset + deltaX;

    // Apply limits and resistance
    if (targetOffset > 25) {
      // Swiping right past 0: heavy resistance
      targetOffset = targetOffset * 0.2;
    } else if (targetOffset < -ACTION_BUTTONS_WIDTH - 60) {
      // Swiping left beyond the buttons: elastic resistance
      const overdrag = targetOffset - (-ACTION_BUTTONS_WIDTH);
      targetOffset = -ACTION_BUTTONS_WIDTH + overdrag * 0.3;
    }

    setOffsetX(targetOffset);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isExiting) return;
    setIsDragging(false);

    if (lockDirectionRef.current === 'vertical') {
      lockDirectionRef.current = 'none';
      return;
    }

    lockDirectionRef.current = 'none';

    // Decide whether to snap open or snap closed
    if (wasOpenRef.current) {
      // Was open: if dragged right significantly (> 35px), close it
      if (offsetX > -ACTION_BUTTONS_WIDTH + 35) {
        setOffsetX(0);
        onClose();
      } else {
        setOffsetX(-ACTION_BUTTONS_WIDTH);
        onOpen();
      }
    } else {
      // Was closed: if dragged left past threshold, snap open
      if (offsetX < -SWIPE_THRESHOLD) {
        setOffsetX(-ACTION_BUTTONS_WIDTH);
        onOpen();
      } else {
        setOffsetX(0);
        onClose();
      }
    }
  };

  // Mouse Drag Handlers for Desktop support
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExiting) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    wasOpenRef.current = isOpen;
    lockDirectionRef.current = 'none';
    dragDistanceRef.current = 0;
    setIsDragging(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      const deltaY = moveEvent.clientY - startYRef.current;

      if (lockDirectionRef.current === 'none') {
        if (Math.abs(deltaY) > 6 && Math.abs(deltaY) > Math.abs(deltaX)) {
          lockDirectionRef.current = 'vertical';
          return;
        } else if (Math.abs(deltaX) > 6) {
          lockDirectionRef.current = 'horizontal';
        }
      }

      if (lockDirectionRef.current === 'vertical') return;

      dragDistanceRef.current = Math.abs(deltaX);

      const baseOffset = wasOpenRef.current ? -ACTION_BUTTONS_WIDTH : 0;
      let targetOffset = baseOffset + deltaX;

      if (targetOffset > 25) {
        targetOffset = targetOffset * 0.2;
      } else if (targetOffset < -ACTION_BUTTONS_WIDTH - 60) {
        const overdrag = targetOffset - (-ACTION_BUTTONS_WIDTH);
        targetOffset = -ACTION_BUTTONS_WIDTH + overdrag * 0.3;
      }

      setOffsetX(targetOffset);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (lockDirectionRef.current === 'vertical') {
        lockDirectionRef.current = 'none';
        return;
      }

      lockDirectionRef.current = 'none';

      if (wasOpenRef.current) {
        if (offsetX > -ACTION_BUTTONS_WIDTH + 35) {
          setOffsetX(0);
          onClose();
        } else {
          setOffsetX(-ACTION_BUTTONS_WIDTH);
          onOpen();
        }
      } else {
        if (offsetX < -SWIPE_THRESHOLD) {
          setOffsetX(-ACTION_BUTTONS_WIDTH);
          onOpen();
        } else {
          setOffsetX(0);
          onClose();
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Row Click handling: distinguish tap from drag
  const handleClick = (e: React.MouseEvent) => {
    if (isExiting) return;

    // If drag distance was notable, don't trigger click action
    if (dragDistanceRef.current > 8) {
      e.stopPropagation();
      return;
    }

    // If currently swiped open, clicking snaps it closed
    if (isOpen) {
      e.stopPropagation();
      setOffsetX(0);
      onClose();
      return;
    }

    // Otherwise, select the conversation
    onSelect(convo);
  };

  // Trigger Archive with exit animation
  const handleTriggerArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      onArchive(convo.id);
    }, 280);
  };

  // Trigger Delete with exit animation
  const handleTriggerDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      onDelete(convo.id);
    }, 280);
  };

  const lang = SUPPORTED_LANGUAGES[convo.preferredLanguage];

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
        isExiting ? 'max-h-0 opacity-0 scale-95 pointer-events-none' : 'max-h-28 opacity-100'
      }`}
    >
      {/* Background Action Buttons revealed underneath when swiped */}
      <div 
        className="absolute inset-y-0 right-0 flex items-stretch z-0"
        style={{ width: `${ACTION_BUTTONS_WIDTH}px` }}
      >
        {/* Archive / Unarchive Action */}
        <button
          type="button"
          onClick={handleTriggerArchive}
          className="flex-1 bg-gradient-to-b from-[#2a2d3d] to-[#1e202d] hover:from-[#363a4e] hover:to-[#262939] text-indigo-300 hover:text-white flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border-l border-white/5"
          title={convo.isArchived ? "Unarchive chat" : "Archive chat"}
          aria-label={convo.isArchived ? "Unarchive chat" : "Archive chat"}
        >
          {convo.isArchived ? (
            <ArchiveRestore className="w-5 h-5 transition-transform group-hover:scale-110" />
          ) : (
            <Archive className="w-5 h-5 transition-transform group-hover:scale-110" />
          )}
          <span className="text-[10px] font-bold tracking-tight">
            {convo.isArchived ? 'Unarchive' : 'Archive'}
          </span>
        </button>

        {/* Delete Action (Instagram Red) */}
        <button
          type="button"
          onClick={handleTriggerDelete}
          className="flex-1 bg-gradient-to-b from-[#A9003D] to-[#7A002C] hover:from-[#c31258] hover:to-[#8f0033] text-white flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-lg border-l border-white/10"
          title="Delete chat"
          aria-label="Delete chat"
        >
          <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] font-bold tracking-tight">Delete</span>
        </button>
      </div>

      {/* Main Foreground Item (Slides horizontally) */}
      <div
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.24s cubic-bezier(0.2, 0.9, 0.3, 1)',
        }}
        className={`relative z-10 flex items-center gap-3.5 px-4 py-3 sm:px-6 bg-[#131313] hover:bg-[#181818] cursor-pointer transition-colors group select-none ${
          isOpen ? 'bg-[#181818]' : ''
        }`}
      >
        {/* Avatar with Online Pip & Vanish Badge */}
        <div className="relative shrink-0">
          <img
            src={convo.partnerAvatar}
            alt={convo.partnerName}
            className="w-12 h-12 rounded-full object-cover border border-[#333]"
            draggable={false}
          />
          {convo.isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#131313]" />
          )}
          {convo.isVanishMode && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#1b1b1b] border border-[#ff4d4d]/60 flex items-center justify-center text-xs shadow-md">
              🔥
            </span>
          )}
        </div>

        {/* Main Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white group-hover:text-rose-200 transition-colors truncate">
                {convo.partnerName}
              </h4>
              {convo.isPinned && (
                <Pin className="w-3 h-3 text-[#D4AF37] fill-current" />
              )}
              {convo.isArchived && (
                <span className="text-[9px] bg-neutral-800 text-neutral-400 px-1 py-0.2 rounded border border-neutral-700 font-mono">
                  ARCHIVED
                </span>
              )}
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded font-mono">
                {lang?.nativeName || 'ENG'}
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 shrink-0">
              {convo.lastMessage.time}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate">
              {convo.lastMessage.isEncrypted && (
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              )}
              {convo.isVanishMode && (
                <Flame className="w-3 h-3 text-amber-400 shrink-0" />
              )}
              <span className="truncate">
                {convo.lastMessage.text}
              </span>
            </div>

            {convo.unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E1306C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-md">
                {convo.unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Visual Swipe Hint / Chevron */}
        <div className="flex items-center shrink-0 text-neutral-600 group-hover:text-neutral-400 transition-colors">
          <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
};
