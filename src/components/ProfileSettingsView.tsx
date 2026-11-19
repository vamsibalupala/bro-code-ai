import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Moon, 
  Globe, 
  Bell, 
  Shield, 
  ShieldCheck, 
  Crown, 
  MapPin, 
  Flame, 
  Sparkles, 
  Check, 
  Lock, 
  Save, 
  RotateCcw, 
  Award, 
  Camera, 
  Volume2, 
  Mic, 
  Smartphone,
  ExternalLink,
  Play,
  Pause,
  Disc,
  Trash2,
  Download,
  FileAudio
} from 'lucide-react';
import { ThemeMode, THEME_CONFIGS } from '../utils/theme';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../utils/translation';
import { evaluateAdImpressionQuota, AdImpressionRecord, MAX_DAILY_REWARDED_ADS } from '../utils/admob';

interface UserProfile {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  avatar: string;
  e2eKeyId: string;
}

interface ProfileSettingsViewProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isPro: boolean;
  onOpenPro: () => void;
  onWatchAd: () => void;
  adHistory: AdImpressionRecord[];
  hdWatchPasses: number;
  bonusTranslationSeconds: number;
  onOpenCodeStudio: () => void;
}

interface SavedRecordingItem {
  id: string;
  fileName: string;
  partnerName: string;
  partnerAvatar: string;
  timestamp: number;
  dateFormatted: string;
  durationSeconds: number;
  durationFormatted: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  isVideo: boolean;
  encryptionKeyFingerprint: string;
}

const INITIAL_RECORDINGS: SavedRecordingItem[] = [
  {
    id: 'rec_01',
    fileName: 'bro_enc_20261112_144510.brorec',
    partnerName: 'Rahul Sharma',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    timestamp: Date.now() - 25 * 60 * 1000,
    dateFormatted: 'Nov 12, 2:45 PM',
    durationSeconds: 252,
    durationFormatted: '04:12',
    fileSizeBytes: 3984576,
    fileSizeFormatted: '3.8 MB',
    isVideo: false,
    encryptionKeyFingerprint: 'BRO-KEY-A900-3D1F',
  },
  {
    id: 'rec_02',
    fileName: 'bro_enc_20261111_094722.brorec',
    partnerName: 'Priya Reddy',
    partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    timestamp: Date.now() - 86400 * 1000 - 3600 * 1000,
    dateFormatted: 'Nov 11, 9:47 AM',
    durationSeconds: 587,
    durationFormatted: '09:47',
    fileSizeBytes: 18432000,
    fileSizeFormatted: '17.6 MB',
    isVideo: true,
    encryptionKeyFingerprint: 'BRO-KEY-B821-C994',
  },
  {
    id: 'rec_03',
    fileName: 'bro_enc_20261110_201530.brorec',
    partnerName: 'Kavitha Chennai',
    partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    timestamp: Date.now() - 2 * 86400 * 1000,
    dateFormatted: 'Nov 10, 8:15 PM',
    durationSeconds: 138,
    durationFormatted: '02:18',
    fileSizeBytes: 2184000,
    fileSizeFormatted: '2.1 MB',
    isVideo: false,
    encryptionKeyFingerprint: 'BRO-KEY-10E4-F702',
  },
];


export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  currentTheme,
  onThemeChange,
  currentLanguage,
  onLanguageChange,
  isPro,
  onOpenPro,
  onWatchAd,
  adHistory,
  hdWatchPasses,
  bonusTranslationSeconds,
  onOpenCodeStudio,
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Arjun Bro',
    tagline: "I DON'T CARE",
    phone: '+91 98765 43210',
    email: 'arjun.bro@e2ee.local',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    e2eKeyId: 'bro_sec_49201a88b',
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'privacy' | 'recordings' | 'notifications' | 'billing'>('profile');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Saved recordings state & playback
  const [recordings, setRecordings] = useState<SavedRecordingItem[]>(INITIAL_RECORDINGS);
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  // Handle active audio playback tick
  React.useEffect(() => {
    let interval: any;
    if (playingRecordingId) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => {
          const rec = recordings.find((r) => r.id === playingRecordingId);
          if (rec && prev >= rec.durationSeconds) {
            setPlayingRecordingId(null);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playingRecordingId, recordings]);

  const handleTogglePlayRecording = (rec: SavedRecordingItem) => {
    if (playingRecordingId === rec.id) {
      setPlayingRecordingId(null);
    } else {
      setPlayingRecordingId(rec.id);
      setPlaybackSeconds(0);
    }
  };

  const handleDeleteRecording = (id: string) => {
    if (playingRecordingId === id) {
      setPlayingRecordingId(null);
    }
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  // Privacy states
  const [defaultLocationTimer, setDefaultLocationTimer] = useState<'15m' | '1h' | '8h'>('1h');
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeenPrivacy, setLastSeenPrivacy] = useState<'everyone' | 'contacts' | 'nobody'>('contacts');
  const [defaultVanishDuration, setDefaultVanishDuration] = useState<'off' | '15m' | '1h' | '24h'>('1h');

  // Notification states
  const [notifyChats, setNotifyChats] = useState(true);
  const [notifyWatchParties, setNotifyWatchParties] = useState(true);
  const [notifyLocation, setNotifyLocation] = useState(true);
  const [soundVibration, setSoundVibration] = useState(true);

  const adQuota = evaluateAdImpressionQuota(adHistory);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen text-white">
      {/* Top Header Banner */}
      <div className="p-4 sm:px-6 bg-[#161616] border-b border-[#262626] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Profile & Settings</span>
              {isPro && (
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  PRO VIP
                </span>
              )}
            </h2>
            <p className="text-xs text-neutral-400">
              Manage your identity, theme, language, privacy, and RevenueCat subscription
            </p>
          </div>
        </div>

        {/* Saved confirmation toast */}
        {isSavedNotice && (
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40 animate-pulse flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Changes Saved
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Settings Navigation Tabs */}
        <div className="w-full md:w-64 bg-[#141414] border-b md:border-b-0 md:border-r border-[#262626] p-3 space-y-1 overflow-x-auto md:overflow-visible flex md:flex-col gap-1 shrink-0">
          {[
            { id: 'profile', label: 'User Profile', icon: User },
            { id: 'recordings', label: 'Saved Recordings', icon: Disc, count: recordings.length },
            { id: 'theme', label: 'Dark Mode Theme', icon: Moon },
            { id: 'privacy', label: 'Privacy & GPS', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'billing', label: 'Subscriptions (RevenueCat)', icon: Crown },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#A9003D]/25 border border-[#A9003D]/60 text-white font-bold shadow'
                    : 'text-neutral-400 hover:text-white hover:bg-[#1f1f1f] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-rose-500 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#262626] mt-auto hidden md:block">
            <button
              onClick={onOpenCodeStudio}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 transition-colors font-mono"
            >
              <Smartphone className="w-4 h-4" />
              <span>Android Java & XML Code</span>
            </button>
          </div>
        </div>

        {/* Settings Tab Content */}
        <div className="flex-1 p-4 sm:p-6 max-w-2xl overflow-y-auto">
          {/* 1. Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Avatar Selector */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                  Profile Avatar
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#A9003D]"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#A9003D] text-white flex items-center justify-center border-2 border-[#181818]">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">Choose Profile Picture</p>
                    <div className="flex items-center gap-2 mt-2">
                      {sampleAvatars.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Avatar option"
                          onClick={() => setProfile({ ...profile, avatar: url })}
                          className={`w-8 h-8 rounded-full object-cover cursor-pointer border hover:scale-110 transition-transform ${
                            profile.avatar === url ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50' : 'border-[#333]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name & Tagline */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-[#222] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#333] focus:outline-none focus:border-[#A9003D]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-300 block mb-1">
                    Bro Status / Tagline
                  </label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="w-full bg-[#222] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#333] focus:outline-none focus:border-[#A9003D]"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">
                    Default: "I DON'T CARE" (Official Bro Tagline)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Phone Number (OTP Verification)
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-[#222] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#333] focus:outline-none focus:border-[#A9003D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-300 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-[#222] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#333] focus:outline-none focus:border-[#A9003D]"
                    />
                  </div>
                </div>

                {/* E2EE Key Identity Fingerprint */}
                <div className="pt-2 border-t border-[#262626]">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <Lock className="w-3 h-3" /> E2EE Device Key ID
                    </span>
                    <span className="font-mono text-neutral-300">{profile.e2eKeyId}</span>
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-white">Preferred Native Language</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">5 Supported</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]).map((code) => {
                    const l = SUPPORTED_LANGUAGES[code];
                    const isSelected = currentLanguage === code;
                    return (
                      <button
                        type="button"
                        key={code}
                        onClick={() => onLanguageChange(code)}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-[#A9003D]/25 border-rose-500/80 shadow'
                            : 'bg-[#222] border-[#333] hover:border-[#444]'
                        }`}
                      >
                        <p className="text-xs font-bold text-white">{l.nativeName}</p>
                        <p className="text-[10px] text-neutral-400">{l.label} • {l.flag}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#A9003D] hover:bg-[#c31258] text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* 2. Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Android Dark Mode Color Palette
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Toggle between the official Bro Obsidian dark theme palettes using native surfaces (#151515, #292929), deep burgundy header gradients (#A9003D, #7D002D, #4A001C), and gold PRO accents.
                </p>
              </div>

              <div className="space-y-3">
                {(Object.keys(THEME_CONFIGS) as ThemeMode[]).map((mode) => {
                  const cfg = THEME_CONFIGS[mode];
                  const isSelected = currentTheme === mode;
                  return (
                    <div
                      key={mode}
                      onClick={() => onThemeChange(mode)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1e1e1e] border-[#A9003D] shadow-lg ring-1 ring-[#A9003D]'
                          : 'bg-[#161616] border-[#292929] hover:border-[#383838]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Moon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-neutral-400'}`} />
                          <h4 className="text-sm font-bold text-white">{cfg.name}</h4>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                            Active Theme
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-400 mb-3">{cfg.description}</p>

                      {/* Swatch Preview Bar */}
                      <div className="h-6 rounded-lg overflow-hidden flex items-center border border-white/10">
                        <div className="w-1/4 h-full bg-[#151515] flex items-center justify-center text-[9px] font-mono text-neutral-400">#151515</div>
                        <div className="w-1/4 h-full bg-[#292929] flex items-center justify-center text-[9px] font-mono text-neutral-400">#292929</div>
                        <div className="w-1/4 h-full bg-gradient-to-r from-[#4A001C] via-[#7D002D] to-[#A9003D] flex items-center justify-center text-[9px] font-mono text-rose-200">#A9003D</div>
                        <div className="w-1/4 h-full bg-[#D4AF37] flex items-center justify-center text-[9px] font-mono text-black font-bold">#D4AF37</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Android XML Theme specification notice */}
              <div className="p-3 bg-[#161616] border border-[#2a2a2a] rounded-xl text-[11px] text-neutral-400 font-mono space-y-1">
                <p className="text-emerald-400 font-bold">Android Resource Mapping:</p>
                <p>• res/values/colors.xml: surface_charcoal (#151515), surface_elevated (#292929)</p>
                <p>• res/values/themes.xml: Theme.Bro.DarkBurgundy</p>
                <p>• Java Controller: AppCompatDelegate.setDefaultNightMode()</p>
              </div>
            </div>
          )}

          {/* 3. Privacy & GPS Tab (Matches Bro Shield in screen_e3ed946f.png) */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              {/* Bro Shield Hero Card (screen_e3ed946f.png) */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-[#1c181a] via-[#161616] to-[#121212] border border-rose-500/30 space-y-4 shadow-xl">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-500/50 flex items-center justify-center text-rose-300 shadow-xl">
                      <Shield className="w-8 h-8 fill-rose-500/20" />
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#121212]" />
                  </div>

                  <span className="text-[11px] font-black tracking-widest uppercase bg-black/60 text-white px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    PROTECTED &amp; ENCRYPTED
                  </span>

                  <p className="text-xs text-neutral-400 max-w-sm">
                    All firewalls, anti-snoop tunnels, and network trackers are running automatically in the background.
                  </p>
                </div>

                {/* Background Auto-Defense Switch */}
                <div className="p-3.5 rounded-2xl bg-[#1e1e1e] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-rose-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Background Auto-Defense</p>
                      <p className="text-[10px] text-neutral-400">Silent Real-time Protection</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-[#A9003D] cursor-pointer"
                  />
                </div>

                {/* 4 Active Silent Background Defenses */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                    <span>Active in Background</span>
                    <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full text-[9px]">4 Running Silently</span>
                  </div>

                  {[
                    { name: 'Auto-Firewall & WireGuard Tunnel', desc: 'Running silently • Zero packet loss', icon: '🌐' },
                    { name: 'Anti-Tracking & DNS Cloak', desc: '1,420 trackers blocked today', icon: '🛡️' },
                    { name: 'Quantum E2E Call & Chat Encryption', desc: 'MLS v1.0 standard • Always active', icon: '🔒' },
                    { name: 'OS Integrity & Tamper Defense', desc: 'Hardware keystore verified clean', icon: '⚙️' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{item.icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-white">{item.name}</p>
                          <p className="text-[10px] text-neutral-400">{item.desc}</p>
                        </div>
                      </div>
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* GPS Location Sharing Timer */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Default Live GPS Location Timer</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">End-to-End Encrypted</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '15m', label: '15 Minutes' },
                    { id: '1h', label: '1 Hour (Standard)' },
                    { id: '8h', label: '8 Hours (Pro)' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setDefaultLocationTimer(tier.id as any)}
                      className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                        defaultLocationTimer === tier.id
                          ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 shadow'
                          : 'bg-[#222] text-neutral-400 border-[#333] hover:text-white'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disappearing Messages Duration (screen_e3ed946f.png) */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Disappearing Messages</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">Default lifetime</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'off', label: 'Off' },
                    { id: '15m', label: 'Read' },
                    { id: '1h', label: '1 Hour' },
                    { id: '24h', label: '24 Hours' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setDefaultVanishDuration(v.id as any)}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${
                        defaultVanishDuration === v.id
                          ? 'bg-white text-black font-bold shadow'
                          : 'bg-[#222] text-neutral-400 border-[#333] hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* App Lock & Screen Privacy Switches (screen_e3ed946f.png) */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-3">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-bold text-white">App Lock</p>
                    <p className="text-[11px] text-neutral-400">Require Face ID or passcode when switching apps</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-[#A9003D] cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-[#262626] flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-bold text-white">Screen Privacy</p>
                    <p className="text-[11px] text-neutral-400">Block screenshots &amp; conceal app in task switcher</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-[#A9003D] cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-[#262626] flex items-center justify-between py-1">
                  <div>
                    <p className="text-xs font-bold text-white">Ghost Calculator Mode</p>
                    <p className="text-[11px] text-neutral-400">Disguises app as a functional calculator</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-[#A9003D] cursor-pointer"
                  />
                </div>
              </div>

              {/* System Status: Optimal Button */}
              <div className="w-full py-3 rounded-full bg-white text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>System Status: Optimal</span>
              </div>
            </div>
          )}

          {/* 4. Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Push Notifications & In-App Alerts
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-[#262626]">
                <div>
                  <p className="text-xs font-bold text-white">Encrypted Chat Messages</p>
                  <p className="text-[11px] text-neutral-400">High-priority push notifications with sender privacy</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyChats}
                  onChange={(e) => setNotifyChats(e.target.checked)}
                  className="w-5 h-5 accent-[#A9003D] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#262626]">
                <div>
                  <p className="text-xs font-bold text-white">Watch Party Invites</p>
                  <p className="text-[11px] text-neutral-400">Alerts when friends start streaming movies</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWatchParties}
                  onChange={(e) => setNotifyWatchParties(e.target.checked)}
                  className="w-5 h-5 accent-[#A9003D] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#262626]">
                <div>
                  <p className="text-xs font-bold text-white">Live GPS Location Sharing Alerts</p>
                  <p className="text-[11px] text-neutral-400">Proximity notifications when contacts share live location</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyLocation}
                  onChange={(e) => setNotifyLocation(e.target.checked)}
                  className="w-5 h-5 accent-[#A9003D] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-xs font-bold text-white">Sound & Haptic Vibration</p>
                  <p className="text-[11px] text-neutral-400">Tactile clicks on double-tap heart and vanish events</p>
                </div>
                <input
                  type="checkbox"
                  checked={soundVibration}
                  onChange={(e) => setSoundVibration(e.target.checked)}
                  className="w-5 h-5 accent-[#A9003D] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 5. Subscriptions (RevenueCat & AdMob) Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              {/* Current Subscription Status */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c1810] to-[#121212] border border-[#D4AF37]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                    RevenueCat Entitlement: bro_pro
                  </span>
                  <span className="text-xs font-bold text-neutral-400">
                    Google Play Billing / UPI
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-white flex items-center gap-1.5">
                      <span>{isPro ? 'Bro Pro VIP (Active)' : 'Free Tier (Localized Freemium)'}</span>
                      <Crown className="w-4 h-4 text-[#D4AF37] fill-current" />
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {isPro
                        ? 'Unlimited voice translation, 4K HDR watch parties, encrypted call recording'
                        : '15 mins/day translation • 720p watch parties • Ad-supported'}
                    </p>
                  </div>

                  {!isPro ? (
                    <button
                      onClick={onOpenPro}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black font-extrabold text-xs shadow-md hover:scale-102 transition-transform"
                    >
                      Upgrade Pro
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                      Auto-Renewing
                    </span>
                  )}
                </div>
              </div>

              {/* AdMob Rewarded Video Pass Tracking */}
              <div className="p-4 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Google AdMob Rewarded Passes</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {adQuota.remainingImpressions} of {MAX_DAILY_REWARDED_ADS} Left Today
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Free users can watch a short sponsored video to unlock an extra 15 minutes of Live Voice Translation or a 1-session HD Watch Party pass.
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-neutral-400">
                    <span>Bonus Translation: <strong>+{Math.floor(bonusTranslationSeconds / 60)} mins</strong></span>
                    <span className="mx-2">•</span>
                    <span>HD Watch Passes: <strong>{hdWatchPasses}</strong></span>
                  </div>

                  <button
                    onClick={onWatchAd}
                    disabled={!adQuota.canWatchAd}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow ${
                      adQuota.canWatchAd
                        ? 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    {adQuota.canWatchAd ? 'Watch Ad for Bonus (+15m / HD Pass)' : 'Daily Limit Reached (5/5)'}
                  </button>
                </div>
              </div>

              {/* Restore Purchases / Play Store button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161616] border border-[#262626] text-xs text-neutral-400">
                <span>Switched phones or reinstalled?</span>
                <button
                  onClick={() => alert('RevenueCat: Google Play Billing transactions restored successfully.')}
                  className="text-white hover:text-[#D4AF37] font-semibold underline"
                >
                  Restore Purchases
                </button>
              </div>
            </div>
          )}

          {/* 6. Saved Recordings Tab (RecyclerView Card-based XML Mirror) */}
          {activeTab === 'recordings' && (
            <div className="space-y-4">
              {/* E2EE Call Recording Vault Header Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1A1517] to-[#161616] border border-[#501625] flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#2A101A] border border-rose-500/40 flex items-center justify-center text-[#D4AF37]">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>E2EE Call Recording Vault</span>
                      <span className="bg-[#2E2010] text-[#D4AF37] text-[9px] font-black px-2 py-0.5 rounded border border-[#D4AF37]/30">
                        PRO VIP
                      </span>
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Decryption keys stored exclusively in Android StrongBox KeyStore • AES-256-GCM
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                  {recordings.length} {recordings.length === 1 ? 'file' : 'files'} stored
                </span>
              </div>

              {/* RecyclerView Items Stream */}
              {recordings.length > 0 ? (
                <div className="space-y-3">
                  {recordings.map((rec) => {
                    const isCurrentlyPlaying = playingRecordingId === rec.id;
                    const elapsed = isCurrentlyPlaying ? playbackSeconds : 0;
                    const elapsedM = Math.floor(elapsed / 60);
                    const elapsedS = elapsed % 60;
                    const elapsedFormatted = `${elapsedM.toString().padStart(2, '0')}:${elapsedS.toString().padStart(2, '0')}`;
                    const progressPercent = Math.min(100, (elapsed / rec.durationSeconds) * 100);

                    return (
                      <div
                        key={rec.id}
                        className={`rounded-[18px] border transition-all p-3.5 sm:p-4 shadow-md ${
                          isCurrentlyPlaying
                            ? 'bg-[#22181C] border-[#A9003D] ring-1 ring-[#A9003D]/60'
                            : 'bg-[#1C1C1C] border-[#2E2E2E] hover:border-[#3E3E3E]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Avatar with E2EE mini lock */}
                          <div className="relative shrink-0">
                            <img
                              src={rec.partnerAvatar}
                              alt={rec.partnerName}
                              className="w-11 h-11 rounded-full object-cover border-[1.5px] border-[#A9003D]"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#121212] border border-emerald-500 flex items-center justify-center">
                              <Lock className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                          </div>

                          {/* Recording Metadata */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-bold text-white truncate">
                                {rec.partnerName}
                              </h5>
                              <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                                {rec.fileName}
                              </span>
                            </div>

                            {/* Date, Duration, Call Type */}
                            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5 flex-wrap">
                              <span>{rec.dateFormatted}</span>
                              <span className="text-neutral-600">•</span>
                              <span className="text-[#F43F5E] font-bold font-mono">
                                {rec.durationFormatted}
                              </span>
                              <span className="text-neutral-600">•</span>
                              <span className="text-neutral-300">
                                {rec.isVideo ? '4K Video Call' : 'HD Voice'}
                              </span>
                            </div>

                            {/* Container Specs & File Size */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="bg-[#262626] text-[#34D399] font-mono text-[10px] px-2 py-0.5 rounded border border-[#333]">
                                .brorec • AES-256-GCM
                              </span>
                              <span className="text-neutral-400 font-mono text-[11px]">
                                {rec.fileSizeFormatted}
                              </span>
                            </div>
                          </div>

                          {/* Play / Pause FAB Style Button */}
                          <button
                            type="button"
                            onClick={() => handleTogglePlayRecording(rec)}
                            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 shrink-0 ${
                              isCurrentlyPlaying
                                ? 'bg-rose-600 text-white animate-pulse'
                                : 'bg-[#A9003D] hover:bg-[#c31258] text-white'
                            }`}
                            title={isCurrentlyPlaying ? 'Pause Decryption Stream' : 'Decrypt & Play'}
                          >
                            {isCurrentlyPlaying ? (
                              <Pause className="w-5 h-5 fill-current" />
                            ) : (
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>

                        {/* Expanded In-Card Audio Playback Visualizer */}
                        {isCurrentlyPlaying && (
                          <div className="mt-3.5 pt-3 border-t border-rose-900/40 space-y-2">
                            {/* Animated Equalizer Waveform */}
                            <div className="flex items-center justify-between text-xs font-mono text-rose-300">
                              <div className="flex items-center gap-1">
                                {[6, 14, 22, 10, 18, 24, 12, 20, 8, 16, 26, 12, 18].map((bar, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      height: `${Math.max(4, Math.min(24, (bar + (elapsed % 3) * 5)))}px`,
                                    }}
                                    className="w-1 bg-[#F43F5E] rounded-full transition-all duration-200"
                                  />
                                ))}
                                <span className="ml-2 text-[11px] font-bold">StrongBox Decrypted Stream</span>
                              </div>
                              <span className="font-bold">
                                {elapsedFormatted} / {rec.durationFormatted}
                              </span>
                            </div>

                            {/* Playback Scrubber Bar */}
                            <div className="w-full bg-[#181818] h-1.5 rounded-full overflow-hidden border border-white/10">
                              <div
                                className="bg-[#A9003D] h-full rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>

                            {/* Actions: Export / Secure Erase */}
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span className="font-mono text-emerald-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Key: {rec.encryptionKeyFingerprint}
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => alert(`Exporting encrypted bundle: ${rec.fileName}\n(AES-256-GCM cipher container with 12-byte IV header)`)}
                                  className="px-2.5 py-1 rounded-lg bg-[#282828] hover:bg-[#333] text-neutral-200 flex items-center gap-1 transition-colors"
                                  title="Export encrypted file"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Export</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRecording(rec.id)}
                                  className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 flex items-center gap-1 transition-colors"
                                  title="Zeroize and delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Erase</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State (layout_empty_state mirror) */
                <div className="p-8 rounded-2xl bg-[#161616] border border-[#2a2a2a] text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#2A0E18] flex items-center justify-center text-rose-500">
                    <Mic className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Encrypted Recordings</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Tap 'VIP • REC' during any voice or video call to save an end-to-end encrypted recording.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRecordings(INITIAL_RECORDINGS)}
                    className="px-4 py-2 rounded-full bg-[#222] hover:bg-[#333] border border-[#333] text-xs font-bold text-neutral-200 transition-colors"
                  >
                    Reset Demo Recordings
                  </button>
                </div>
              )}

              {/* Android RecyclerView Technical Reference Box */}
              <div className="p-3 bg-[#161616] border border-[#262626] rounded-xl text-[11px] text-neutral-400 font-mono space-y-1">
                <p className="text-emerald-400 font-bold">Android Implementation Reference:</p>
                <p>• Layout: item_saved_recording.xml (MaterialCardView #1C1C1C, Play FAB #A9003D)</p>
                <p>• Adapter: SavedRecordingsAdapter.java (RecyclerView.Adapter)</p>
                <p>• Storage: context.getFilesDir() / secure_recordings / *.brorec</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

