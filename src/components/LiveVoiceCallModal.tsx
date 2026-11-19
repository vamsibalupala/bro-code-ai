import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronLeft, 
  ShieldCheck, 
  Sparkles, 
  Disc, 
  Video, 
  VideoOff, 
  Share2, 
  Headphones, 
  Radio, 
  Check, 
  Crown,
  Lock,
  ArrowRightLeft,
  RefreshCw,
  Camera
} from 'lucide-react';
import { Conversation } from '../data/mockData';
import { LanguageCode, SUPPORTED_LANGUAGES, calculateTranslationQuota, formatSecondsToTime } from '../utils/translation';

interface LiveVoiceCallModalProps {
  conversation: Conversation;
  onClose: () => void;
  onOpenPro: () => void;
  onWatchAd: () => void;
  isPro: boolean;
  rewardedBonusSeconds: number;
}

interface AudioRouteOption {
  id: string;
  name: string;
  icon: string;
}

const SAMPLE_CALL_DIALOGUES = [
  {
    speaker: 'Rahul',
    hindi: 'भाई, कल के मैच के टिकट्स बुक हो गए!',
    telugu: 'బ్రో, రేపటి మ్యాచ్ టిక్కెట్లు బుక్ అయ్యాయి!',
    tamil: 'ப்ரோ, நாளைய போட்டிக்கான டிக்கெட்டுகள் முன்பதிவு செய்யப்பட்டன!',
    kannada: 'ಬ್ರೋ, ನಾಳಿನ ಪಂದ್ಯದ ಟಿಕೆಟ್‌ಗಳು ಬುಕ್ ಆಗಿವೆ!',
    english: 'Bro, tomorrow’s match tickets are booked!',
  },
  {
    speaker: 'Rahul',
    hindi: 'क्या हम शाम 9 बजे वॉच पार्टी में हाइलाइट्स देखेंगे?',
    telugu: 'మనం రాత్రి 9 గంటలకు వాచ్ పార్టీలో హైలైట్స్ చూద్దామా?',
    tamil: 'இரவு 9 மணிக்கு வாட்ச் பார்ட்டியில் சிறப்பம்சங்களைப் பார்ப்போமா?',
    kannada: 'ರಾತ್ರಿ 9 ಗಂಟೆಗೆ ವಾಚ್ ಪಾರ್ಟಿಯಲ್ಲಿ ಹೈಲೈಟ್‌ಗಳನ್ನು ನೋಡೋಣವಾ?',
    english: 'Shall we stream the highlights in the watch party at 9 PM?',
  },
  {
    speaker: 'Rahul',
    hindi: 'लाइव वॉयस डकिंग बहुत स्मूथ है, बिल्कुल लैग नहीं है.',
    telugu: 'లైవ్ వాయిస్ డకింగ్ చాలా స్మూత్ గా ఉంది, లేటెన్సీ సున్నా.',
    tamil: 'லைவ் வாய்ஸ் டக்கிங் ரொம்ப சுத்தமா இருக்கு, தாமதமே இல்லை.',
    kannada: 'ಲೈವ್ ವಾಯ್ಸ್ ಡಕಿಂಗ್ ತುಂಬಾ ಸುಗಮವಾಗಿದೆ, ಯಾವುದೇ ಲ್ಯಾಗ್ ಇಲ್ಲ.',
    english: 'The live voice ducking is super smooth, zero lag.',
  },
];

export const LiveVoiceCallModal: React.FC<LiveVoiceCallModalProps> = ({
  conversation,
  onClose,
  onOpenPro,
  onWatchAd,
  isPro,
  rewardedBonusSeconds,
}) => {
  // Call mode: false = Voice Call (screen_ef5a0b70.png), true = Video Call (screen_b07b6990.png)
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [callDurationSec, setCallDurationSec] = useState(252); // Starts at 04:12 to match reference
  const [audioRoute, setAudioRoute] = useState('AirPods Pro');
  const [audioRouteOpen, setAudioRouteOpen] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showEncryptedSavedToast, setShowEncryptedSavedToast] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Languages for live call translation
  const [sourceLang, setSourceLang] = useState<LanguageCode>('hi');
  const [targetLang, setTargetLang] = useState<LanguageCode>('te');

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recording duration timer
  useEffect(() => {
    let recTimer: any;
    if (isRecording) {
      recTimer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(recTimer);
  }, [isRecording]);

  // Dialogue switcher
  useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex((prev) => (prev + 1) % SAMPLE_CALL_DIALOGUES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const currentDialogue = SAMPLE_CALL_DIALOGUES[dialogueIndex];

  // Call Recording Toggle (Pro VIP feature)
  const handleToggleRecording = () => {
    if (!isPro) {
      onOpenPro();
      return;
    }

    if (isRecording) {
      // Stopping recording
      setIsRecording(false);
      setShowEncryptedSavedToast(true);
      setTimeout(() => setShowEncryptedSavedToast(false), 3500);
    } else {
      // Starting recording
      setIsRecording(true);
      setRecordingSeconds(0);
    }
  };

  const audioRoutes: AudioRouteOption[] = [
    { id: 'airpods', name: 'AirPods Pro', icon: '🎧' },
    { id: 'speaker', name: 'Phone Speaker', icon: '🔊' },
    { id: 'earpiece', name: 'Phone Earpiece', icon: '📱' },
    { id: 'bluetooth', name: 'Car Bluetooth Audio', icon: '🚗' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-0 sm:p-4 select-none">
      <div className="relative w-full h-full sm:max-h-[880px] sm:max-w-[420px] bg-[#121212] border-0 sm:border border-[#262626] sm:rounded-[36px] overflow-hidden shadow-2xl flex flex-col justify-between text-white font-sans">
        
        {/* ========================================================= */}
        {/* TOP STATUS BAR & HEADER */}
        {/* ========================================================= */}
        <div className="relative z-30 pt-4 px-4 pb-2 flex items-center justify-between">
          {/* Back chevron button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 flex items-center justify-center text-white/90 transition-colors"
            title="Minimize or End Call"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Center Call Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90 font-bold">{formatSecondsToTime(callDurationSec)}</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> E2EE
            </span>
            <span className="text-white/40">•</span>
            <span className="text-rose-300 font-bold uppercase tracking-wider">
              {sourceLang.toUpperCase()} ⇄ {targetLang.toUpperCase()}
            </span>
          </div>

          {/* Quick Pro / Shield Icon */}
          <button
            onClick={onOpenPro}
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 flex items-center justify-center text-[#D4AF37] transition-colors"
            title={isPro ? 'Bro Pro VIP Active' : 'Upgrade to Bro Pro'}
          >
            <Crown className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Encrypted Recording Saved Toast */}
        {showEncryptedSavedToast && (
          <div className="absolute top-16 left-4 right-4 z-40 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs px-3.5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="flex-1 truncate">
              <p className="font-bold">Call Recording Encrypted &amp; Saved</p>
              <p className="text-[10px] opacity-80 font-mono">AES-256-GCM container • bro_enc_{Date.now().toString().slice(-6)}.brorec</p>
            </div>
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
        )}

        {/* ========================================================= */}
        {/* MAIN CALL BODY: VOICE CALL MODE (screen_ef5a0b70.png) */}
        {/* ========================================================= */}
        {!isVideoMode ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
            {/* Ambient burgundy background halo */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#A9003D]/20 via-[#4A001C]/15 to-transparent blur-3xl pointer-events-none" />

            {/* Central Round Avatar with Glowing Ring */}
            <div className="relative mb-4">
              <div className="w-36 h-36 rounded-full p-1 border-2 border-rose-500/30 ring-8 ring-rose-500/10 shadow-2xl overflow-hidden bg-[#1a1a1a]">
                <img
                  src={conversation.partnerAvatar}
                  alt={conversation.partnerName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#121212] flex items-center justify-center shadow">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            {/* Caller Name & HD Voice status */}
            <div className="text-center space-y-1 mb-3">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {conversation.partnerName}
              </h2>
              <p className="text-xs text-neutral-400 font-medium">
                Connected • HD Voice
              </p>
            </div>

            {/* Audio Waveform Equalizer (Coral/Pink bars matching screen_ef5a0b70.png) */}
            <div className="flex items-center gap-1.5 h-7 my-2">
              {[4, 12, 22, 16, 28, 14, 20, 8, 24, 18, 10, 16, 6].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: `${Math.max(6, Math.min(28, (h + (callDurationSec % 3) * 4)))}px`,
                  }}
                  className="w-1 rounded-full bg-[#E1306C] transition-all duration-300"
                />
              ))}
            </div>

            {/* Floating Live AI Speech Banner (Matches screen_ef5a0b70.png) */}
            <div className="w-full max-w-sm mt-4 p-3.5 rounded-2xl bg-[#1b1b1b] border border-white/10 shadow-xl backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E1306C] animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E1306C]">
                    AI LIVE
                  </span>
                </div>
                {/* Mini audio wave icon */}
                <span className="text-xs text-[#E1306C] font-mono tracking-widest">|||·|</span>
              </div>

              <p className="text-xs text-white/95 font-medium leading-relaxed">
                <strong className="text-rose-300">{currentDialogue.speaker}:</strong> "{currentDialogue.hindi}"
              </p>
              <p className="text-[11px] text-amber-200/90 font-medium italic pt-1 border-t border-white/5">
                Translated ({SUPPORTED_LANGUAGES[targetLang].nativeName}): "{currentDialogue.telugu}"
              </p>
            </div>

            {/* Middle Action Pills Row (AirPods Pro Selector + VIP REC Toggle) */}
            <div className="w-full max-w-sm mt-6 flex items-center justify-between gap-3 relative">
              {/* Left Pill: Audio Output Selector (AirPods Pro) */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setAudioRouteOpen(!audioRouteOpen)}
                  className="w-full py-2 px-3 rounded-full bg-[#1e1e1e] hover:bg-[#282828] border border-white/10 flex items-center justify-between text-xs font-semibold text-neutral-200 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Headphones className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                    <span className="truncate">{audioRoute}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
                </button>

                {/* Audio Route Dropdown */}
                {audioRouteOpen && (
                  <div className="absolute bottom-12 left-0 w-48 bg-[#1f1f1f] border border-[#333] rounded-2xl shadow-2xl p-1.5 z-40">
                    {audioRoutes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => {
                          setAudioRoute(route.name);
                          setAudioRouteOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                          audioRoute === route.name
                            ? 'bg-[#A9003D]/30 text-white font-bold'
                            : 'text-neutral-300 hover:bg-[#292929]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{route.icon}</span>
                          <span>{route.name}</span>
                        </span>
                        {audioRoute === route.name && <Check className="w-3.5 h-3.5 text-rose-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Pill: Pro Call Recording Toggle [VIP • REC 04:12] */}
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`flex-1 py-2 px-3 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                  isRecording
                    ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
                    : 'bg-[#1e1e1e] hover:bg-[#252525] border-[#D4AF37] text-[#D4AF37]'
                }`}
                title={isPro ? (isRecording ? 'Click to Stop Encrypted Recording' : 'Start End-to-End Encrypted Recording') : 'Upgrade to Bro Pro to record calls'}
              >
                <span className="bg-[#D4AF37] text-black text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                  VIP
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-neutral-500'}`} />
                  <span className="font-mono text-xs">
                    {isRecording ? `REC ${formatSecondsToTime(recordingSeconds)}` : 'REC'}
                  </span>
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* MAIN CALL BODY: VIDEO CALL MODE (screen_b07b6990.png) */
          /* ========================================================= */
          <div className="flex-1 relative flex flex-col justify-between overflow-hidden">
            {/* Background Fullscreen Video of Partner */}
            <div className="absolute inset-0 z-0">
              <img
                src={conversation.partnerAvatar}
                alt="Video stream"
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none" />
            </div>

            {/* Top Right PIP (Picture in Picture) Camera of 'You' */}
            <div className="relative z-10 p-4 flex justify-end">
              <div className="relative w-28 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900 group">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>You</span>
                </div>
                <button
                  onClick={() => alert('Camera switched to rear')}
                  className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white/90 hover:text-white"
                  title="Flip camera"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Floating Live Voice Synthesis Card (Matching screen_b07b6990.png) */}
            <div className="relative z-10 px-4 mb-4">
              <div className="p-4 rounded-3xl bg-black/85 border border-white/15 backdrop-blur-xl shadow-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E1306C] animate-pulse" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">
                      LIVE VOICE SYNTHESIS
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-rose-300 font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{SUPPORTED_LANGUAGES[targetLang].nativeName}</span>
                  </div>
                </div>

                {/* Original utterance */}
                <div className="space-y-0.5">
                  <p className="text-[11px] text-neutral-400 font-medium">
                    {currentDialogue.speaker} ({SUPPORTED_LANGUAGES[sourceLang].label}):
                  </p>
                  <p className="text-xs text-white/90 italic font-medium">
                    "{currentDialogue.hindi}"
                  </p>
                </div>

                {/* Translated output */}
                <div className="pt-2 border-t border-white/10 space-y-0.5">
                  <p className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Translated ({SUPPORTED_LANGUAGES[targetLang].label}):
                  </p>
                  <p className="text-sm text-white font-bold leading-relaxed">
                    "{currentDialogue.telugu}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BOTTOM FLOATING CONTROLS DOCK (screen_ef5a0b70.png) */}
        {/* ========================================================= */}
        <div className="relative z-30 p-4 pb-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center">
          
          {/* Capsule Bar with Control Actions */}
          <div className="w-full max-w-[340px] px-4 py-3 rounded-full bg-[#1e1e1e] border border-[#2e2e2e] shadow-2xl flex items-center justify-between">
            {/* 1. Mic Button */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-red-600/90 text-white shadow-lg'
                  : 'bg-[#2b2b2b] text-neutral-200 hover:text-white hover:bg-[#363636]'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* 2. Speaker Button */}
            <button
              type="button"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                !isSpeakerOn
                  ? 'bg-neutral-700 text-neutral-400'
                  : 'bg-[#2b2b2b] text-neutral-200 hover:text-white hover:bg-[#363636]'
              }`}
              title={isSpeakerOn ? 'Turn Speaker Off' : 'Turn Speaker On'}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* 3. Video Call Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsVideoMode(!isVideoMode)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isVideoMode
                  ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400/30'
                  : 'bg-[#2b2b2b] text-neutral-200 hover:text-white hover:bg-[#363636]'
              }`}
              title={isVideoMode ? 'Switch to Voice Call' : 'Switch to Video Call'}
            >
              {isVideoMode ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* 4. Pro VIP Gold Ring Button */}
            <button
              type="button"
              onClick={handleToggleRecording}
              className={`w-11 h-11 rounded-full flex items-center justify-center border-2 border-[#D4AF37] transition-all ${
                isRecording
                  ? 'bg-red-600 text-white shadow-lg animate-pulse'
                  : 'bg-black/50 hover:bg-[#D4AF37]/20 text-[#D4AF37]'
              }`}
              title={isRecording ? 'Stop Recording' : 'Pro Call Recording'}
            >
              <span className="font-extrabold text-xs tracking-tighter">VI</span>
            </button>

            {/* 5. End Call Red Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl active:scale-90 transition-transform"
              title="End Call"
            >
              <PhoneOff className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Bottom active translation ticker indicator */}
          <div className="mt-3 flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
            <span>Translate: {SUPPORTED_LANGUAGES[sourceLang].label} ⇄ {SUPPORTED_LANGUAGES[targetLang].label}</span>
            <span>•</span>
            <span className="text-emerald-400">MediaRecorder AES-256</span>
          </div>
        </div>

      </div>
    </div>
  );
};
