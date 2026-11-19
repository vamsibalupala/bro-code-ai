import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  ShieldCheck, 
  Flame, 
  Send, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Eye, 
  MapPin, 
  Reply, 
  Smile, 
  MoreVertical, 
  Sparkles,
  Lock,
  Clock,
  CheckCheck,
  X
} from 'lucide-react';
import { Conversation, ChatMessage } from '../data/mockData';
import { SUPPORTED_LANGUAGES, COMMON_PHRASES, LanguageCode } from '../utils/translation';
import { isMessageExpired, getVanishTimeRemaining } from '../utils/crypto';
import { AudioTranscriptionModal } from './AudioTranscriptionModal';
import { ChatMapPreviewBubble, LocationShareData } from './ChatMapPreviewBubble';
import { FullScreenLiveMapModal } from './FullScreenLiveMapModal';

interface ChatRoomModalProps {
  conversation: Conversation;
  onClose: () => void;
  onOpenSecurity: () => void;
  onStartCall: (convo: Conversation) => void;
  onSendMessage: (convoId: string, message: Partial<ChatMessage>) => void;
  onToggleVanish: (convoId: string) => void;
}

const EMOJI_REACTIONS = ['❤️', '🔥', '😂', '💀', '🤙', '💯'];

export const ChatRoomModal: React.FC<ChatRoomModalProps> = ({
  conversation,
  onClose,
  onOpenSecurity,
  onStartCall,
  onSendMessage,
  onToggleVanish,
}) => {
  const [inputText, setInputText] = useState('');
  const [viewOnceEnabled, setViewOnceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeVoicePlayingId, setActiveVoicePlayingId] = useState<string | null>(null);
  const [activeViewOnceModal, setActiveViewOnceModal] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [reactionBarMessageId, setReactionBarMessageId] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [shareLocationOpen, setShareLocationOpen] = useState(false);
  const [transcribeModalOpen, setTranscribeModalOpen] = useState(false);
  const [activeFullScreenMapData, setActiveFullScreenMapData] = useState<LocationShareData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(conversation.id, {
      id: `m_${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: inputText.trim(),
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      isEncrypted: true,
      isVanish: conversation.isVanishMode,
      vanishDurationSec: conversation.isVanishMode ? 3600 : undefined,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        text: replyingTo.text,
      } : undefined,
      reactions: {},
    });

    setInputText('');
    setReplyingTo(null);
  };

  const handleSendVoiceNote = () => {
    setIsRecording(false);
    onSendMessage(conversation.id, {
      id: `m_voice_${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: 'Voice note',
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      isEncrypted: true,
      isVanish: conversation.isVanishMode,
      voiceNote: {
        durationSec: Math.max(3, recordingSeconds),
        waveform: [20, 45, 70, 90, 60, 40, 85, 95, 55, 30, 60, 40],
      },
      reactions: {},
    });
  };

  const handleSendViewOnce = () => {
    onSendMessage(conversation.id, {
      id: `m_viewonce_${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: 'View-Once Photo 📷',
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      isEncrypted: true,
      isVanish: true,
      viewOnce: true,
      viewOnceOpened: false,
      mediaUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
      reactions: {},
    });
    setViewOnceEnabled(false);
  };

  const handleSendLocation = (durationHours: number) => {
    setShareLocationOpen(false);
    onSendMessage(conversation.id, {
      id: `m_loc_${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: `Live GPS Location (${durationHours}h Timer)`,
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
      isEncrypted: true,
      isVanish: false,
      locationShare: {
        latitude: 12.9716,
        longitude: 77.5946,
        address: 'MG Road, Bengaluru (Near Metro Station)',
        etaMinutes: 12,
        distanceKm: 4.8,
        expiryTimestamp: Date.now() + durationHours * 3600000,
      },
      reactions: {},
    });
  };

  const handleDoubleTap = (e: React.MouseEvent, messageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFloatingHearts((prev) => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== Date.now()));
    }, 1200);

    // Add heart reaction to message
    handleAddReaction(messageId, '❤️');
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    // update reactions locally
    conversation.messages = conversation.messages.map((m) => {
      if (m.id === messageId) {
        const existing = m.reactions[emoji] || [];
        const hasReacted = existing.includes('You');
        const updated = hasReacted
          ? existing.filter((u) => u !== 'You')
          : [...existing, 'You'];
        return {
          ...m,
          reactions: {
            ...m.reactions,
            [emoji]: updated,
          },
        };
      }
      return m;
    });
    setReactionBarMessageId(null);
  };

  const lang = SUPPORTED_LANGUAGES[conversation.preferredLanguage];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111111] max-w-2xl mx-auto border-x border-[#262626] shadow-2xl">
      {/* Chat Room Top Bar */}
      <div className="bg-[#181818] px-4 py-2.5 border-b border-[#2a2a2a] flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#282828] text-white flex items-center justify-center transition-colors"
            aria-label="Back to chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={conversation.partnerAvatar}
              alt={conversation.partnerName}
              className="w-10 h-10 rounded-full object-cover border border-[#363636]"
            />
            {conversation.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#181818]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {conversation.partnerName}
              </h3>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono border border-rose-500/30">
                {lang.nativeName}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 flex items-center gap-1">
              <span>{conversation.lastSeen}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> Signal E2EE
              </span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Vanish Mode Switch */}
          <button
            onClick={() => onToggleVanish(conversation.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              conversation.isVanishMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'bg-[#222] text-neutral-400 hover:text-white border border-[#333]'
            }`}
            title="Toggle Vanish Mode (Disappearing Messages)"
          >
            <Flame className={`w-3.5 h-3.5 ${conversation.isVanishMode ? 'text-amber-400 animate-pulse' : ''}`} />
            <span className="text-[10px] font-bold">Vanish</span>
          </button>

          {/* Live Translation Voice Call */}
          <button
            onClick={() => onStartCall(conversation)}
            className="w-8 h-8 rounded-full bg-[#A9003D] hover:bg-[#c31258] text-white flex items-center justify-center transition-all shadow-md"
            title="Start Live Voice Call with Real-time Translation"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* Security Fingerprint */}
          <button
            onClick={onOpenSecurity}
            className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#303030] text-emerald-400 flex items-center justify-center transition-colors border border-[#363636]"
            title="Verify E2E Safety Number"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vanish Mode Banner */}
      {conversation.isVanishMode && (
        <div className="bg-gradient-to-r from-amber-950/40 via-red-950/30 to-amber-950/40 border-b border-amber-600/30 px-4 py-1.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="font-semibold">Vanish Mode Active:</span>
            <span className="text-[11px] text-amber-300/80">Seen messages disappear after 1 hour</span>
          </div>
          <button
            onClick={() => onToggleVanish(conversation.id)}
            className="text-[10px] underline hover:text-white"
          >
            Turn Off
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
        {/* End to end encryption notice box */}
        <div className="max-w-xs mx-auto p-3 rounded-2xl bg-[#181818]/90 border border-[#262626] text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Messages are End-to-End Encrypted</span>
          </div>
          <p className="text-[10px] text-neutral-400 leading-normal">
            No one outside of this chat can read or listen to them. Tap the shield icon to verify safety numbers.
          </p>
        </div>

        {conversation.messages.map((message) => {
          const hasExpired = message.isVanish && message.vanishDurationSec
            ? isMessageExpired(message.timestamp, message.vanishDurationSec)
            : false;

          return (
            <div
              key={message.id}
              className={`flex flex-col ${message.isSelf ? 'items-end' : 'items-start'} group relative`}
            >
              {/* Replying quote thread if exists */}
              {message.replyTo && (
                <div
                  className={`text-[10px] px-3 py-1 rounded-t-lg bg-[#242424] text-neutral-400 border-l-2 border-[#A9003D] max-w-xs mb-[-4px] z-0 ${
                    message.isSelf ? 'mr-2' : 'ml-2'
                  }`}
                >
                  <span className="font-bold text-white/80">{message.replyTo.senderName}:</span>{' '}
                  <span className="truncate">{message.replyTo.text}</span>
                </div>
              )}

              {/* Message Bubble (Styled according to screen_6e5b6171.png) */}
              <div
                onDoubleClick={(e) => handleDoubleTap(e, message.id)}
                className={`relative max-w-[84%] sm:max-w-md rounded-2xl px-4 py-3 shadow-md transition-all select-none ${
                  message.isSelf
                    ? 'bg-white text-black rounded-tr-sm ml-auto'
                    : 'bg-[#222222] text-neutral-100 rounded-tl-sm border border-[#303030]'
                }`}
              >
                {/* Watch Party Invitation Card (screen_6e5b6171.png) */}
                {message.watchPartyInvite ? (
                  <div className="space-y-3 p-1">
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-900 border border-white/10 shadow-lg">
                      <img
                        src={message.watchPartyInvite.posterUrl}
                        alt={message.watchPartyInvite.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-black text-amber-300 border border-amber-400/30">
                        {message.watchPartyInvite.quality}
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-rose-300 font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          <span>WATCH PARTY</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white leading-tight">
                          {message.watchPartyInvite.title}
                        </h4>
                        <p className="text-[10px] text-neutral-300">
                          Hosted by {message.watchPartyInvite.host} • {message.watchPartyInvite.joined} joined
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Joining watch party for ${message.watchPartyInvite?.title}...`)}
                      className="w-full py-2.5 rounded-full bg-white text-black hover:bg-neutral-100 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Join Watch Party</span>
                    </button>
                  </div>
                ) : message.voiceNote ? (
                  /* Voice Note Renderer with 1.5x & CC (screen_6e5b6171.png) */
                  <div className="space-y-1.5 py-1">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() =>
                          setActiveVoicePlayingId(
                            activeVoicePlayingId === message.id ? null : message.id
                          )
                        }
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          message.isSelf ? 'bg-neutral-200 text-black' : 'bg-white/20 text-white'
                        }`}
                      >
                        {activeVoicePlayingId === message.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Waveform Bars */}
                      <div className="flex items-center gap-1 h-7 flex-1">
                        {message.voiceNote.waveform.map((height, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-200 ${
                              message.isSelf
                                ? activeVoicePlayingId === message.id ? 'bg-rose-600 animate-pulse' : 'bg-neutral-400'
                                : activeVoicePlayingId === message.id ? 'bg-rose-400 animate-pulse' : 'bg-white/50'
                            }`}
                            style={{ height: `${height * 0.7}%` }}
                          />
                        ))}
                      </div>

                      {/* Speed & CC badges from screen_6e5b6171.png */}
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-neutral-300 font-mono">
                        1.5x
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/20 text-neutral-300 font-mono">
                        CC
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] opacity-70 font-mono px-1">
                      <span>0:14 / 0:{message.voiceNote.durationSec.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                ) : message.viewOnce ? (
                  /* View-Once Media Renderer */
                  <div
                    onClick={() => {
                      if (!message.viewOnceOpened) {
                        setActiveViewOnceModal(message.mediaUrl || null);
                        message.viewOnceOpened = true;
                      }
                    }}
                    className={`flex items-center gap-2.5 py-2 px-3 rounded-xl cursor-pointer border ${
                      message.viewOnceOpened
                        ? 'bg-black/30 border-white/10 text-neutral-500'
                        : 'bg-white/10 hover:bg-white/20 border-white/30 text-white animate-pulse'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#A9003D] text-white flex items-center justify-center font-bold text-xs border border-white/40">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-bold">
                        {message.viewOnceOpened ? 'Photo Opened (Burned)' : 'View-Once Photo'}
                      </p>
                      <p className="text-[10px] opacity-70">
                        {message.viewOnceOpened
                          ? 'Self-destructed after 1 view'
                          : 'Tap to view • Disappears after view'}
                      </p>
                    </div>
                  </div>
                ) : message.locationShare ? (
                  /* Live Location Bubble with Interactive Google Maps Mini Preview */
                  <ChatMapPreviewBubble
                    locationShare={message.locationShare}
                    partnerName={message.isSelf ? 'You' : conversation.partnerName}
                    partnerAvatar={message.isSelf ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' : conversation.partnerAvatar}
                    onOpenFullScreen={() => setActiveFullScreenMapData(message.locationShare!)}
                    isSelf={message.isSelf}
                  />
                ) : (
                  /* Standard Text Message with optional auto-translation card */
                  <div className="space-y-1.5">
                    <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${message.isSelf ? 'text-black font-medium' : 'text-white'}`}>
                      {message.text}
                    </p>

                    {/* Auto-Translated Card (screen_6e5b6171.png) */}
                    {message.translatedText && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-neutral-300 space-y-1 mt-1.5">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-rose-300 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-rose-400" />
                          <span>AUTO-TRANSLATED (HINDI → EN)</span>
                        </div>
                        <p className="text-xs italic text-neutral-200 font-serif">
                          “{message.translatedText}”
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Row: Timestamp, Vanish Indicator, E2E checkmark */}
                <div className="flex items-center justify-end gap-1 text-[10px] opacity-70 mt-1">
                  {message.isVanish && (
                    <span className="flex items-center gap-0.5 text-amber-300">
                      <Flame className="w-2.5 h-2.5" />
                      {message.vanishDurationSec && (
                        <span>
                          {getVanishTimeRemaining(message.timestamp, message.vanishDurationSec)}
                        </span>
                      )}
                    </span>
                  )}
                  <span>{message.timeFormatted}</span>
                  {message.isSelf && (
                    <CheckCheck className="w-3.5 h-3.5 text-rose-300" />
                  )}
                </div>

                {/* Floating Reaction Bar on Hover / Tap */}
                <button
                  onClick={() =>
                    setReactionBarMessageId(
                      reactionBarMessageId === message.id ? null : message.id
                    )
                  }
                  className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#242424] hover:bg-[#333] text-neutral-300 rounded-full p-1 border border-[#3e3e3e] shadow"
                  title="React with Emoji"
                >
                  <Smile className="w-3 h-3" />
                </button>

                {reactionBarMessageId === message.id && (
                  <div className="absolute -top-10 right-0 bg-[#222] border border-[#383838] rounded-full px-2 py-1 flex items-center gap-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-90">
                    {EMOJI_REACTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(message.id, emoji)}
                        className="text-base hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setReplyingTo(message);
                        setReactionBarMessageId(null);
                      }}
                      className="ml-1 text-neutral-400 hover:text-white"
                      title="Reply"
                    >
                      <Reply className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Displayed emoji reactions pill below message */}
              {Object.keys(message.reactions).length > 0 && (
                <div
                  className={`flex items-center gap-1 mt-1 ${
                    message.isSelf ? 'mr-1' : 'ml-1'
                  }`}
                >
                  {Object.entries(message.reactions).map(([emoji, users]) =>
                    users.length > 0 ? (
                      <span
                        key={emoji}
                        className="bg-[#202020] border border-[#333] text-[11px] px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm"
                      >
                        <span>{emoji}</span>
                        {users.length > 1 && (
                          <span className="text-[9px] text-white/70 font-bold">
                            {users.length}
                          </span>
                        )}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Replying Banner if active */}
      {replyingTo && (
        <div className="bg-[#1c1c1c] px-4 py-2 border-t border-[#2a2a2a] flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <Reply className="w-3.5 h-3.5 text-rose-400" />
            <div>
              <span className="font-bold text-white">Replying to {replyingTo.senderName}:</span>{' '}
              <span className="text-neutral-400 truncate max-w-xs">{replyingTo.text}</span>
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-neutral-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Localized Phrase suggestions */}
      <div className="bg-[#151515] px-3 py-1.5 border-t border-[#222] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider shrink-0">
          Quick {lang.nativeName}:
        </span>
        {[
          COMMON_PHRASES.dont_care[conversation.preferredLanguage],
          COMMON_PHRASES.greeting[conversation.preferredLanguage],
          COMMON_PHRASES.watch_invite[conversation.preferredLanguage],
          'Bro 🔥',
          'Pakka 🤙',
        ].map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(phrase)}
            className="bg-[#202020] hover:bg-[#2c2c2c] text-neutral-300 text-[11px] px-2.5 py-1 rounded-full border border-[#2d2d2d] shrink-0 transition-colors"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Composer Input Bar */}
      <div className="p-3 bg-[#181818] border-t border-[#282828] space-y-2">
        {/* Attachment Options Toolbar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {/* View Once Toggle */}
            <button
              onClick={() => handleSendViewOnce()}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${
                viewOnceEnabled
                  ? 'bg-[#A9003D] text-white border-rose-400'
                  : 'bg-[#222] text-neutral-400 border-[#333] hover:text-white'
              }`}
              title="Send View Once Media"
            >
              <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px]">1</span>
              <span>View-Once Photo</span>
            </button>

            {/* Live Location Share Button */}
            <button
              onClick={() => setShareLocationOpen(!shareLocationOpen)}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#222] hover:bg-[#2d2d2d] text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-all"
            >
              <MapPin className="w-3 h-3" />
              <span>Share Live GPS</span>
            </button>

            {/* Audio Transcription Button */}
            <button
              onClick={() => setTranscribeModalOpen(true)}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#222] hover:bg-[#2d2d2d] text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-all"
              title="Transcribe Audio with Gemini"
            >
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Transcribe Audio</span>
            </button>
          </div>

          <span className="text-[10px] text-neutral-500 font-mono">
            {conversation.isVanishMode ? '🔥 Vanish: 1h' : '🔒 E2EE'}
          </span>
        </div>

        {/* Location duration selector drawer */}
        {shareLocationOpen && (
          <div className="bg-[#202020] p-2.5 rounded-2xl border border-[#333] flex items-center justify-between text-xs animate-in fade-in">
            <span className="font-semibold text-white text-[11px]">Share real-time GPS for:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSendLocation(0.25)}
                className="px-2.5 py-1 rounded-full bg-[#2b2b2b] hover:bg-emerald-600 text-neutral-200 hover:text-white text-[10px] font-bold transition-colors"
              >
                15 Mins
              </button>
              <button
                onClick={() => handleSendLocation(1)}
                className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold"
              >
                1 Hour (Standard)
              </button>
              <button
                onClick={() => handleSendLocation(8)}
                className="px-2.5 py-1 rounded-full bg-[#2b2b2b] hover:bg-emerald-600 text-neutral-200 hover:text-white text-[10px] font-bold transition-colors"
              >
                8 Hours
              </button>
            </div>
          </div>
        )}

        {/* Text Input & Voice Recorder */}
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {isRecording ? (
            <div className="flex-1 bg-red-950/40 border border-red-500/40 rounded-full px-4 py-2 flex items-center justify-between text-rose-300 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold">Recording Voice Note...</span>
              </div>
              <span className="text-xs font-mono font-bold">0:{recordingSeconds.toString().padStart(2, '0')}</span>
            </div>
          ) : (
            <input
              type="text"
              placeholder={`Encrypted message to ${conversation.partnerName.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#222222] text-white placeholder-neutral-500 text-xs px-4 py-2.5 rounded-full border border-[#333] focus:outline-none focus:border-[#A9003D] transition-colors"
            />
          )}

          {isRecording ? (
            <button
              type="button"
              onClick={handleSendVoiceNote}
              className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all shadow-md active:scale-90"
              title="Finish & Send Voice Note"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : inputText.trim() ? (
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#A9003D] hover:bg-[#c31258] text-white flex items-center justify-center transition-all shadow-md active:scale-90"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-[#383838] text-white flex items-center justify-center transition-all shadow-md active:scale-90"
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4 text-rose-400" />
            </button>
          )}
        </form>
      </div>

      {/* View-Once Photo Viewer Modal */}
      {activeViewOnceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="relative max-w-sm w-full bg-[#181818] rounded-3xl overflow-hidden border border-[#333] p-4 text-center space-y-4">
            <button
              onClick={() => setActiveViewOnceModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-black">
              <img
                src={activeViewOnceModal}
                alt="View Once"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-2 bg-red-950/40 border border-red-500/30 rounded-xl text-rose-300 text-xs font-semibold">
              ⚠️ Photo self-destructs upon closing this dialog. Screenshots are blocked by DRM.
            </div>

            <button
              onClick={() => setActiveViewOnceModal(null)}
              className="w-full py-2.5 rounded-full bg-[#A9003D] text-white text-xs font-bold hover:bg-[#c31258] transition-colors"
            >
              Close & Burn Photo
            </button>
          </div>
        </div>
      )}

      {/* Audio Voice Transcription Modal */}
      {transcribeModalOpen && (
        <AudioTranscriptionModal
          onClose={() => setTranscribeModalOpen(false)}
          onInsertTranscription={(text) => {
            setInputText((prev) => (prev ? `${prev} ${text}` : text));
          }}
          preferredLanguage={conversation.preferredLanguage}
        />
      )}

      {/* Full-Screen Dynamic GPS Tracking View Modal */}
      {activeFullScreenMapData && (
        <FullScreenLiveMapModal
          locationShare={activeFullScreenMapData}
          partnerName={conversation.partnerName}
          partnerAvatar={conversation.partnerAvatar}
          onClose={() => setActiveFullScreenMapData(null)}
          onStartCall={() => {
            setActiveFullScreenMapData(null);
            onStartCall(conversation);
          }}
        />
      )}
    </div>
  );
};

