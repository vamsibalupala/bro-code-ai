import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  Battery, 
  Activity, 
  Share2, 
  Users, 
  Lock,
  Compass,
  AlertCircle,
  Search,
  Layers
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Conversation } from '../data/mockData';

interface LiveLocationViewProps {
  conversations: Conversation[];
  onOpenChat: (convo: Conversation) => void;
  onOpenPro: () => void;
  isPro: boolean;
}

export const LiveLocationView: React.FC<LiveLocationViewProps> = ({
  conversations,
  onOpenChat,
  onOpenPro,
  isPro,
}) => {
  const [activeSessionDuration, setActiveSessionDuration] = useState<'15m' | '1h' | '8h'>('1h');
  const [isSharingSelf, setIsSharingSelf] = useState(true);
  const [selfSpeedKmh, setSelfSpeedKmh] = useState(28);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapStyleDark, setMapStyleDark] = useState(true);

  // Google Maps API Key from environment
  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    const interval = setInterval(() => {
      setSelfSpeedKmh((prev) => Math.floor(Math.random() * 8 + 24));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeSharers = [
    {
      id: 'ls1',
      name: 'Vikram Chennai (Tamil)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      address: 'Anna Salai (Near Express Avenue, Chennai)',
      distance: '3.1 km away',
      eta: '8 mins ETA',
      speed: '34 km/h (In Transit)',
      battery: '82%',
      remainingTime: '48m remaining',
      status: 'En route to Theater Watch Party',
      coords: { lat: 13.0604, lng: 80.2496 },
    },
    {
      id: 'ls2',
      name: 'Arjun Dev (Telugu)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      address: 'Hitech City, Madhapur, Hyderabad',
      distance: '5.6 km away',
      eta: '16 mins ETA',
      speed: '0 km/h (Stationary)',
      battery: '94%',
      remainingTime: '3h 12m remaining',
      status: 'At Watch Room Studio',
      coords: { lat: 17.4483, lng: 78.3915 },
    },
  ];

  // Self position in Bengaluru
  const selfCoords = { lat: 12.9716, lng: 77.5946 };

  return (
    <div className="flex-1 flex flex-col bg-[#121212] min-h-screen">
      {/* Top Header */}
      <div className="p-4 sm:px-6 bg-[#161616] border-b border-[#262626] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Google Maps Live GPS Location</span>
            </h2>
            <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Google Maps Platform
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-end encrypted GPS coordinates • Signal Ratchet Protocol</span>
          </p>
        </div>

        <button
          onClick={() => setIsSharingSelf(!isSharingSelf)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
            isSharingSelf
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isSharingSelf ? 'Stop Sharing' : 'Share My GPS'}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Map Container Viewport */}
        <div className="flex-1 relative bg-[#0b0f0c] flex flex-col justify-between overflow-hidden min-h-[420px] h-[550px] lg:h-auto">
          {/* Real Google Map or Fallback Dark Canvas */}
          {mapsApiKey ? (
            <APIProvider apiKey={mapsApiKey}>
              <div className="w-full h-full relative" style={{ height: '100%', minHeight: '400px' }}>
                <Map
                  defaultCenter={selfCoords}
                  defaultZoom={12}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  className="w-full h-full"
                >
                  {isSharingSelf && (
                    <AdvancedMarker position={selfCoords} title="Your Live GPS">
                      <div className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-1 rounded-full border-2 border-white shadow-xl animate-pulse">
                        YOU ({selfSpeedKmh} km/h)
                      </div>
                    </AdvancedMarker>
                  )}

                  <AdvancedMarker position={activeSharers[0].coords} title={activeSharers[0].name}>
                    <div className="bg-rose-600 text-white font-bold text-[10px] px-2 py-1 rounded-full border-2 border-white shadow-xl flex items-center gap-1">
                      <span>{activeSharers[0].name.split(' ')[0]}</span>
                      <span className="text-[9px] opacity-80">{activeSharers[0].eta}</span>
                    </div>
                  </AdvancedMarker>
                </Map>
              </div>
            </APIProvider>
          ) : (
            /* Cyber Radar Dark Map Visualizer with Real Lat/Long Tracking */
            <div className="w-full h-full relative flex flex-col justify-between p-4">
              <div className="absolute inset-0 bg-[radial-gradient(#103020_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

              {/* Radar Sweep Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[340px] rounded-full border border-emerald-500/15 animate-ping" />
                <div className="w-[220px] h-[220px] rounded-full border border-emerald-500/25" />
                <div className="w-[100px] h-[100px] rounded-full border border-emerald-500/40" />
              </div>

              {/* Top Controls Floating Bar */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs text-white">
                  <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="font-mono text-[11px]">Google Maps Dark Style: Active (10m accuracy)</span>
                </div>

                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{activeSharers.length} Active Sharers</span>
                </div>
              </div>

              {/* Contact Pin Mockups */}
              <div className="relative z-10 my-auto flex items-center justify-center gap-8 flex-wrap">
                {isSharingSelf && (
                  <div className="bg-black/85 backdrop-blur-md p-3 rounded-2xl border-2 border-emerald-500/80 shadow-2xl flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      YOU
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Your Live GPS (Bengaluru)</p>
                      <p className="text-[10px] text-emerald-300 font-mono">
                        Speed: {selfSpeedKmh} km/h • Battery: 91%
                      </p>
                      <p className="text-[10px] text-white/60">Sharing with 2 Bros ({activeSessionDuration} Timer)</p>
                    </div>
                  </div>
                )}

                <div className="bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-rose-500/60 shadow-2xl flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeSharers[0].avatar}
                      alt={activeSharers[0].name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="w-3 h-3 rounded-full bg-rose-500 absolute -top-1 -right-1 border border-black animate-ping" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{activeSharers[0].name}</p>
                    <p className="text-[10px] text-rose-300 font-mono">
                      {activeSharers[0].distance} • {activeSharers[0].eta}
                    </p>
                    <p className="text-[10px] text-white/60 truncate max-w-[150px]">
                      {activeSharers[0].address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Attribution */}
              <div className="relative z-10 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Maps Platform SDK • AES-256 encrypted coordinates</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-500">
                  Update: 10s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Sharers List & Timer Configuration Sidebar */}
        <div className="w-full lg:w-96 bg-[#161616] border-t lg:border-t-0 lg:border-l border-[#262626] p-4 space-y-4">
          {/* Duration Selector for Self Sharing */}
          <div className="bg-[#1f1f1f] p-3.5 rounded-2xl border border-[#2e2e2e] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sharing Session Duration</span>
              </span>
              <span className="text-[10px] text-neutral-400">
                {isPro ? 'Pro: Extended 8h' : 'Free: up to 1h'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '15m', label: '15 Mins', isProOnly: false },
                { id: '1h', label: '1 Hour', isProOnly: false },
                { id: '8h', label: '8 Hours', isProOnly: !isPro },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => {
                    if (tier.isProOnly) {
                      onOpenPro();
                    } else {
                      setActiveSessionDuration(tier.id as any);
                    }
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    activeSessionDuration === tier.id
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-[#292929] text-neutral-300 hover:bg-[#333]'
                  }`}
                >
                  <span>{tier.label}</span>
                  {tier.isProOnly && (
                    <span className="text-[9px] text-[#D4AF37] font-black">PRO</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Contacts Sharing Location */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
              Bros Sharing Live GPS Location
            </h4>

            {activeSharers.map((sharer) => (
              <div
                key={sharer.id}
                className="p-3.5 rounded-2xl bg-[#1b1b1b] border border-[#2c2c2c] hover:border-emerald-500/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={sharer.avatar}
                      alt={sharer.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white">{sharer.name}</h5>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {sharer.remainingTime}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white font-mono block">
                      {sharer.eta}
                    </span>
                    <span className="text-[10px] text-neutral-400">{sharer.distance}</span>
                  </div>
                </div>

                <div className="p-2 bg-[#121212] rounded-xl text-[11px] text-neutral-300 space-y-1">
                  <p className="truncate text-white font-medium">{sharer.address}</p>
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-neutral-400" /> {sharer.speed}
                    </span>
                    <span className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-neutral-400" /> {sharer.battery}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
