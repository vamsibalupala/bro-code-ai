import React, { useState, useRef } from 'react';
import {
  Ear,
  EarOff,
  GitFork,
  Brain,
  Hand,
  Orbit,
  UserCheck,
  Sparkles,
  CircleDot,
  Mic,
  MicOff,
  ArrowUp,
  Square,
  Zap,
  AudioLines,
  Cpu,
} from 'lucide-react';
import type { BroPhase, BroScreenStyle } from '../../types/bro';
import { getPhaseAccentColor, getPhaseLabel } from '../../utils/broEngine';

interface BroHudViewProps {
  phase: BroPhase;
  executionStep: number;
  screenStyle: BroScreenStyle;
  alwaysOn: boolean;
  airGesturesEnabled: boolean;
  isRecordingMacro: boolean;
  activeGestureBanner: string | null;
  lastUserTranscript: string;
  lastBroReply: string;
  isBusy: boolean;
  onTapHologram: () => void;
  onSendCommand: (text: string) => void;
  onAbortTask: () => void;
  onToggleAlwaysOn: () => void;
  onOpenBrainDump: () => void;
  onTriggerSelfEvolve: () => void;
  onOpenAirGestures: () => void;
  onToggleScreenStyle: () => void;
  onToggleMacro: () => void;
}

export const BroHudView: React.FC<BroHudViewProps> = ({
  phase,
  executionStep,
  screenStyle,
  alwaysOn,
  airGesturesEnabled,
  isRecordingMacro,
  activeGestureBanner,
  lastUserTranscript,
  lastBroReply,
  isBusy,
  onTapHologram,
  onSendCommand,
  onAbortTask,
  onToggleAlwaysOn,
  onOpenBrainDump,
  onTriggerSelfEvolve,
  onOpenAirGestures,
  onToggleScreenStyle,
  onToggleMacro,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  const themeColor = getPhaseAccentColor(phase);
  const isListening = phase === 'listening';
  const isThinking = phase === 'thinking';
  const isSpeaking = phase === 'speaking';
  const isExecuting = phase === 'executing';
  const isArc = screenStyle === 'arcReactor';
  const showStatusPill = phase !== 'idle';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commandInput.trim();
    if (!trimmed || isBusy) return;
    onSendCommand(trimmed);
    setCommandInput('');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, moved: false };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    if (Math.hypot(dx, dy) > 8) {
      pointerStartRef.current.moved = true;
      setDragOffset((prev) => ({
        x: Math.max(-90, Math.min(90, prev.x + e.movementX * 0.65)),
        y: Math.max(-55, Math.min(55, prev.y + e.movementY * 0.65)),
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (start && !start.moved) {
      const rect = stageRef.current?.getBoundingClientRect();
      if (rect) {
        setRipple({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          key: Date.now(),
        });
      }
      onTapHologram();
    }
  };

  const tiltY = Math.max(-14, Math.min(14, dragOffset.x * 0.16));
  const tiltX = Math.max(-12, Math.min(12, -dragOffset.y * 0.16));

  // Precomputed radial equalizer spike angles (48 spikes around 360 deg)
  const eqBars = Array.from({ length: 48 }, (_, i) => {
    const angle = (i / 48) * Math.PI * 2;
    const waveMod = Math.sin(i * 1.45) * 0.5 + 0.5;
    const len = isSpeaking
      ? 14 + waveMod * 22
      : isListening
      ? 10 + waveMod * 14
      : isThinking
      ? 8 + waveMod * 10
      : 5 + waveMod * 6;
    return { angle, len };
  });

  return (
    <div
      data-testid="bro-hud-stage"
      data-phase={phase}
      data-screen-style={screenStyle}
      className="relative flex-1 flex flex-col bg-transparent overflow-hidden select-none"
    >
      {/* 1. Subtle Cyber Matrix Grid Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 transition-colors duration-500"
        style={{
          backgroundImage: `linear-gradient(${themeColor}22 1px, transparent 1px), linear-gradient(90deg, ${themeColor}22 1px, transparent 1px)`,
          backgroundSize: '42px 42px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 45%, black 30%, transparent 100%)',
        }}
      />

      {/* 2. Corner HUD Brackets (Exact Jarvis HUD Geometry) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 sm:inset-5 z-10">
        <span
          className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 transition-colors duration-300"
          style={{ borderColor: `${themeColor}66` }}
        />
        <span
          className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 transition-colors duration-300"
          style={{ borderColor: `${themeColor}66` }}
        />
        <span
          className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 transition-colors duration-300"
          style={{ borderColor: `${themeColor}66` }}
        />
        <span
          className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 transition-colors duration-300"
          style={{ borderColor: `${themeColor}66` }}
        />
      </div>

      {/* 3. Dynamic Status Pill (Appears when actively Listening, Computing, Speaking, or Executing) */}
      <div className="relative z-20 flex flex-col items-center pt-3 px-4 min-h-[38px]">
        {showStatusPill && (
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050505]/85 backdrop-blur-md border transition-all duration-300"
            style={{
              borderColor: `${themeColor}88`,
              boxShadow: `0 0 14px ${themeColor}38`,
            }}
          >
            {isListening && <AudioLines className="w-3.5 h-3.5" style={{ color: themeColor }} />}
            {isThinking && <Cpu className="w-3.5 h-3.5 animate-pulse" style={{ color: themeColor }} />}
            {isSpeaking && <AudioLines className="w-3.5 h-3.5 animate-pulse" style={{ color: themeColor }} />}
            {isExecuting && <Zap className="w-3.5 h-3.5" style={{ color: themeColor }} />}
            <span
              className="font-mono text-[10.5px] font-bold tracking-[0.15em]"
              style={{ color: themeColor }}
            >
              {getPhaseLabel(phase, executionStep)}
            </span>
            {isExecuting && (
              <button
                type="button"
                onClick={onAbortTask}
                aria-label="Abort active task"
                className="ml-1 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
              >
                <Square className="w-2.5 h-2.5 fill-current" />
              </button>
            )}
          </div>
        )}

        {/* Active Mid-Air Gesture Banner */}
        {activeGestureBanner && (
          <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#00E5FF]/15 border border-[#00E5FF] shadow-[0_0_14px_rgba(0,229,255,0.35)]">
            <Hand className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="font-mono text-[10.5px] font-extrabold tracking-[0.11em] text-[#00E5FF]">
              {activeGestureBanner}
            </span>
          </div>
        )}
      </div>

      {/* 4. Central Interactive Zero-Gravity 3D Hologram Arena */}
      <div
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={() => setDragOffset({ x: 0, y: 0 })}
        role="button"
        tabIndex={0}
        aria-label={
          isListening
            ? 'Stop listening to BRO'
            : 'Tap BRO hologram to start voice command or drag to tilt'
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onTapHologram();
          }
        }}
        className="relative flex-1 flex items-center justify-center cursor-pointer touch-none overflow-hidden px-4 py-2 min-h-[280px] focus-visible:outline-none"
      >
        {/* Tap ripple feedback */}
        {ripple && (
          <span
            key={ripple.key}
            className="pointer-events-none absolute w-24 h-24 -ml-12 -mt-12 rounded-full border animate-bro-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              borderColor: themeColor,
            }}
          />
        )}

        {isArc ? (
          /* ======================== SCREEN A: 3D ARC REACTOR SPHERE ======================== */
          <div
            className="relative w-[270px] h-[270px] sm:w-[330px] sm:h-[330px] flex items-center justify-center transition-transform duration-150 ease-out"
            style={{
              transform: `perspective(900px) translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${
                isSpeaking ? 1.04 : isListening ? 1.03 : 1
              })`,
            }}
          >
            {/* A. Multi-Layer Radial Back-Glow Aura */}
            <div
              className="pointer-events-none absolute -inset-6 rounded-full blur-3xl animate-bro-glow transition-colors duration-500"
              style={{
                background: `radial-gradient(circle, ${themeColor}55 0%, ${themeColor}14 48%, transparent 72%)`,
              }}
            />

            {/* B. 360-Degree Circular Radial Audio Equalizer Spikes + Armillary Orbital Rings */}
            <svg
              viewBox="0 0 360 360"
              className="pointer-events-none absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              {/* Outer Gyroscope Orbital Ring */}
              <g
                className={`origin-center ${
                  isThinking ? 'animate-bro-spin-fast' : 'animate-bro-spin'
                }`}
              >
                <circle
                  cx="180"
                  cy="180"
                  r="164"
                  fill="none"
                  stroke={themeColor}
                  strokeOpacity="0.28"
                  strokeWidth="1.2"
                  strokeDasharray="16 10 4 10"
                />
                <circle
                  cx="180"
                  cy="16"
                  r="3"
                  fill={themeColor}
                  fillOpacity="0.85"
                />
              </g>

              {/* Counter-rotating Inner Orbital Ring */}
              <g className="origin-center animate-bro-spin-reverse">
                <circle
                  cx="180"
                  cy="180"
                  r="142"
                  fill="none"
                  stroke={themeColor}
                  strokeOpacity="0.38"
                  strokeWidth="1"
                  strokeDasharray="42 18"
                />
              </g>

              {/* 360-Degree Vocal Equalizer Spikes */}
              <g
                className={`origin-center ${
                  isSpeaking || isListening ? 'animate-bro-spin' : ''
                }`}
              >
                {eqBars.map((b, idx) => {
                  const r1 = 148;
                  const r2 = r1 + b.len;
                  const x1 = 180 + Math.cos(b.angle) * r1;
                  const y1 = 180 + Math.sin(b.angle) * r1;
                  const x2 = 180 + Math.cos(b.angle) * r2;
                  const y2 = 180 + Math.sin(b.angle) * r2;
                  return (
                    <line
                      key={idx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={themeColor}
                      strokeWidth={isSpeaking ? '2.2' : '1.4'}
                      strokeLinecap="round"
                      strokeOpacity={isSpeaking || isListening ? 0.8 : 0.35}
                    />
                  );
                })}
              </g>
            </svg>

            {/* C. Official Rotating 3D Consciousness Core PNG (Crossfade Cyan -> Gold) */}
            <div className="relative w-[84%] h-[84%] animate-bro-levitate">
              <div className="relative w-full h-full animate-bro-spin">
                <img
                  src="/assets/bro/bro_core_cyan.png"
                  alt="BRO 3D Consciousness Core"
                  draggable={false}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                  style={{
                    opacity: isSpeaking ? 0.15 : 1,
                    filter: isThinking
                      ? 'hue-rotate(95deg) saturate(1.25)'
                      : isExecuting
                      ? 'hue-rotate(-140deg) saturate(1.3)'
                      : 'none',
                  }}
                />
                <img
                  src="/assets/bro/bro_core_gold.png"
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                  style={{ opacity: isSpeaking ? 1 : 0 }}
                />
              </div>
            </div>

            {/* D. Speaking / Listening Acoustic Shockwaves */}
            {(isSpeaking || isListening) && (
              <>
                <span
                  className="pointer-events-none absolute w-40 h-40 rounded-full border animate-bro-ripple"
                  style={{ borderColor: `${themeColor}88` }}
                />
                <span
                  className="pointer-events-none absolute w-40 h-40 rounded-full border animate-bro-ripple"
                  style={{ borderColor: `${themeColor}55`, animationDelay: '0.85s' }}
                />
              </>
            )}
          </div>
        ) : (
          /* ======================== SCREEN B: 3D HOLOGRAM SUIT AVATAR ======================== */
          <div
            className="relative flex flex-col items-center justify-center transition-transform duration-150 ease-out"
            style={{
              transform: `perspective(900px) translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            }}
          >
            {/* Volumetric Upward Emitter Cone & Pedestal Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 w-64 h-44 blur-2xl opacity-40 transition-colors duration-500"
              style={{
                background: `radial-gradient(ellipse at bottom, ${themeColor}77 0%, transparent 72%)`,
              }}
            />

            {/* 3D Floating Male Hologram Bust */}
            <div
              className="relative w-[240px] h-[310px] sm:w-[275px] sm:h-[360px] animate-bro-levitate overflow-hidden"
              style={{
                maskImage:
                  'radial-gradient(ellipse 84% 88% at 50% 48%, black 58%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 84% 88% at 50% 48%, black 58%, transparent 100%)',
              }}
            >
              {/* Ambient Backglow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-6 rounded-full blur-3xl transition-colors duration-500"
                style={{
                  background: `radial-gradient(circle, ${themeColor}44 0%, transparent 72%)`,
                }}
              />

              {/* Cyan Hologram Layer (Idle / Listening) */}
              <img
                src="/assets/bro/bro_hologram_cyan.png"
                alt="BRO 3D Hologram Avatar"
                draggable={false}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                style={{ opacity: !isThinking && !isSpeaking ? 1 : 0 }}
              />

              {/* Purple Hologram Layer (Computing / Thinking) */}
              <img
                src="/assets/bro/bro_hologram_purple.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                style={{ opacity: isThinking ? 1 : 0 }}
              />

              {/* Gold Hologram Layer (Speaking / Executing) */}
              <img
                src="/assets/bro/bro_hologram_gold.png"
                alt=""
                aria-hidden="true"
                draggable={false}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
                style={{ opacity: isSpeaking || isExecuting ? 1 : 0 }}
              />

              {/* Chest Arc Reactor Pulse */}
              {(isSpeaking || isListening) && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border animate-bro-ripple"
                  style={{ borderColor: themeColor }}
                />
              )}

              {/* Horizontal Holographic Scanline Sweep */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-1 animate-bro-scan"
                style={{
                  background: `linear-gradient(90deg, transparent, ${themeColor}AA, #FFFFFFCC, ${themeColor}AA, transparent)`,
                }}
              />
            </div>

            {/* Elliptical Perspective Orbital Pedestal Ring */}
            <svg
              viewBox="0 0 280 56"
              className="pointer-events-none -mt-6 w-[250px] sm:w-[290px] h-12"
              aria-hidden="true"
            >
              <ellipse
                cx="140"
                cy="28"
                rx="126"
                ry="18"
                fill="none"
                stroke={themeColor}
                strokeOpacity="0.55"
                strokeWidth="1.4"
                strokeDasharray="10 6"
              />
              <ellipse
                cx="140"
                cy="28"
                rx="88"
                ry="12"
                fill="none"
                stroke={themeColor}
                strokeOpacity="0.35"
                strokeWidth="1"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 5. Live Caption / Executive Briefing Display */}
      <div className="relative z-20 px-4 pb-2 flex flex-col items-center">
        <div className="w-full max-w-xl text-center space-y-1 min-h-[44px] flex flex-col justify-center">
          {lastUserTranscript && (
            <p className="text-xs text-slate-400 truncate px-2">
              “{lastUserTranscript}”
            </p>
          )}
          <p
            className="text-sm sm:text-[15px] font-medium leading-snug px-3 line-clamp-2 transition-colors duration-300"
            style={{ color: lastBroReply ? '#F1F5F9' : `${themeColor}B3` }}
          >
            {lastBroReply ||
              'Tap the hologram or type a directive below to command BRO.'}
          </p>
        </div>

        {/* Inline HUD Quick Voice & Text Command Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-2.5 w-full max-w-lg flex items-center gap-1.5 rounded-[28px] px-3 py-1.5 backdrop-blur-xl bg-white/[0.06] border transition-colors"
          style={{
            borderColor: isListening ? '#00E5FF' : 'rgba(255,255,255,0.14)',
          }}
        >
          <button
            type="button"
            onClick={onTapHologram}
            disabled={isBusy && !isListening}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            style={{
              backgroundColor: isListening ? 'rgba(239,68,68,0.22)' : `${themeColor}1C`,
              color: isListening ? '#EF4444' : themeColor,
            }}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            disabled={isBusy}
            placeholder={
              isListening
                ? 'Listening for voice command…'
                : isThinking
                ? 'Computing directive…'
                : 'Speak or type a command for BRO…'
            }
            aria-label="BRO HUD command input"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none px-2 py-2"
          />

          <button
            type="submit"
            disabled={isBusy || !commandInput.trim()}
            aria-label="Send BRO command"
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-slate-950 font-bold transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
            style={{
              backgroundColor: themeColor,
              boxShadow: commandInput.trim() ? `0 0 12px ${themeColor}66` : 'none',
            }}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 6. Bottom Horizontal Glass Action Dock (Exact 6 Pods from AbuZar-Ansarii/Jarvis) */}
      <div className="relative z-20 pt-2 pb-4 px-3">
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {/* Pod 1: Always-On Continuous Listening */}
          <button
            type="button"
            onClick={onToggleAlwaysOn}
            className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[10px] font-bold tracking-[0.12em] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              alwaysOn
                ? 'bg-[#00E5FF]/20 border-[#00E5FF]/80 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.35)]'
                : 'bg-white/[0.05] border-white/20 text-white/60 hover:text-white hover:border-white/40'
            }`}
          >
            {alwaysOn ? <Ear className="w-3.5 h-3.5" /> : <EarOff className="w-3.5 h-3.5" />}
            <span>{alwaysOn ? 'ALWAYS-ON: ON' : 'ALWAYS-ON'}</span>
          </button>

          {/* Pod 2: Multi-Task Decoupler */}
          <button
            type="button"
            onClick={onOpenBrainDump}
            className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00E5FF]/[0.12] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/50 text-[#00E5FF] font-mono text-[10px] font-bold tracking-[0.12em] whitespace-nowrap shrink-0 transition-all cursor-pointer"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>MULTITASK</span>
          </button>

          {/* Pod 3: Hermes Self-Evolve */}
          <button
            type="button"
            onClick={onTriggerSelfEvolve}
            className="min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BA68C8]/[0.14] hover:bg-[#BA68C8]/25 border border-[#BA68C8]/55 text-[#BA68C8] font-mono text-[10px] font-bold tracking-[0.12em] whitespace-nowrap shrink-0 transition-all cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>SELF EVOLVE</span>
          </button>

          {/* Pod 4: Air Gestures */}
          <button
            type="button"
            onClick={onOpenAirGestures}
            className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[10px] font-bold tracking-[0.12em] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              airGesturesEnabled
                ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                : 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]/85 hover:bg-[#00E5FF]/20'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>AIR GESTURES</span>
          </button>

          {/* Pod 5: Screen Style Switcher (ARC vs BRO Avatar) */}
          <button
            type="button"
            onClick={onToggleScreenStyle}
            aria-label={isArc ? 'Switch to 3D Hologram Avatar' : 'Switch to Arc Reactor Sphere'}
            className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[10px] font-bold tracking-[0.12em] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              isArc
                ? 'bg-[#00E5FF]/[0.12] border-[#00E5FF]/45 text-[#00E5FF] hover:bg-[#00E5FF]/20'
                : 'bg-[#64FFDA]/[0.12] border-[#64FFDA]/45 text-[#64FFDA] hover:bg-[#64FFDA]/20'
            }`}
          >
            {isArc ? <Orbit className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span>{isArc ? 'ARC' : 'BRO'}</span>
          </button>

          {/* Pod 6: Macro Recorder */}
          <button
            type="button"
            onClick={onToggleMacro}
            className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[10px] font-bold tracking-[0.12em] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              isRecordingMacro
                ? 'bg-red-500/20 border-red-400 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.35)]'
                : 'bg-[#BA68C8]/[0.12] border-[#BA68C8]/45 text-[#BA68C8] hover:bg-[#BA68C8]/20'
            }`}
          >
            {isRecordingMacro ? (
              <CircleDot className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isRecordingMacro ? 'SAVE MACRO' : 'MACRO'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
