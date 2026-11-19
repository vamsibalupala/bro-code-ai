import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  Radio, 
  Languages, 
  FileText,
  Send
} from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../utils/translation';

interface AudioTranscriptionModalProps {
  onClose: () => void;
  onInsertTranscription: (text: string) => void;
  preferredLanguage: LanguageCode;
}

export const AudioTranscriptionModal: React.FC<AudioTranscriptionModalProps> = ({
  onClose,
  onInsertTranscription,
  preferredLanguage,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(preferredLanguage);
  const [copied, setCopied] = useState(false);

  // Simulated transcription samples for 5 languages
  const SAMPLES_BY_LANG: Record<LanguageCode, string> = {
    te: 'బ్రో, వాచ్ పార్టీ మొదలైంది! రేపు 9 గంటలకు ఖచ్చితంగా కలుద్దాం. నాకేం పట్టదు!',
    ta: 'ப்ரோ, வாட்ச் பார்ட்டி ஆரம்பிச்சிடுச்சு! நாளைக்கு 9 மணிக்கு கண்டிப்பா சந்திப்போம். எனக்கு கவலை இல்லை!',
    kn: 'ಬ್ರೋ, ವಾಚ್ ಪಾರ್ಟಿ ಶುರುವಾಗಿದೆ! ನಾಳೆ 9 ಗಂಟೆಗೆ ಖಂಡಿತ ಸಿಗೋಣ. ನನಗೇನು ಚಿಂತೆ ಇಲ್ಲ!',
    en: "Hey Bro! The 4K Watch Party is live. Let's sync up tonight at 9 PM sharp. I DON'T CARE!",
    hi: 'हे ब्रो! वॉच पार्टी शुरू हो गई है. कल रात 9 बजे पक्का मिलते हैं. मुझे कोई फर्क नहीं पड़ता!',
  };

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

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTranscript('');
    } else {
      setIsRecording(false);
      setIsTranscribing(true);
      setTimeout(() => {
        setIsTranscribing(false);
        setTranscript(SAMPLES_BY_LANG[selectedLanguage]);
      }, 1200);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsertTranscription(transcript);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-[#161616] border border-[#2e2e2e] rounded-3xl overflow-hidden shadow-2xl p-5 text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#A9003D] to-[#5a001a] border border-rose-500/30 flex items-center justify-center text-white shadow-xl">
          <Mic className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">
            Powered by gemini-3.5-transcribe
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight mt-1">
            Audio Voice Transcription
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Record voice with your microphone and get instant multi-language speech-to-text transcription.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-neutral-400 font-semibold">Audio Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
            className="bg-[#242424] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-[#383838] focus:outline-none"
          >
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Microphone Recording Centerpiece */}
        <div className="py-2 flex flex-col items-center justify-center space-y-3">
          <button
            onClick={handleToggleRecord}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-600/20'
                : 'bg-[#222] hover:bg-[#2c2c2c] text-rose-400 border-2 border-rose-500/40'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <span className="text-xs font-mono font-bold text-neutral-300">
            {isRecording
              ? `Listening... 0:${recordingSeconds.toString().padStart(2, '0')} (Tap to Finish)`
              : 'Tap to Start Speaking'}
          </span>
        </div>

        {/* Transcription Output Box */}
        <div className="p-3.5 rounded-2xl bg-[#111] border border-[#262626] text-left min-h-[90px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mb-1">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-neutral-400" />
              <span>Transcript Result</span>
            </span>
            {transcript && (
              <button
                onClick={handleCopy}
                className="text-neutral-400 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {isTranscribing ? (
            <div className="flex items-center gap-2 text-rose-300 text-xs py-3 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Transcribing audio with Neural Model...</span>
            </div>
          ) : transcript ? (
            <p className="text-xs text-white font-medium leading-relaxed select-all">
              {transcript}
            </p>
          ) : (
            <p className="text-xs text-neutral-500 italic py-3">
              Press record and speak in {SUPPORTED_LANGUAGES[selectedLanguage].nativeName} to transcribe.
            </p>
          )}
        </div>

        {/* Action button */}
        {transcript && (
          <button
            onClick={handleInsert}
            className="w-full py-2.5 rounded-full bg-[#A9003D] hover:bg-[#c31258] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Insert Transcription into Chat</span>
          </button>
        )}
      </div>
    </div>
  );
};
