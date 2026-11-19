import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Maximize2, 
  Lock, 
  Battery, 
  Clock,
  Compass
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export interface LocationShareData {
  latitude: number;
  longitude: number;
  address: string;
  etaMinutes?: number;
  distanceKm?: number;
  expiryTimestamp: number;
}

interface ChatMapPreviewBubbleProps {
  locationShare: LocationShareData;
  partnerName: string;
  partnerAvatar: string;
  onOpenFullScreen: () => void;
  isSelf?: boolean;
}

export const ChatMapPreviewBubble: React.FC<ChatMapPreviewBubbleProps> = ({
  locationShare,
  partnerName,
  partnerAvatar,
  onOpenFullScreen,
  isSelf = false,
}) => {
  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  const center = {
    lat: locationShare.latitude,
    lng: locationShare.longitude,
  };

  // Remaining time calculation
  const remainingMinutes = Math.max(
    1,
    Math.round((locationShare.expiryTimestamp - Date.now()) / 60000)
  );

  return (
    <div 
      onClick={onOpenFullScreen}
      className="group relative w-full sm:max-w-sm rounded-[20px] overflow-hidden bg-[#181818] border border-white/15 shadow-xl cursor-pointer hover:border-emerald-500/50 transition-all active:scale-[0.99] select-none"
    >
      {/* Top Status Banner Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="tracking-wide text-emerald-300">LIVE GPS</span>
          <span className="text-white/40">•</span>
          <span className="text-neutral-300 font-mono">{remainingMinutes}m left</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-300 shadow-md">
          <span>⚡ 84%</span>
        </div>
      </div>

      {/* Miniaturized Map Container */}
      <div className="relative w-full h-[155px] bg-[#121415] overflow-hidden">
        {mapsApiKey ? (
          <APIProvider apiKey={mapsApiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={center}
              defaultZoom={15}
              disableDefaultUI={true}
              gestureHandling="none"
              style={{ width: '100%', height: '100%' }}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              <AdvancedMarker position={center}>
                <div className="relative flex flex-col items-center">
                  {/* Pulsing Radar Ring */}
                  <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping" />
                  
                  {/* Avatar Beacon Pin */}
                  <div className="relative w-9 h-9 rounded-full p-[2px] bg-emerald-500 shadow-xl border-2 border-[#121212]">
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {/* Pin Point */}
                  <div className="w-2 h-2 bg-emerald-500 rotate-45 -mt-1 shadow" />
                </div>
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          /* High-Fidelity Styled Radar Fallback if Key loading */
          <div className="w-full h-full bg-gradient-to-b from-[#131d17] via-[#0d1410] to-[#090e0b] relative flex items-center justify-center">
            {/* Concentric radar rings */}
            <div className="absolute w-36 h-36 rounded-full border border-emerald-500/15 animate-ping" />
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/25" />
            <div className="absolute w-12 h-12 rounded-full border border-emerald-500/40" />

            {/* Center Beacon */}
            <div className="relative flex flex-col items-center z-10">
              <div className="w-9 h-9 rounded-full p-[2px] bg-emerald-500 shadow-xl border-2 border-[#121212]">
                <img
                  src={partnerAvatar}
                  alt={partnerName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="w-2 h-2 bg-emerald-500 rotate-45 -mt-1 shadow" />
            </div>

            {/* Map Grid Texture */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            />
          </div>
        )}

        {/* Floating Tap-to-Expand Prompt */}
        <div className="absolute bottom-2 right-2 z-20 bg-black/80 hover:bg-[#A9003D] text-white p-1.5 rounded-full border border-white/20 shadow-lg transition-colors flex items-center justify-center">
          <Maximize2 className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Bottom Info Card */}
      <div className="p-3 bg-[#191919] border-t border-white/10 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-white truncate max-w-[210px]">
            {locationShare.address}
          </p>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {locationShare.etaMinutes || 4} min ETA
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1 font-mono">
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span>{locationShare.distanceKm || 1.2} km away</span>
          </span>

          <span className="text-[10px] text-rose-300 font-semibold group-hover:text-white transition-colors flex items-center gap-1">
            <span>Tap for Full-Screen Radar</span>
            <span>→</span>
          </span>
        </div>
      </div>
    </div>
  );
};
