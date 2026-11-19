import React, { useState } from 'react';
import { X, ArrowUp } from 'lucide-react';

interface FloatingCopilotBubbleProps {
  visible: boolean;
  onQuickCommand: (command: string) => void;
  onCloseOverlay: () => void;
}

export const FloatingCopilotBubble: React.FC<FloatingCopilotBubbleProps> = ({
  visible,
  onQuickCommand,
  onCloseOverlay,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');

  if (!visible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    onQuickCommand(cmd);
    setInput('');
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2.5">
      {expanded && (
        <div className="w-72 rounded-2xl p-3.5 bg-[#0A1522]/95 backdrop-blur-xl border border-[#00E5FF]/45 shadow-[0_0_24px_rgba(0,229,255,0.25)] text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-[#00E5FF]">
              BRO COPILOT
            </span>
            <button
              type="button"
              onClick={onCloseOverlay}
              aria-label="Hide floating copilot bubble"
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Quick BRO directive…"
              aria-label="Quick BRO copilot command"
              className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00E5FF]"
            />
            <button
              type="submit"
              aria-label="Run copilot command"
              className="w-9 h-9 rounded-xl bg-[#00E5FF] text-slate-950 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label="Toggle BRO Floating Copilot"
        className="w-14 h-14 rounded-full bg-black/90 border-2 border-[#00E5FF]/70 shadow-[0_0_20px_rgba(0,229,255,0.4)] p-1.5 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      >
        <img
          src="/assets/bro/bro_core_cyan.png"
          alt="BRO Copilot Orb"
          className="w-full h-full object-contain animate-bro-spin"
        />
      </button>
    </div>
  );
};
