/**
 * Translation, Localized Phrases and Quota Logic for Bro
 * Supported Languages: Telugu (te), Tamil (ta), Kannada (kn), English (en), Hindi (hi)
 */

export type LanguageCode = 'te' | 'ta' | 'kn' | 'en' | 'hi';

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeName: string;
  tagline: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, LanguageInfo> = {
  te: {
    code: 'te',
    label: 'Telugu',
    nativeName: 'తెలుగు',
    tagline: 'నాకేం పట్టదు',
    flag: '🇮🇳 TEL',
  },
  ta: {
    code: 'ta',
    label: 'Tamil',
    nativeName: 'தமிழ்',
    tagline: 'எனக்கு கவலை இல்லை',
    flag: '🇮🇳 TAM',
  },
  kn: {
    code: 'kn',
    label: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    tagline: 'ನನಗೇನು ಚಿಂತೆ ಇಲ್ಲ',
    flag: '🇮🇳 KAN',
  },
  en: {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    tagline: "I DON'T CARE",
    flag: '🌐 ENG',
  },
  hi: {
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    tagline: 'मुझे कोई फर्क नहीं पड़ता',
    flag: '🇮🇳 HIN',
  },
};

export const COMMON_PHRASES: Record<string, Record<LanguageCode, string>> = {
  greeting: {
    en: 'Hey Bro, what is up?',
    te: 'హే బ్రో, ఏంటి సంగతులు?',
    ta: 'ஹே ப்ரோ, என்ன விசேஷம்?',
    kn: 'ಹೇ ಬ್ರೋ, ಏನಿದೆ ಸಮಾಚಾರ?',
    hi: 'हे ब्रो, क्या चल रहा है?',
  },
  watch_invite: {
    en: 'Movie watch party is live! Join room.',
    te: 'మూవీ వాచ్ పార్టీ స్టార్ట్ అయ్యింది! రూమ్‌లో జాయిన్ అవ్వు.',
    ta: 'திரைப்பட வாட்ச் பார்ட்டி ஆரம்பிச்சிடுச்சு! ரூம்ல சேரு.',
    kn: 'ಮೂವಿ ವಾಚ್ ಪಾರ್ಟಿ ಶುರುವಾಗಿದೆ! ರೂಮ್‌ಗೆ ಜಾಯಿನ್ ಆಗು.',
    hi: 'मूवी वॉच पार्टी शुरू हो गई है! रूम में आ जाओ.',
  },
  location_share: {
    en: 'Sharing my live location with you.',
    te: 'నా లైవ్ లొకేషన్ నీతో షేర్ చేస్తున్నాను.',
    ta: 'என் லைவ் லொகேஷனை உன்கிட்ட பகிர்கிறேன்.',
    kn: 'ನನ್ನ ಲೈವ್ ಲೊಕೇಶನ್ ನಿನ್ನೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ.',
    hi: 'अपनी लाइव लोकेशन तुम्हारे साथ शेयर कर रहा हूँ.',
  },
  dont_care: {
    en: "I DON'T CARE",
    te: 'నాకేం పట్టదు',
    ta: 'எனக்கு கவலை இல்லை',
    kn: 'ನನಗೇನು ಚಿಂತೆ ಇಲ್ಲ',
    hi: 'मुझे कोई फर्क नहीं पड़ता',
  },
  pro_unlimited: {
    en: 'Unlock Unlimited Live Voice Translation with Bro Pro',
    te: 'బ్రో ప్రో తో అన్‌లిమిటెడ్ లైవ్ వాయిస్ ట్రాన్స్‌లేషన్ పొందండి',
    ta: 'ப்ரோ ப்ரோ உடன் எல்லையற்ற நேரடி குரல் மொழிபெயர்ப்பைப் பெறுங்கள்',
    kn: 'ಬ್ರೋ ಪ್ರೊ ನೊಂದಿಗೆ ಅನಿಯಮಿತ ಧ್ವನಿ ಅನುವಾದವನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ',
    hi: 'ब्रो प्रो के साथ असीमित लाइव वॉयस ट्रांसलेशन पाएं',
  },
};

/**
 * Calculates free tier daily translation quota status
 * Free users get 15 minutes (900 seconds) + rewarded ad passes (+900 seconds each)
 */
export function calculateTranslationQuota(
  usedSeconds: number,
  rewardedBonusSeconds: number,
  isPro: boolean
): {
  totalAllowedSeconds: number;
  remainingSeconds: number;
  percentUsed: number;
  canTranslate: boolean;
} {
  if (isPro) {
    return {
      totalAllowedSeconds: Infinity,
      remainingSeconds: 86400, // unlimited representation
      percentUsed: 0,
      canTranslate: true,
    };
  }

  const baseFreeLimit = 900; // 15 minutes
  const totalAllowed = baseFreeLimit + Math.max(0, rewardedBonusSeconds);
  const remaining = Math.max(0, totalAllowed - usedSeconds);
  const percentUsed = Math.min(100, Math.round((usedSeconds / totalAllowed) * 100));

  return {
    totalAllowedSeconds: totalAllowed,
    remainingSeconds: remaining,
    percentUsed,
    canTranslate: remaining > 0,
  };
}

/**
 * Formats seconds into MM:SS display
 */
export function formatSecondsToTime(seconds: number): string {
  if (seconds === Infinity) return 'Unlimited';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Translates known sample text between supported languages
 */
export function translateSample(key: string, targetLang: LanguageCode): string {
  if (COMMON_PHRASES[key] && COMMON_PHRASES[key][targetLang]) {
    return COMMON_PHRASES[key][targetLang];
  }
  return key;
}
