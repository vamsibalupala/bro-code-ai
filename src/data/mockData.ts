import { LanguageCode } from '../utils/translation';

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  hasUnseen: boolean;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  timestamp: string;
  language: LanguageCode;
}

export interface WatchRoom {
  id: string;
  title: string;
  movieTitle: string;
  posterUrl: string;
  videoDurationSec: number;
  currentPlaybackSec: number;
  isPlaying: boolean;
  hostName: string;
  hostAvatar: string;
  participantsCount: number;
  is4KPro: boolean;
  activeLanguage: LanguageCode;
  subtitlesLanguage: LanguageCode;
  participants: {
    id: string;
    name: string;
    avatar: string;
    isMuted: boolean;
    isTalking: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  timeFormatted: string;
  isSelf: boolean;
  isEncrypted: boolean;
  isVanish: boolean;
  vanishDurationSec?: number;
  viewOnce?: boolean;
  viewOnceOpened?: boolean;
  mediaUrl?: string;
  translatedText?: string;
  watchPartyInvite?: {
    title: string;
    host: string;
    joined: number;
    quality: string;
    posterUrl: string;
  };
  voiceNote?: {
    durationSec: number;
    waveform: number[];
  };
  locationShare?: {
    latitude: number;
    longitude: number;
    address: string;
    etaMinutes: number;
    distanceKm: number;
    expiryTimestamp: number;
  };
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions: Record<string, string[]>; // emoji -> array of userNames
}

export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  isOnline: boolean;
  lastSeen: string;
  unreadCount: number;
  isVanishMode: boolean;
  isPinned: boolean;
  isArchived?: boolean;
  securityFingerprint: string;
  preferredLanguage: LanguageCode;
  lastMessage: {
    text: string;
    time: string;
    isSelf: boolean;
    isEncrypted: boolean;
  };
  messages: ChatMessage[];
}

export const INITIAL_STORIES: Story[] = [
  {
    id: 's1',
    userId: 'u1',
    userName: 'Arjun_Dev',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hasUnseen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Midnight code sprint + Kalki movie stream 🍿🔥 #BroNight',
    timestamp: '2h ago',
    language: 'te',
  },
  {
    id: 's2',
    userId: 'u2',
    userName: 'Vikram_R',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hasUnseen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Setting up 4K Watch Party for Leo climax! Who is in?',
    timestamp: '4h ago',
    language: 'ta',
  },
  {
    id: 's3',
    userId: 'u3',
    userName: 'Kavya_Blr',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    hasUnseen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Live Voice Translation is crazy smooth between Kannada & Telugu! 🎧✨',
    timestamp: '6h ago',
    language: 'kn',
  },
  {
    id: 's4',
    userId: 'u4',
    userName: 'Rohan_M',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    hasUnseen: false,
    mediaUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Highway road trip! Live GPS sharing enabled on Bro. ETA 45m.',
    timestamp: '8h ago',
    language: 'hi',
  },
  {
    id: 's5',
    userId: 'u5',
    userName: 'Sarah_K',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    hasUnseen: false,
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    caption: 'Soundtrack party live in Room #4! Plug in your headphones 🎵',
    timestamp: '11h ago',
    language: 'en',
  },
];

export const INITIAL_WATCH_ROOMS: WatchRoom[] = [
  {
    id: 'room_kalki',
    title: 'Kalki 2898 AD Sci-Fi Sync',
    movieTitle: 'Kalki 2898 AD (2024)',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    videoDurationSec: 7200,
    currentPlaybackSec: 1420,
    isPlaying: true,
    hostName: 'Arjun_Dev',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    participantsCount: 14,
    is4KPro: true,
    activeLanguage: 'te',
    subtitlesLanguage: 'en',
    participants: [
      { id: 'p1', name: 'Arjun (Host)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', isMuted: false, isTalking: true },
      { id: 'p2', name: 'Vikram', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', isMuted: false, isTalking: false },
      { id: 'p3', name: 'Kavya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', isMuted: true, isTalking: false },
      { id: 'p4', name: 'Rohan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', isMuted: false, isTalking: true },
    ],
  },
  {
    id: 'room_leo',
    title: 'Leo Action Binge & Tamil Roast',
    movieTitle: 'Leo - Bloody Sweet (2023)',
    posterUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    videoDurationSec: 8100,
    currentPlaybackSec: 3600,
    isPlaying: false,
    hostName: 'Vikram_R',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    participantsCount: 8,
    is4KPro: false,
    activeLanguage: 'ta',
    subtitlesLanguage: 'te',
    participants: [
      { id: 'p2', name: 'Vikram', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', isMuted: false, isTalking: false },
      { id: 'p5', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', isMuted: false, isTalking: true },
    ],
  },
  {
    id: 'room_kgf',
    title: 'KGF Chapter 2 Mass Screening',
    movieTitle: 'KGF Chapter 2 (2022)',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    videoDurationSec: 7800,
    currentPlaybackSec: 540,
    isPlaying: true,
    hostName: 'Kavya_Blr',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    participantsCount: 19,
    is4KPro: true,
    activeLanguage: 'kn',
    subtitlesLanguage: 'hi',
    participants: [
      { id: 'p3', name: 'Kavya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', isMuted: false, isTalking: true },
      { id: 'p1', name: 'Arjun', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', isMuted: true, isTalking: false },
    ],
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c_rahul',
    partnerId: 'u_rahul',
    partnerName: 'Rahul Sharma',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastSeen: 'Active now',
    unreadCount: 2,
    isVanishMode: false,
    isPinned: true,
    securityFingerprint: '99104 22819 10492 88310 49201 88310',
    preferredLanguage: 'hi',
    lastMessage: {
      text: 'Bro check out this Telugu movie trailer...',
      time: '10:42 AM',
      isSelf: false,
      isEncrypted: true,
    },
    messages: [
      {
        id: 'mr_1',
        senderId: 'u_rahul',
        senderName: 'Rahul Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'हाँ भाई, कल के मैच के टिकट्स बुक हो गए! 🎉',
        translatedText: 'Yes bro, tomorrow’s match tickets are booked!',
        timestamp: Date.now() - 3600000,
        timeFormatted: '2:46 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        reactions: {},
      },
      {
        id: 'mr_2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: 'Awesome bro! Are we streaming the highlights in the watch room tonight? 🍿',
        timestamp: Date.now() - 3000000,
        timeFormatted: '2:47 PM',
        isSelf: true,
        isEncrypted: true,
        isVanish: false,
        reactions: {},
      },
      {
        id: 'mr_3',
        senderId: 'u_rahul',
        senderName: 'Rahul Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Kalki 2898 AD (4K) Watch Party',
        timestamp: Date.now() - 1800000,
        timeFormatted: '2:49 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        watchPartyInvite: {
          title: 'Kalki 2898 AD (4K)',
          host: 'Rahul',
          joined: 3,
          quality: '4K ULTRA',
          posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        },
        reactions: {},
      },
      {
        id: 'mr_4',
        senderId: 'u_rahul',
        senderName: 'Rahul Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Voice note (0:38)',
        timestamp: Date.now() - 900000,
        timeFormatted: '2:50 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        voiceNote: {
          durationSec: 38,
          waveform: [15, 30, 45, 80, 60, 40, 95, 100, 75, 45, 60, 85, 40, 20],
        },
        reactions: {},
      },
      {
        id: 'mr_5',
        senderId: 'u_rahul',
        senderName: 'Rahul Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Rahul’s Live Location (Arrived • At your spot)',
        timestamp: Date.now() - 300000,
        timeFormatted: '2:52 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        locationShare: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'Indiranagar 100ft Road • 1.4 km',
          etaMinutes: 0,
          distanceKm: 1.4,
          expiryTimestamp: Date.now() + 3600000,
        },
        reactions: {},
      },
    ],
  },
  {
    id: 'c1',
    partnerId: 'u1',
    partnerName: 'Arjun Dev (Telugu)',
    partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastSeen: 'Active now',
    unreadCount: 2,
    isVanishMode: false,
    isPinned: true,
    securityFingerprint: '49201 88310 47219 90124 38102 55419',
    preferredLanguage: 'te',
    lastMessage: {
      text: 'బ్రో, వాచ్ పార్టీ మొదలైంది! రూమ్‌లోకి రా.',
      time: '04:42 PM',
      isSelf: false,
      isEncrypted: true,
    },
    messages: [
      {
        id: 'm1',
        senderId: 'u1',
        senderName: 'Arjun Dev',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'హే బ్రో, ఈరోజు Kalki వాచ్ పార్టీ పెట్టుకుందామా?',
        timestamp: Date.now() - 3600000,
        timeFormatted: '03:45 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        reactions: { '🔥': ['You', 'Arjun'] },
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: "Yes bro! I DON'T CARE what anyone says, we are watching in 4K with Telugu audio and English subtitles synced.",
        timestamp: Date.now() - 3000000,
        timeFormatted: '03:52 PM',
        isSelf: true,
        isEncrypted: true,
        isVanish: false,
        reactions: { '💯': ['Arjun'] },
      },
      {
        id: 'm3',
        senderId: 'u1',
        senderName: 'Arjun Dev',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Voice note sent',
        timestamp: Date.now() - 1800000,
        timeFormatted: '04:12 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        voiceNote: {
          durationSec: 14,
          waveform: [15, 30, 45, 80, 60, 40, 95, 100, 75, 45, 60, 85, 40, 20],
        },
        reactions: {},
      },
      {
        id: 'm4',
        senderId: 'u1',
        senderName: 'Arjun Dev',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Secret VIP Pass (View Once Photo)',
        timestamp: Date.now() - 900000,
        timeFormatted: '04:30 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        viewOnce: true,
        viewOnceOpened: false,
        mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        reactions: {},
      },
      {
        id: 'm5',
        senderId: 'u1',
        senderName: 'Arjun Dev',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'బ్రో, వాచ్ పార్టీ మొదలైంది! రూమ్‌లోకి రా.',
        timestamp: Date.now() - 300000,
        timeFormatted: '04:42 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        reactions: {},
      },
    ],
  },
  {
    id: 'c2',
    partnerId: 'u2',
    partnerName: 'Vikram Chennai (Tamil)',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastSeen: 'Active now',
    unreadCount: 0,
    isVanishMode: true,
    isPinned: false,
    securityFingerprint: '77218 99104 22819 10492 88310 11920',
    preferredLanguage: 'ta',
    lastMessage: {
      text: 'Live GPS Location Shared (1h Timer)',
      time: '04:20 PM',
      isSelf: false,
      isEncrypted: true,
    },
    messages: [
      {
        id: 'm20',
        senderId: 'u2',
        senderName: 'Vikram Chennai',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'நான் தியேட்டர் பக்கம் வந்துட்டேன் ப்ரோ! (Heading towards theater)',
        timestamp: Date.now() - 1200000,
        timeFormatted: '04:15 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: true,
        vanishDurationSec: 3600,
        reactions: { '🤙': ['You'] },
      },
      {
        id: 'm21',
        senderId: 'u2',
        senderName: 'Vikram Chennai',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Live Location Tracking',
        timestamp: Date.now() - 600000,
        timeFormatted: '04:20 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: true,
        vanishDurationSec: 3600,
        locationShare: {
          latitude: 13.0827,
          longitude: 80.2707,
          address: 'Anna Salai, Chennai (Near Express Avenue)',
          etaMinutes: 8,
          distanceKm: 3.1,
          expiryTimestamp: Date.now() + 3000000,
        },
        reactions: {},
      },
    ],
  },
  {
    id: 'c3',
    partnerId: 'u3',
    partnerName: 'Kavya Bangalore (Kannada)',
    partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isOnline: false,
    lastSeen: '15m ago',
    unreadCount: 0,
    isVanishMode: false,
    isPinned: false,
    securityFingerprint: '55102 33819 90124 49201 88310 47219',
    preferredLanguage: 'kn',
    lastMessage: {
      text: 'ಧನ್ಯವಾದಗಳು ಬ್ರೋ! Live Translation worked like magic.',
      time: '03:10 PM',
      isSelf: false,
      isEncrypted: true,
    },
    messages: [
      {
        id: 'm30',
        senderId: 'u3',
        senderName: 'Kavya',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'ಧನ್ಯವಾದಗಳು ಬ್ರೋ! Live Translation worked like magic.',
        timestamp: Date.now() - 5400000,
        timeFormatted: '03:10 PM',
        isSelf: false,
        isEncrypted: true,
        isVanish: false,
        reactions: { '❤️': ['You'] },
      },
    ],
  },
  {
    id: 'c4',
    partnerId: 'u4',
    partnerName: 'Rohan Mumbai (Hindi)',
    partnerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastSeen: 'Active now',
    unreadCount: 0,
    isVanishMode: false,
    isPinned: false,
    securityFingerprint: '11920 77218 99104 22819 10492 88310',
    preferredLanguage: 'hi',
    lastMessage: {
      text: 'Bhai audio ducking on calls is so clean!',
      time: '02:30 PM',
      isSelf: false,
      isEncrypted: true,
    },
    messages: [],
  },
];
