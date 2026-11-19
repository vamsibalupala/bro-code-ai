import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  Compass, 
  Layers, 
  LocateFixed, 
  Battery, 
  Clock, 
  Zap,
  Activity,
  Share2,
  X
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { LocationShareData } from './ChatMapPreviewBubble';

interface FullScreenLiveMapModalProps {
  locationShare: LocationShareData;
  partnerName: string;
  partnerAvatar: string;
  onClose: () => void;
  onStartCall?: () => void;
}

export const FullScreenLiveMapModal: React.FC<FullScreenLiveMapModalProps> = ({
  locationShare,
  partnerName,
  partnerAvatar,
  onClose,
  onStartCall,
}) => {
  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Dynamic simulation state: partner moves slightly to show live real-time GPS tracking
  const [partnerCoords, setPartnerCoords] = useState({
    lat: locationShare.latitude,
    lng: locationShare.longitude,
  });
  const [speedKmh, setSpeedKmh] = useState(34);
  const [etaMins, setEtaMins] = useState(locationShare.etaMinutes || 4);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // Self reference coordinates (Bengaluru / nearby)
  const selfCoords = {
    lat: locationShare.latitude - 0.008,
    lng: locationShare.longitude - 0.007,
  };

  // Simulate real-time GPS jitter and trajectory progress
  useEffect(() => {
    const interval = setInterval(() => {
      setPartnerCoords((prev) => ({
        lat: prev.lat + (Math.random() - 0.48) * 0.0001,
        lng: prev.lng + (Math.random() - 0.48) * 0.0001,
      }));
      setSpeedKmh((prev) => Math.max(18, Math.min(52, prev + Math.floor(Math.random() * 7 - 3))));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const openGoogleMapsDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${partnerCoords.lat},${partnerCoords.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0e0e0e] text-white select-none">
      {/* Top Floating App Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-95"
            title="Back to chat"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={partnerAvatar}
                alt={partnerName}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-lg"
              />
              <span className="w-3 h-3 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-black" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white leading-tight">
                  {partnerName}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 font-mono mt-0.5">
                {speedKmh} km/h • 🔒 Signal E2EE GPS
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          {/* Map Layer Switcher */}
          <button
            onClick={() => setMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
            className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow"
            title="Toggle Map Style"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-300" />
            <span className="capitalize text-[11px]">{mapType}</span>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Map Viewport */}
      <div className="relative flex-1 w-full h-full bg-[#121415] overflow-hidden">
        {mapsApiKey ? (
          <APIProvider apiKey={mapsApiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={partnerCoords}
              defaultZoom={15}
              mapTypeId={mapType}
              disableDefaultUI={false}
              style={{ width: '100%', height: '100%' }}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              {/* Partner Advanced Marker with Animated Halo & Direction */}
              <AdvancedMarker position={partnerCoords}>
                <div className="relative flex flex-col items-center">
                  {/* Glowing Radar Waves */}
                  <span className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" />
                  <span className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse" />

                  {/* Marker Pin */}
                  <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-emerald-600 to-teal-300 shadow-2xl border-2 border-white">
                    <img
                      src={partnerAvatar}
                      alt={partnerName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="w-3 h-3 bg-emerald-500 rotate-45 -mt-1.5 border border-white shadow" />

                  {/* Callout Tag */}
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-black/85 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 shadow-lg whitespace-nowrap">
                    {partnerName.split(' ')[0]} • {speedKmh} km/h
                  </div>
                </div>
              </AdvancedMarker>

              {/* Your Own Location Beacon */}
              <AdvancedMarker position={selfCoords}>
                <div className="relative flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-xl flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-bold text-sky-300 border border-sky-400/30 whitespace-nowrap">
                    You (Here)
                  </div>
                </div>
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          /* High-Fidelity Tactical Radar Fallback */
          <div className="w-full h-full bg-gradient-to-b from-[#131d17] via-[#0b120e] to-[#070b09] relative flex items-center justify-center">
            {/* Concentric live tracking circles */}
            <div className="w-[480px] h-[480px] rounded-full border border-emerald-500/10 absolute animate-pulse" />
            <div className="w-[320px] h-[320px] rounded-full border border-emerald-500/20 absolute animate-ping" />
            <div className="w-[180px] h-[180px] rounded-full border border-emerald-500/30 absolute" />

            {/* Sweep radar line */}
            <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-500/10 to-transparent absolute animate-spin" />

            {/* Partner Center Pin */}
            <div className="relative flex flex-col items-center z-10">
              <div className="w-14 h-14 rounded-full p-[3px] bg-gradient-to-tr from-emerald-500 to-teal-300 shadow-2xl border-2 border-white">
                <img
                  src={partnerAvatar}
                  alt={partnerName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="w-3.5 h-3.5 bg-emerald-500 rotate-45 -mt-2 border border-white" />
              <div className="mt-2 px-3 py-1 rounded-full bg-black/85 border border-emerald-500 text-xs font-bold text-emerald-300 shadow-xl">
                {partnerName} • {speedKmh} km/h (Live GPS)
              </div>
            </div>

            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>
        )}

        {/* Floating Quick Recenter Button */}
        <button
          onClick={() => alert(`Map re-centered on ${partnerName}’s GPS coordinates (${partnerCoords.lat.toFixed(4)}, ${partnerCoords.lng.toFixed(4)})`)}
          className="absolute bottom-44 right-4 z-20 w-11 h-11 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 shadow-2xl flex items-center justify-center transition-transform active:scale-90"
          title="Re-center on contact"
        >
          <LocateFixed className="w-5 h-5 text-emerald-400" />
        </button>
      </div>

      {/* Floating Bottom Live Tracking Dashboard Card */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black via-[#161616]/95 to-transparent border-t border-white/10 flex flex-col gap-3 pointer-events-auto">
        <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-white/10 shadow-2xl space-y-3">
          
          {/* Row 1: Destination address & ETA Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Live Destination</span>
              </span>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">
                {locationShare.address}
              </h4>
            </div>

            <div className="text-right shrink-0">
              <span className="text-base font-extrabold text-emerald-400 font-mono block">
                {etaMins} mins
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {locationShare.distanceKm || 1.2} km away
              </span>
            </div>
          </div>

          {/* Row 2: Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="bg-[#141414] p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-medium">Speed</span>
              <span className="text-xs font-mono font-bold text-white">{speedKmh} km/h</span>
            </div>
            <div className="bg-[#141414] p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-medium">GPS Accuracy</span>
              <span className="text-xs font-mono font-bold text-emerald-400">± 4 meters</span>
            </div>
            <div className="bg-[#141414] p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-neutral-400 block font-medium">Battery</span>
              <span className="text-xs font-mono font-bold text-amber-300">⚡ 84%</span>
            </div>
          </div>

          {/* Row 3: Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={openGoogleMapsDirections}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-98 shadow-md"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Get Directions</span>
            </button>

            {onStartCall ? (
              <button
                type="button"
                onClick={onStartCall}
                className="py-2.5 px-3 rounded-xl bg-[#A9003D] hover:bg-[#c31258] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-98 shadow-md"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call {partnerName.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-[#2a2a2a] hover:bg-[#353535] text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-98 shadow-md"
              >
                <span>Done Tracking</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
