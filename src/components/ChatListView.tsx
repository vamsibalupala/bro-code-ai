import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Flame, 
  MessageSquarePlus,
  Lock,
  Archive,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { Conversation } from '../data/mockData';
import { LanguageCode } from '../utils/translation';
import { SwipeableConversationItem } from './SwipeableConversationItem';

interface ChatListViewProps {
  conversations: Conversation[];
  onSelectConversation: (convo: Conversation) => void;
  onNewChat: () => void;
  currentLanguage: LanguageCode;
  onArchiveConversation?: (convoId: string) => void;
  onDeleteConversation?: (convoId: string) => void;
  onRestoreConversation?: (convoId: string, previouslyArchived?: boolean) => void;
}

interface ToastNotice {
  id: string;
  convoId: string;
  partnerName: string;
  type: 'archive' | 'unarchive' | 'delete';
  message: string;
  timestamp: number;
}

export const ChatListView: React.FC<ChatListViewProps> = ({
  conversations,
  onSelectConversation,
  onNewChat,
  currentLanguage,
  onArchiveConversation,
  onDeleteConversation,
  onRestoreConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'favorites' | 'groups' | 'archived'>('all');
  const [showContactsBanner, setShowContactsBanner] = useState(true);
  const [openSwipeConvoId, setOpenSwipeConvoId] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<ToastNotice | null>(null);

  const archivedCount = conversations.filter((c) => c.isArchived).length;

  const filtered = conversations.filter((c) => {
    // If in archived filter, only show archived
    if (activeFilter === 'archived') {
      if (!c.isArchived) return false;
    } else {
      // In all other filters, hide archived conversations
      if (c.isArchived) return false;
    }

    const matchesSearch = c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return c.unreadCount > 0;
    if (activeFilter === 'favorites') return c.isPinned;
    if (activeFilter === 'groups') return c.partnerName.includes('Group') || c.partnerName.includes('Squad');
    return true;
  });

  const handleArchive = (convoId: string) => {
    const convo = conversations.find((c) => c.id === convoId);
    if (!convo) return;
    setOpenSwipeConvoId(null);

    const isCurrentlyArchived = convo.isArchived;
    if (onArchiveConversation) {
      onArchiveConversation(convoId);
    }

    // Show undo toast
    setActiveToast({
      id: `toast_${Date.now()}`,
      convoId,
      partnerName: convo.partnerName,
      type: isCurrentlyArchived ? 'unarchive' : 'archive',
      message: isCurrentlyArchived ? `Chat unarchived` : `Chat archived`,
      timestamp: Date.now(),
    });

    // Auto-dismiss after 5s
    setTimeout(() => {
      setActiveToast((curr) => (curr?.convoId === convoId ? null : curr));
    }, 5000);
  };

  const handleDelete = (convoId: string) => {
    const convo = conversations.find((c) => c.id === convoId);
    if (!convo) return;
    setOpenSwipeConvoId(null);

    if (onDeleteConversation) {
      onDeleteConversation(convoId);
    }

    // Show undo toast
    setActiveToast({
      id: `toast_${Date.now()}`,
      convoId,
      partnerName: convo.partnerName,
      type: 'delete',
      message: `Chat deleted`,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      setActiveToast((curr) => (curr?.convoId === convoId ? null : curr));
    }, 5000);
  };

  const handleUndo = () => {
    if (!activeToast) return;
    if (onRestoreConversation) {
      onRestoreConversation(activeToast.convoId, activeToast.type === 'archive');
    }
    setActiveToast(null);
  };

  return (
    <div 
      className="flex-1 flex flex-col bg-[#131313] min-h-screen relative"
      onClick={() => setOpenSwipeConvoId(null)}
    >
      {/* 48 Contacts Found on Bro Sync Banner (Matches screen_5ed9d2a6.png) */}
      {showContactsBanner && (
        <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-2xl bg-[#1e1e1e] border border-[#2e2e2e] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <span className="text-sm font-bold">✨</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">48 contacts found on Bro</p>
              <p className="text-[10px] text-neutral-400">Synced and ready to connect</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewChat}
              className="px-3 py-1 rounded-full bg-[#2a2a2a] hover:bg-[#353535] text-xs font-bold text-white border border-white/10"
            >
              View
            </button>
            <button
              onClick={() => setShowContactsBanner(false)}
              className="text-neutral-500 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Header */}
      <div className="p-4 sm:px-6 bg-[#161616] border-b border-[#262626] space-y-3 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Chats
            </h2>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> End-to-End Encrypted
            </span>
          </div>

          <button
            onClick={onNewChat}
            className="w-9 h-9 rounded-full bg-[#A9003D] hover:bg-[#c31258] text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            aria-label="New Encrypted Chat"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </button>
        </div>

        {/* Search input with pill styling per Obsidian Stream spec */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search encrypted messages or bros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1e1e] text-white placeholder-neutral-500 text-xs pl-10 pr-4 py-2.5 rounded-full border border-[#2e2e2e] focus:outline-none focus:border-[#A9003D] transition-colors"
          />
        </div>

        {/* Filter Pills with Archived count indicator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread ●' },
            { id: 'favorites', label: 'Favorites' },
            { id: 'groups', label: 'Groups' },
            ...(archivedCount > 0 ? [{ id: 'archived', label: `Archived (${archivedCount})` }] : []),
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#1f1f1f] text-neutral-400 border border-[#2d2d2d] hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subtle swipe tip banner */}
      <div className="px-4 sm:px-6 py-1.5 bg-[#141414] border-b border-[#202020] flex items-center justify-between text-[11px] text-neutral-500 select-none">
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-400">💡</span>
          <span>Swipe left on any conversation to Archive or Delete</span>
        </span>
        {archivedCount > 0 && activeFilter !== 'archived' && (
          <button
            onClick={() => setActiveFilter('archived')}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
          >
            <Archive className="w-3 h-3" />
            <span>{archivedCount} Archived</span>
          </button>
        )}
      </div>

      {/* Swipeable Conversation List Rows */}
      <div className="divide-y divide-[#222222] overflow-y-auto flex-1">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <p className="text-sm">
              {activeFilter === 'archived' 
                ? 'No archived conversations.' 
                : 'No chats found in this filter.'}
            </p>
            <p className="text-xs">
              {activeFilter === 'archived'
                ? 'Swipe left on active chats to archive them here.'
                : 'Tap + to start a new private encrypted conversation.'}
            </p>
          </div>
        ) : (
          filtered.map((convo) => (
            <SwipeableConversationItem
              key={convo.id}
              convo={convo}
              isOpen={openSwipeConvoId === convo.id}
              onOpen={() => setOpenSwipeConvoId(convo.id)}
              onClose={() => {
                if (openSwipeConvoId === convo.id) {
                  setOpenSwipeConvoId(null);
                }
              }}
              onSelect={(selected) => onSelectConversation(selected)}
              onArchive={handleArchive}
              onDelete={handleDelete}
              currentLanguage={currentLanguage}
            />
          ))
        )}
      </div>

      {/* Floating Action Button (FAB) for New Chat (Matches screen_5ed9d2a6.png) */}
      <button
        onClick={onNewChat}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 rounded-2xl bg-white text-black shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-30 border border-neutral-300"
        title="Compose New Encrypted Chat"
      >
        <span className="text-xl">✏️</span>
      </button>

      {/* Instagram-style Bottom Undo Toast */}
      {activeToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#1f1f23]/95 backdrop-blur-md border border-white/15 text-white shadow-2xl rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-2 h-2 rounded-full ${activeToast.type === 'delete' ? 'bg-rose-500' : 'bg-indigo-400'} animate-ping`} />
              <p className="text-xs font-semibold truncate text-neutral-100">
                {activeToast.message} <span className="text-neutral-400 font-normal">({activeToast.partnerName})</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleUndo}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-rose-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1 border border-white/10"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo</span>
              </button>

              <button
                onClick={() => setActiveToast(null)}
                className="text-neutral-500 hover:text-white text-xs p-1"
                aria-label="Dismiss toast"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Footer notice */}
      <div className="p-4 mt-auto text-center border-t border-[#1f1f1f] bg-[#0f0f0f]">
        <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Your personal messages and calls are end-to-end encrypted. No one outside of this chat, not even Bro, can read or listen to them.</span>
        </p>
      </div>
    </div>
  );
};
