import React from 'react';
import { Bot, MessageCircle, AudioLines } from 'lucide-react';
import type { AppMode } from '../../types/bro';

interface LiquidGlassModeSwitcherProps {
  selectedMode: AppMode;
  onModeChanged: (mode: AppMode) => void;
  isBusy?: boolean;
}

interface ModeDef {
  id: AppMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeColor: string;
  glowColor: string;
  isMono?: boolean;
}

const MODES: ModeDef[] = [
  {
    id: 'agent',
    label: 'Agent',
    icon: Bot,
    activeColor: '#818CF8',
    glowColor: '#6366F1',
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageCircle,
    activeColor: '#38BDF8',
    glowColor: '#0EA5E9',
  },
  {
    id: 'bro',
    label: 'BRO',
    icon: AudioLines,
    activeColor: '#00E5FF',
    glowColor: '#00E5FF',
    isMono: true,
  },
];

export const LiquidGlassModeSwitcher: React.FC<LiquidGlassModeSwitcherProps> = ({
  selectedMode,
  onModeChanged,
  isBusy = false,
}) => {
  const isBro = selectedMode === 'bro';

  return (
    <div className="w-full flex justify-center px-4 py-2 shrink-0 relative z-20">
      <div
        role="tablist"
        aria-label="BRO Operating Mode"
        className={`w-full max-w-[440px] rounded-[30px] p-1 backdrop-blur-xl transition-all duration-200 border ${
          isBro
            ? 'bg-[#020B14]/70 border-[#00E5FF]/35 shadow-[0_4px_18px_rgba(0,229,255,0.15)]'
            : 'bg-white/75 dark:bg-white/[0.06] border-black/10 dark:border-white/[0.14] shadow-[0_4px_18px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_18px_rgba(0,0,0,0.35)]'
        }`}
      >
        <div className="grid grid-cols-3 gap-1">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                disabled={isBusy}
                onClick={() => {
                  if (!isBusy && selectedMode !== m.id) {
                    onModeChanged(m.id);
                  }
                }}
                style={
                  isSelected
                    ? {
                        background: `linear-gradient(135deg, ${m.glowColor}4D, ${m.activeColor}24)`,
                        borderColor: `${m.activeColor}A6`,
                        boxShadow: `0 0 12px 1px ${m.glowColor}44`,
                      }
                    : undefined
                }
                className={`min-h-[40px] flex items-center justify-center gap-1.5 rounded-[24px] py-2 px-3 border transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]/60 ${
                  isSelected
                    ? isBro
                      ? 'text-white font-extrabold'
                      : 'text-slate-900 dark:text-white font-extrabold'
                    : isBro
                    ? 'border-transparent text-white/50 hover:text-white/80 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white/80 font-semibold'
                } ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span style={{ color: isSelected ? m.activeColor : undefined }}>
                  <Icon className="w-4 h-4 shrink-0" />
                </span>
                <span
                  className={`text-[12.5px] ${
                    m.isMono ? 'font-mono tracking-[0.14em]' : 'tracking-[0.02em]'
                  }`}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
