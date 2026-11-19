import React from 'react';
import { 
  Phone, 
  Video, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Lock, 
  Sparkles,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Conversation } from '../data/mockData';

interface CallsListViewProps {
  conversations: Conversation[];
  onStartCall: (convo: Conversation, isVideo?: boolean) => void;
  onOpenPro: () => void;
  isPro: boolean;
}

export const CallsListView: React.FC<CallsListViewProps> = ({
  conversations,
  onStartCall,
  onOpenPro,
  isPro,
}) => {
  const callLogs = [
    {
      id: 'cl_1',
      partner: conversations[0], // Rahul Sharma
      type: 'outgoing',
      isVideo: false,
      date: 'Today, 2:45 PM',
      duration: '04:12',
      status: 'HD Voice • Translated (HI ⇄ TE)',
    },
    {
      id: 'cl_2',
      partner: conversations[1], // Priya Reddy
      type: 'incoming',
      isVideo: true,
      date: 'Yesterday, 9:47 AM',
      duration: '09:47',
      status: '4K Video • E2EE Encrypted',
    },
    {
      id: 'cl_3',
      partner: conversations[2], // Kavitha Chennai
      type: 'missed',
      isVideo: false,
      date: 'Nov 10, 8:15 PM',
      duration: 'Missed',
      status: 'Signal MLS Protocol',
    },
    {
      id: 'cl_4',
      partner: conversations[3] || conversations[0], // Arjun
      type: 'outgoing',
      isVideo: false,
      date: 'Nov 09, 6:30 PM',
      duration: '02:18',
      status: 'Voice Ducking 192kbps',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#131313] min-h-screen relative select-none">
      {/* Top Banner */}
      <div className="p-4 sm:px-6 bg-[#161616] border-b border-[#242424] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Calls</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> MLS E2EE
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Two-way real-time voice translation across 5 Indian languages
          </p>
        </div>

        {/* Pro Recording Badge */}
        <button
          onClick={onOpenPro}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1e1e1e] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold hover:bg-[#252525] transition-all"
        >
          <span className="bg-[#D4AF37] text-black text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
            VIP
          </span>
          <span>{isPro ? 'Call REC Active' : 'Enable REC'}</span>
        </button>
      </div>

      {/* Call History Stream */}
      <div className="flex-1 divide-y divide-[#222] p-2">
        {callLogs.map((log) => {
          const isMissed = log.type === 'missed';
          return (
            <div
              key={log.id}
              className="p-3 sm:px-4 flex items-center justify-between hover:bg-[#1a1a1a] rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with online dot */}
                <div className="relative shrink-0">
                  <img
                    src={log.partner.partnerAvatar}
                    alt={log.partner.partnerName}
                    className="w-12 h-12 rounded-full object-cover border border-[#2a2a2a]"
                  />
                  {log.partner.isOnline && (
                    <span className="w-3 h-3 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#131313]" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isMissed ? 'text-red-400' : 'text-white'}`}>
                    {log.partner.partnerName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                    {log.type === 'incoming' && <PhoneIncoming className="w-3 h-3 text-emerald-400" />}
                    {log.type === 'outgoing' && <PhoneOutgoing className="w-3 h-3 text-neutral-400" />}
                    {log.type === 'missed' && <PhoneMissed className="w-3 h-3 text-red-400" />}
                    
                    <span>{log.date}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="font-mono text-[11px] text-neutral-300">{log.duration}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    {log.status}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onStartCall(log.partner, false)}
                  className="w-9 h-9 rounded-full bg-[#1f1f1f] hover:bg-emerald-600 hover:text-white text-neutral-300 flex items-center justify-center transition-all shadow-sm active:scale-90"
                  title="Start Live Voice Translation Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onStartCall(log.partner, true)}
                  className="w-9 h-9 rounded-full bg-[#1f1f1f] hover:bg-rose-600 hover:text-white text-neutral-300 flex items-center justify-center transition-all shadow-sm active:scale-90"
                  title="Start 4K Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 z-20">
        <button
          onClick={() => onStartCall(conversations[0], false)}
          className="w-13 h-13 rounded-full bg-gradient-to-r from-[#A9003D] to-[#E1306C] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
          title="New Encrypted Call"
        >
          <Phone className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
};
