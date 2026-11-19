import React from 'react';
import { X, Hand, Radio, Sparkles, VolumeX, ArrowRight } from 'lucide-react';

interface AirGesturesDialogProps {
  isOpen: boolean;
  isEnabled: boolean;
  onClose: () => void;
  onToggleEnabled: () => void;
  onTriggerGesture: (label: string, actionCommand?: string) => void;
}

const GESTURES = [
  {
    id: 'single_wave',
    title: 'Single Hand Wave',
    mapping: 'Wake BRO Voice Receptor',
    icon: Hand,
    banner: 'AIR GESTURE: SINGLE WAVE -> WAKE BRO',
    command: 'always on',
  },
  {
    id: 'double_wave',
    title: 'Double Hand Wave',
    mapping: 'Toggle 3D Hologram / Arc Core',
    icon: ArrowRight,
    banner: 'AIR GESTURE: DOUBLE WAVE -> SWITCH HOLOGRAM',
    command: 'hologram',
  },
  {
    id: 'palm_hold',
    title: 'Hold Palm Over Sensor',
    mapping: 'Silence Audio & Standby',
    icon: VolumeX,
    banner: 'AIR GESTURE: PALM HOLD -> STANDBY',
    command: 'turn off always on',
  },
];

export const AirGesturesDialog: React.FC<AirGesturesDialogProps> = ({
  isOpen,
  isEnabled,
  onClose,
  onToggleEnabled,
  onTriggerGesture,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Air Gestures HUD"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <div className="w-full max-w-md rounded-[24px] p-5 bg-[#0A1522]/95 border border-[#00E5FF]/45 shadow-[0_0_32px_rgba(0,229,255,0.2)] text-white">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/50 flex items-center justify-center">
              <Radio className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-bold tracking-[0.14em] text-[#00E5FF]">
                AIR GESTURES HUD
              </h2>
              <p className="text-[11px] text-slate-400">
                Optical proximity &amp; touchless hand sensing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Air Gestures HUD"
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
          <div>
            <p className="text-sm font-semibold text-white">Proximity Sensor Suite</p>
            <p className="text-xs text-slate-400">
              {isEnabled ? 'Active · Listening for mid-air hand passes' : 'Standby · Enable to detect gestures'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isEnabled}
            onClick={onToggleEnabled}
            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
              isEnabled ? 'bg-[#00E5FF]' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 px-1">
            Test a Mid-Air Gesture
          </p>
          {GESTURES.map((g) => {
            const Icon = g.icon;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  onTriggerGesture(g.banner, g.command);
                  onClose();
                }}
                className="w-full p-3.5 rounded-2xl bg-white/[0.04] hover:bg-[#00E5FF]/15 border border-white/10 hover:border-[#00E5FF]/45 flex items-center justify-between text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{g.title}</p>
                    <p className="text-xs text-slate-400">{g.mapping}</p>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-[#00E5FF]/70 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
