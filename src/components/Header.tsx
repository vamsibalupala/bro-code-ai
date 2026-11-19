import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe, 
  Code2, 
  Crown,
  ChevronDown,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../utils/translation';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenPro: () => void;
  onOpenCodeStudio: () => void;
  isPro: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenPro,
  onOpenCodeStudio,
  isPro,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const currentLangInfo = SUPPORTED_LANGUAGES[currentLanguage];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121212]/95 backdrop-blur-md border-b border-[#222222] select-none">
      {/* Native Mobile Status Bar (9:41, 5G, Battery) */}
      <div className="h-6 px-4 flex items-center justify-between text-neutral-400 text-[11px] font-medium pt-1">
        <span className="font-semibold text-white tracking-tight">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3 h-3 text-neutral-300" />
          <span className="text-[10px] font-bold text-neutral-300">5G</span>
          <Wifi className="w-3 h-3 text-neutral-300" />
          <Battery className="w-3.5 h-3.5 text-neutral-300 fill-current" />
        </div>
      </div>

      {/* Main Top Header Bar (Instagram Style) */}
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left: Brand & Tagline */}
        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black tracking-tight text-white">
              BRO
            </span>
            <span className="w-2 h-2 rounded-full bg-[#E1306C] animate-pulse" />
          </div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1 border-l border-neutral-700/60 hidden xs:inline">
            I DON'T CARE
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="bg-[#1c1c1c] hover:bg-[#262626] text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 transition-all shadow-sm"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentLangInfo.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#181818] border border-[#333] rounded-2xl shadow-2xl py-1 z-50 overflow-hidden backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-neutral-400 tracking-wider border-b border-[#262626]">
                  Select Language
                </div>
                {(Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]).map((code) => {
                  const lang = SUPPORTED_LANGUAGES[code];
                  return (
                    <button
                      key={code}
                      onClick={() => {
                        onLanguageChange(code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#252525] transition-colors ${
                        currentLanguage === code ? 'text-white font-bold bg-[#A9003D]/25' : 'text-neutral-300'
                      }`}
                    >
                      <span>{lang.nativeName} ({lang.label})</span>
                      <span className="text-[10px] text-neutral-400">{lang.flag}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pro VIP Badge / Button */}
          {isPro ? (
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Crown className="w-3 h-3 fill-current" /> VIP
            </span>
          ) : (
            <button
              onClick={onOpenPro}
              className="border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider transition-all flex items-center gap-1 shadow-sm active:scale-95"
            >
              <Crown className="w-3 h-3 fill-current" /> PRO
            </button>
          )}

          {/* Android Java SDK Code Inspector */}
          <button
            onClick={onOpenCodeStudio}
            className="w-8 h-8 rounded-full bg-[#1c1c1c] hover:bg-[#262626] border border-white/10 text-emerald-400 flex items-center justify-center transition-all shadow-sm active:scale-95"
            title="Inspect Native Android (Java + XML) Architecture"
          >
            <Code2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
