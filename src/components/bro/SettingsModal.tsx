import React, { useState } from 'react';
import {
  X,
  Shield,
  Moon,
  Sun,
  Orbit,
  UserCheck,
  Volume2,
  Ear,
  Brain,
  Sparkles,
  Hand,
  Loader2,
  Sliders,
} from 'lucide-react';
import type {
  BroSettings,
  HermesContext,
  MacroSkill,
  PersonalityMode,
} from '../../types/bro';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BroSettings;
  onUpdateSettings: (patch: Partial<BroSettings>) => void;
  hermesContext: HermesContext;
  onUpdateHermes: (next: HermesContext) => void;
  onTriggerSelfEvolve: () => Promise<void>;
  isEvolving: boolean;
  macros: MacroSkill[];
  onOpenAirGestures: () => void;
  onOpenBrainDump: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  hermesContext,
  onUpdateHermes,
  onTriggerSelfEvolve,
  isEvolving,
  macros,
  onOpenAirGestures,
  onOpenBrainDump,
}) => {
  const [activeHermesTab, setActiveHermesTab] = useState<'soul' | 'user' | 'agent'>('soul');

  if (!isOpen) return null;

  const isDark = settings.theme === 'dark';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="BRO Settings"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-md"
    >
      <div className="w-full sm:max-w-2xl max-h-[88vh] flex flex-col rounded-t-[28px] sm:rounded-[24px] bg-slate-50 dark:bg-[#090E17] border border-black/10 dark:border-white/15 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Top Bar */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/55 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#00B8D4] dark:text-[#00E5FF]" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-extrabold tracking-[0.14em] text-slate-900 dark:text-white">
                BRO SETTINGS
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Hologram HUD, Voice Synthesis &amp; Hermes Engine
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* 1. BRO Screen (HUD Visual Style) */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
              BRO Screen (HUD Visual Style)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ screenStyle: 'arcReactor' })}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                  settings.screenStyle === 'arcReactor'
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_18px_rgba(0,229,255,0.16)]'
                    : 'bg-white dark:bg-white/[0.03] border-black/10 dark:border-white/10 hover:border-[#00E5FF]/40'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src="/assets/bro/bro_core_cyan.png"
                    alt="Arc Reactor Sphere"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Orbit className="w-3.5 h-3.5 text-[#00B8D4] dark:text-[#00E5FF]" />
                    <span className="text-sm font-bold">Arc Reactor Sphere</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    3D gyroscopic consciousness core with vocal spectrum
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ screenStyle: 'hologram' })}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                  settings.screenStyle === 'hologram'
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_18px_rgba(0,229,255,0.16)]'
                    : 'bg-white dark:bg-white/[0.03] border-black/10 dark:border-white/10 hover:border-[#00E5FF]/40'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/assets/bro/bro_hologram_cyan.png"
                    alt="3D Hologram Avatar"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-[#64FFDA]" />
                    <span className="text-sm font-bold">3D Hologram Avatar</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Translucent holographic bust on emitter pedestal
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* 2. Appearance & Theme */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Appearance
            </h3>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-semibold">Liquid Glass Dark Theme</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Deep Slate (#090E17) dark mode or clean daylight glass
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle Dark Theme"
                onClick={() =>
                  onUpdateSettings({ theme: isDark ? 'light' : 'dark' })
                }
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                  isDark ? 'bg-indigo-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    isDark ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* 3. Voice & Speech Synthesis */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Always-On Voice &amp; Speech Synthesis
            </h3>
            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Ear className="w-5 h-5 text-[#00B8D4] dark:text-[#00E5FF]" />
                  <div>
                    <p className="text-sm font-semibold">Always-On Continuous Listening</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Keep receptor active for hands-free follow-up directives
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.alwaysOn}
                  aria-label="Toggle Always-On Continuous Listening"
                  onClick={() => onUpdateSettings({ alwaysOn: !settings.alwaysOn })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    settings.alwaysOn ? 'bg-[#00E5FF]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.alwaysOn ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <div>
                    <p className="text-sm font-semibold">Spoken Voice Briefings</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Read BRO HUD responses aloud via neural speech synthesis
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.voiceReply}
                  aria-label="Toggle Spoken Voice Briefings"
                  onClick={() => onUpdateSettings({ voiceReply: !settings.voiceReply })}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    settings.voiceReply ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.voiceReply ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Glass Slider Row: Speech Rate */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    Speech Rate
                  </span>
                  <span className="font-mono text-indigo-500 dark:text-indigo-300 tabular-nums">
                    {settings.speechRate.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.5}
                  step={0.05}
                  value={settings.speechRate}
                  aria-label="Speech Rate"
                  onChange={(e) =>
                    onUpdateSettings({ speechRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* 4. Personality & Emotional Intelligence */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Personality &amp; Executive Tone
            </h3>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-200/70 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08]">
              {(
                [
                  { id: 'concise', label: 'Concise' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'witty', label: 'Witty Bro' },
                ] as { id: PersonalityMode; label: string }[]
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onUpdateSettings({ personality: p.id })}
                  className={`min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settings.personality === p.id
                      ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          {/* 5. Autonomous Modules & Watchdog */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Autonomous Modules &amp; Watchdog
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Sentry Watchdog</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Motion &amp; perimeter security alert
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.sentryModeEnabled}
                  aria-label="Toggle Sentry Watchdog"
                  onClick={() =>
                    onUpdateSettings({ sentryModeEnabled: !settings.sentryModeEnabled })
                  }
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    settings.sentryModeEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.sentryModeEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Floating Copilot Orb</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Arc-Reactor quick command bubble
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.floatingCopilotEnabled}
                  aria-label="Toggle Floating Copilot Orb"
                  onClick={() =>
                    onUpdateSettings({
                      floatingCopilotEnabled: !settings.floatingCopilotEnabled,
                    })
                  }
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    settings.floatingCopilotEnabled
                      ? 'bg-[#00E5FF]'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      settings.floatingCopilotEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAirGestures();
                }}
                className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-[#00E5FF]/10 border border-black/[0.08] dark:border-white/[0.08] flex items-center gap-3 text-left transition-colors cursor-pointer"
              >
                <Hand className="w-5 h-5 text-[#00B8D4] dark:text-[#00E5FF] shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Air Gestures HUD</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure &amp; test touchless gestures
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBrainDump();
                }}
                className="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-indigo-500/10 border border-black/[0.08] dark:border-white/[0.08] flex items-center gap-3 text-left transition-colors cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Multi-Task Decoupler</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {macros.length} saved macro {macros.length === 1 ? 'skill' : 'skills'}
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* 6. Hermes Self-Evolving Context (SOUL.md, USER.md, AGENT.md) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
                  Hermes Self-Evolving Context
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  Generation #{hermesContext.evolutionCount} · Persisted locally
                </p>
              </div>
              <button
                type="button"
                disabled={isEvolving}
                onClick={onTriggerSelfEvolve}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isEvolving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Brain className="w-3.5 h-3.5" />
                )}
                <span>{isEvolving ? 'Evolving…' : 'Self Evolve'}</span>
              </button>
            </div>

            <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] overflow-hidden">
              <div className="flex border-b border-black/[0.06] dark:border-white/[0.08]">
                {(
                  [
                    { id: 'soul', label: 'SOUL.md' },
                    { id: 'user', label: 'USER.md' },
                    { id: 'agent', label: 'AGENT.md' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveHermesTab(tab.id)}
                    className={`flex-1 py-2.5 text-xs font-mono font-bold transition-colors cursor-pointer ${
                      activeHermesTab === tab.id
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-b-2 border-purple-500'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <textarea
                value={hermesContext[activeHermesTab]}
                onChange={(e) =>
                  onUpdateHermes({
                    ...hermesContext,
                    [activeHermesTab]: e.target.value,
                  })
                }
                rows={5}
                aria-label={`Edit ${activeHermesTab.toUpperCase()}.md`}
                className="w-full p-3.5 bg-transparent font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed resize-none focus:outline-none"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
