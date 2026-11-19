import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Users, 
  Radio, 
  Mic, 
  MicOff, 
  Send, 
  Zap, 
  Film, 
  Crown,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Flame,
  Check
} from 'lucide-react';
import { WatchRoom } from '../data/mockData';

interface WatchPartyViewProps {
  room: WatchRoom;
  onOpenPro: () => void;
  isPro: boolean;
  hdWatchPasses?: number;
  onWatchAd?: () => void;
}

export const WatchPartyView: React.FC<WatchPartyViewProps> = ({
  room,
  onOpenPro,
  isPro,
  hdWatchPasses = 0,
  onWatchAd,
}) => {
  // If not pro, default to the exact "Daily Watch Hours Used!" screen from screen_6436a925.png
  // with a toggle to preview the live stream.
  const [showLiveStream, setShowLiveStream] = useState(isPro);
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [isPlaying, setIsPlaying] = useState(room.isPlaying);
  const [playbackSec, setPlaybackSec] = useState(room.currentPlaybackSec);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [partyChatInput, setPartyChatInput] = useState('');
  const [partyChatMessages, setPartyChatMessages] = useState([
    { id: '1', sender: 'Rahul Sharma', text: 'Bros, wait for the interval fight scene! 🍿🔥', time: '04:40 PM' },
    { id: '2', sender: 'Priya Reddy', text: 'Subtitles synced perfectly 👍', time: '04:41 PM' },
    { id: '3', sender: 'Arjun', text: 'Audio is so crisp on headphones 🎧', time: '04:42 PM' },
  ]);

  // Countdown timer for 12:00 AM IST
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 18, seconds: 4 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyChatInput.trim()) return;
    setPartyChatMessages((prev) => [
      ...prev,
      {
        id: `pc_${Date.now()}`,
        sender: 'You',
        text: partyChatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setPartyChatInput('');
  };

  // =========================================================================
  // SCREEN 6436a925.png: DAILY WATCH HOURS USED / BRO VIP LIMIT
  // =========================================================================
  if (!showLiveStream) {
    return (
      <div className="flex-1 flex flex-col bg-[#111111] text-white overflow-y-auto pb-24 select-none">
        
        {/* Top mini indicator pill */}
        <div className="pt-3 px-4 flex items-center justify-between">
          <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>3H / 3H WATCHED TODAY</span>
          </div>

          <button
            onClick={() => setShowLiveStream(true)}
            className="text-[11px] font-bold text-rose-400 bg-[#1f1f1f] border border-rose-500/30 px-2.5 py-1 rounded-full hover:bg-rose-950/40"
          >
            Stream &gt;
          </button>
        </div>

        {/* 3D VIP Shield Graphic */}
        <div className="flex flex-col items-center justify-center pt-4 px-4 text-center">
          <div className="relative w-28 h-28 my-2">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#4A001C] via-[#20000B] to-[#0A0004] border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[10px] text-amber-200/80 font-mono tracking-widest uppercase">BRO</span>
              <Crown className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37]/30 my-0.5" />
              <span className="text-xs font-black tracking-widest text-[#D4AF37]">VIP</span>
              <span className="text-[8px] bg-black/60 text-white/90 px-1.5 py-0.2 rounded font-mono mt-1">
                🔒 LIMIT
              </span>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <h2 className="text-2xl font-black text-white tracking-tight mt-2">
            Daily Watch Hours Used!
          </h2>
          <p className="text-xs text-neutral-300 max-w-sm mt-1.5 leading-relaxed">
            Free Bro pass includes <strong className="text-rose-300">3 hours of watch time</strong> per day. The squad is still chilling, but your daily watch time is exhausted till midnight.
          </p>
        </div>

        {/* Countdown Box */}
        <div className="mx-4 mt-5 p-4 rounded-2xl bg-[#191919] border border-[#2a2a2a] space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>NEXT FREE PASS IN</span>
            </div>
            <span className="text-[10px] bg-[#242424] text-neutral-300 px-2 py-0.5 rounded font-mono">
              Resets 12:00 AM IST
            </span>
          </div>

          {/* Countdown Blocks */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#121212] p-2 rounded-xl border border-white/5">
              <span className="text-xl font-black font-mono text-white block">
                {countdown.hours.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                HOURS
              </span>
            </div>
            <div className="bg-[#121212] p-2 rounded-xl border border-white/5">
              <span className="text-xl font-black font-mono text-white block">
                {countdown.minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                MINUTES
              </span>
            </div>
            <div className="bg-[#121212] p-2 rounded-xl border border-white/5">
              <span className="text-xl font-black font-mono text-white block">
                {countdown.seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                SECONDS
              </span>
            </div>
          </div>

          {/* Watched session note */}
          <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="truncate">
              Watched: 3h 00m of 3h quota • Kalki 2898 AD with 3 Bros
            </span>
          </div>
        </div>

        {/* Why Go VIP Comparison Table */}
        <div className="mx-4 mt-5 p-4 rounded-2xl bg-[#191919] border border-[#2a2a2a] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Why Go VIP?</h3>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider">
              INSTANT UPGRADE
            </span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-white/5">
            <div className="pt-2 flex items-center justify-between">
              <span className="text-neutral-400">Daily Watch Hours</span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">3 Hours/Day</span>
                <span className="bg-[#242424] text-rose-300 font-bold px-2 py-0.5 rounded font-mono">
                  12 HOURS/DAY
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-neutral-400">Room Capacity</span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">4 Bros Max</span>
                <span className="bg-[#242424] text-white font-bold px-2 py-0.5 rounded">
                  20 Bros (VIP)
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-neutral-400">Stream Quality</span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">720p HD</span>
                <span className="bg-[#242424] text-white font-bold px-2 py-0.5 rounded">
                  2K Quad HD
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-neutral-400">Spatial Audio</span>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">Stereo</span>
                <span className="bg-[#242424] text-white font-bold px-2 py-0.5 rounded">
                  3D Spatial + Lossless
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mx-4 mt-4 space-y-2.5">
          {/* Annual VIP Pass */}
          <div
            onClick={() => setSelectedPlan('annual')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedPlan === 'annual'
                ? 'bg-[#1e171b] border-rose-500/80 ring-1 ring-rose-500/50'
                : 'bg-[#181818] border-[#292929]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'annual' ? 'border-rose-500 bg-rose-500' : 'border-neutral-600'
                }`}>
                  {selectedPlan === 'annual' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span className="text-sm font-bold text-white">Annual VIP Pass</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">₹699</span>
                <span className="text-[10px] text-amber-300 font-bold block">₹58 / month</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pl-6">
              <span>12 hours/day watch parties 365 days</span>
              <span className="text-[9px] bg-amber-500/20 text-[#D4AF37] font-bold px-1.5 py-0.2 rounded border border-amber-500/40">
                🔥 BEST VALUE • 2 MOS FREE
              </span>
            </div>
          </div>

          {/* Monthly Pass */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-[#1e171b] border-rose-500/80 ring-1 ring-rose-500/50'
                : 'bg-[#181818] border-[#292929]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'monthly' ? 'border-rose-500 bg-rose-500' : 'border-neutral-600'
                }`}>
                  {selectedPlan === 'monthly' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <div>
                  <span className="text-sm font-bold text-white block">Monthly Pass</span>
                  <span className="text-[11px] text-neutral-400">Cancel or pause anytime</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">₹69</span>
                <span className="text-[10px] text-neutral-400 block">Per month</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mx-4 mt-5 space-y-2.5">
          <button
            type="button"
            onClick={onOpenPro}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F8719D] to-[#E1306C] hover:brightness-110 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <span>★</span>
            <span>Unlock Bro VIP for {selectedPlan === 'annual' ? '₹699 / year' : '₹69 / month'}</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Reminder scheduled for 12:00 AM IST when your watch quota resets!')}
            className="w-full py-3 rounded-full bg-[#1c1c1c] hover:bg-[#252525] text-neutral-300 text-xs font-bold border border-[#2e2e2e] transition-colors"
          >
            Remind Me Tonight at 12:00 AM
          </button>
        </div>

        {/* Payment Methods Footer */}
        <div className="text-center mt-5 text-[10px] text-neutral-500 space-y-1">
          <p className="font-mono">🛡️ UPI • GPAY • PHONEPE • PAYTM • CARDS</p>
          <p>No commitments. Single-click instant lounge access activation.</p>
        </div>

      </div>
    );
  }

  // =========================================================================
  // LIVE STREAMING VIEW WITH SYNCED CHAT & CALL
  // =========================================================================
  return (
    <div className="flex-1 flex flex-col bg-[#0e0e0e] min-h-screen text-white select-none pb-20">
      {/* Top Bar for Watch Room */}
      <div className="bg-[#161616] px-4 py-2.5 border-b border-[#242424] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white truncate">{room.movieTitle}</h3>
            <p className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
              <span>Host: {room.hostName} • 4K HDR Synced</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLiveStream(false)}
          className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-full bg-[#202020] border border-white/10"
        >
          Daily Limit View
        </button>
      </div>

      {/* Video Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        <img
          src={room.posterUrl}
          alt={room.movieTitle}
          className="w-full h-full object-cover filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

        {/* Play / Pause Overlay Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute z-10 w-14 h-14 rounded-full bg-black/60 hover:bg-[#A9003D] border border-white/20 text-white flex items-center justify-center shadow-2xl transition-all active:scale-90"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
        </button>

        {/* Live Audio Sync Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Teleparty ExoPlayer Sync</span>
        </div>
      </div>

      {/* Synchronized Party Chat */}
      <div className="flex-1 flex flex-col p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-400 border-b border-[#222] pb-1.5">
          <span>Party Chat ({room.participantsCount} Bros)</span>
          <span className="text-[10px] font-mono text-emerald-400">P2P Synced</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 min-h-[160px] max-h-[220px]">
          {partyChatMessages.map((msg) => (
            <div key={msg.id} className="text-xs bg-[#181818] p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-rose-300 font-bold">
                <span>{msg.sender}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{msg.time}</span>
              </div>
              <p className="text-neutral-200 mt-0.5">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Message watch party..."
            value={partyChatInput}
            onChange={(e) => setPartyChatInput(e.target.value)}
            className="flex-1 bg-[#1e1e1e] text-white text-xs px-3.5 py-2.5 rounded-full border border-[#333] focus:outline-none focus:border-[#A9003D]"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-[#A9003D] text-white flex items-center justify-center shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
