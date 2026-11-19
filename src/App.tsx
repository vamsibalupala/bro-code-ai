/**
 * BRO — Autonomous, Local-First Personal AI Assistant & Liquid Glass HUD
 * Exact design integration from AbuZar-Ansarii/Jarvis, cleanly rebranded as BRO.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  Sparkles,
  Settings,
  Bot,
  MessageCircle,
  Mic,
  MicOff,
  ArrowUp,
  Pause,
  Play,
  Square,
  ShieldAlert,
} from 'lucide-react';
import type {
  AppMode,
  BroChatMessage,
  BroPhase,
  BroSettings,
  CalendarEvent,
  HermesContext,
  MacroSkill,
  NoteItem,
  TaskSession,
  TodoItem,
  BrowserSpeechRecognition,
  BrowserSpeechRecognitionEvent,
} from './types/bro';
import {
  DEFAULT_BRO_SETTINGS,
  DEFAULT_HERMES_CONTEXT,
  parseLocalBroDirective,
} from './utils/broEngine';
import { LiquidGlassModeSwitcher } from './components/bro/LiquidGlassModeSwitcher';
import { BroHudView } from './components/bro/BroHudView';
import { ChatBubble } from './components/bro/ChatBubble';
import { SessionsDrawer } from './components/bro/SessionsDrawer';
import { BrainDumpDialog } from './components/bro/BrainDumpDialog';
import { AirGesturesDialog } from './components/bro/AirGesturesDialog';
import { ProductivitySheets } from './components/bro/ProductivitySheets';
import { SettingsModal } from './components/bro/SettingsModal';
import { FloatingCopilotBubble } from './components/bro/FloatingCopilotBubble';

const STORAGE_KEYS = {
  settings: 'bro_settings_v1',
  hermes: 'bro_hermes_v1',
  sessions: 'bro_sessions_v1',
  todos: 'bro_todos_v1',
  events: 'bro_events_v1',
  notes: 'bro_notes_v1',
  macros: 'bro_macros_v1',
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const AGENT_SUGGESTIONS = [
  'Draft a status update note for today',
  'Activate air gestures',
  'Open brain dump',
  'Plan my evening focus schedule',
];

const CHAT_SUGGESTIONS = [
  'Summarize my tasks and schedule',
  'Explain edge AI vs cloud LLMs concisely',
  'Help me write a clean project pitch',
  'Give me 3 productivity upgrades',
];

export default function App() {
  // Core Mode: default to BRO 3D Hologram HUD so the signature Jarvis-style interface opens immediately
  const [mode, setMode] = useState<AppMode>('bro');

  // Persisted State
  const [settings, setSettings] = useState<BroSettings>(() =>
    loadJson(STORAGE_KEYS.settings, DEFAULT_BRO_SETTINGS)
  );
  const [hermesContext, setHermesContext] = useState<HermesContext>(() =>
    loadJson(STORAGE_KEYS.hermes, DEFAULT_HERMES_CONTEXT)
  );
  const [sessions, setSessions] = useState<TaskSession[]>(() =>
    loadJson(STORAGE_KEYS.sessions, [
      {
        id: 'sess_init_1',
        goal: 'Initialize BRO Liquid Glass Core & Hermes Memory',
        mode: 'agent',
        status: 'success',
        startedAt: Date.now() - 3600_000,
        messages: [
          {
            id: 'm_init_1',
            role: 'user',
            text: 'Initialize BRO Liquid Glass Core & Hermes Memory',
            timestamp: Date.now() - 3600_000,
          },
          {
            id: 'm_init_2',
            role: 'agent',
            step: 1,
            text: '**Core Synced** — Loaded `SOUL.md`, `USER.md`, and `AGENT.md` local memory files. Dual 3D Hologram engines standing by.',
            timestamp: Date.now() - 3595_000,
          },
        ],
      },
    ])
  );
  const [todos, setTodos] = useState<TodoItem[]>(() =>
    loadJson(STORAGE_KEYS.todos, [
      {
        id: 'todo_1',
        title: 'Test BRO Multi-Task Decoupler brain dump',
        completed: false,
        createdAt: Date.now() - 1800_000,
      },
      {
        id: 'todo_2',
        title: 'Switch between Arc Reactor & 3D Hologram Avatar',
        completed: false,
        createdAt: Date.now() - 900_000,
      },
    ])
  );
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    loadJson(STORAGE_KEYS.events, [
      {
        id: 'ev_1',
        title: 'Evening Deep Focus Sprint',
        time: 'Today · 6:00 PM',
        createdAt: Date.now() - 7200_000,
      },
    ])
  );
  const [notes, setNotes] = useState<NoteItem[]>(() =>
    loadJson(STORAGE_KEYS.notes, [
      {
        id: 'note_1',
        title: 'BRO Operating Directives',
        content:
          'Tap the 3D hologram to speak, double-tap to recenter, or open Multi-Task Decoupler for compound requests.',
        updatedAt: Date.now() - 5400_000,
      },
    ])
  );
  const [macros, setMacros] = useState<MacroSkill[]>(() =>
    loadJson(STORAGE_KEYS.macros, [
      {
        id: 'mac_1',
        name: 'Morning Briefing Routine',
        stepsCount: 4,
        createdAt: Date.now() - 86400_000,
      },
    ])
  );

  // Active Transcript & Execution State
  const [messages, setMessages] = useState<BroChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [isRecordingMacro, setIsRecordingMacro] = useState(false);

  // Agent Task Execution Bar state
  const [activeTaskGoal, setActiveTaskGoal] = useState<string | null>(null);
  const [activeTaskStep, setActiveTaskStep] = useState(0);
  const [isTaskPaused, setIsTaskPaused] = useState(false);
  const taskAbortedRef = useRef(false);

  // BRO HUD state
  const [hudPhase, setHudPhase] = useState<BroPhase>('idle');
  const [lastUserTranscript, setLastUserTranscript] = useState('');
  const [lastBroReply, setLastBroReply] = useState('');
  const [activeGestureBanner, setActiveGestureBanner] = useState<string | null>(null);

  // Drawers & Modals
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [brainDumpOpen, setBrainDumpOpen] = useState(false);
  const [airGesturesOpen, setAirGesturesOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState<'todos' | 'calendar' | 'notes' | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  // Sync Tailwind dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.hermes, JSON.stringify(hermesContext));
  }, [hermesContext]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions.slice(0, 25)));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.macros, JSON.stringify(macros));
  }, [macros]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close active drawer/modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (airGesturesOpen) {
        setAirGesturesOpen(false);
      } else if (brainDumpOpen) {
        setBrainDumpOpen(false);
      } else if (settingsOpen) {
        setSettingsOpen(false);
      } else if (activeSheet) {
        setActiveSheet(null);
      } else if (drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [airGesturesOpen, brainDumpOpen, settingsOpen, activeSheet, drawerOpen]);

  const updateSettings = useCallback((patch: Partial<BroSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  // Speech Synthesis helper for BRO HUD
  const speakBriefing = useCallback(
    (text: string) => {
      setLastBroReply(text);
      if (!settings.voiceReply || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setHudPhase('speaking');
        setTimeout(() => setHudPhase('idle'), 2400);
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text.replace(/[*_`#]/g, ''));
        utter.rate = settings.speechRate;
        utter.pitch = settings.speechPitch;
        utter.onstart = () => setHudPhase('speaking');
        utter.onend = () => setHudPhase(settings.alwaysOn ? 'listening' : 'idle');
        utter.onerror = () => setHudPhase('idle');
        setHudPhase('speaking');
        window.speechSynthesis.speak(utter);
      } catch {
        setHudPhase('idle');
      }
    },
    [settings.voiceReply, settings.speechRate, settings.speechPitch, settings.alwaysOn]
  );

  const saveSessionSnapshot = useCallback(
    (goal: string, sessionMode: AppMode, status: 'success' | 'failed' | 'cancelled', msgs: BroChatMessage[]) => {
      const entry: TaskSession = {
        id: `sess_${Date.now()}`,
        goal,
        mode: sessionMode,
        status,
        startedAt: Date.now(),
        messages: msgs,
      };
      setSessions((prev) => [entry, ...prev].slice(0, 25));
    },
    []
  );

  // Hermes Self-Evolution Handler
  const handleTriggerSelfEvolve = useCallback(async () => {
    if (isEvolving) return;
    setIsEvolving(true);
    setHudPhase('thinking');

    try {
      const res = await fetch('/api/bro/evolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentContext: hermesContext,
          recentTranscripts: messages.slice(-12),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Self-evolution request failed.');
      }

      const nextContext: HermesContext = {
        soul: data.soul || hermesContext.soul,
        user: data.user || hermesContext.user,
        agent: data.agent || hermesContext.agent,
        lastEvolvedAt: Date.now(),
        evolutionCount: hermesContext.evolutionCount + 1,
      };
      setHermesContext(nextContext);
      const briefing =
        data.briefing ||
        `Hermes self-evolution complete. Context updated to Generation #${nextContext.evolutionCount}.`;
      speakBriefing(briefing);

      if (mode !== 'bro') {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys_${Date.now()}`,
            role: 'system',
            text: briefing,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Hermes evolution failed.';
      setLastBroReply(errMsg);
      setHudPhase('idle');
      if (mode !== 'bro') {
        setMessages((prev) => [
          ...prev,
          { id: `err_${Date.now()}`, role: 'error', text: errMsg, timestamp: Date.now() },
        ]);
      }
    } finally {
      setIsEvolving(false);
    }
  }, [hermesContext, isEvolving, messages, mode, speakBriefing]);

  // Macro Recorder Toggle
  const handleToggleMacro = useCallback(() => {
    if (isRecordingMacro) {
      setIsRecordingMacro(false);
      const newMacro: MacroSkill = {
        id: `mac_${Date.now()}`,
        name: `Custom Workflow #${macros.length + 1}`,
        stepsCount: Math.max(2, messages.length),
        createdAt: Date.now(),
      };
      setMacros((prev) => [newMacro, ...prev]);
      speakBriefing(`Macro skill "${newMacro.name}" saved to Hermes memory.`);
    } else {
      setIsRecordingMacro(true);
      speakBriefing('Macro recorder active. Performing actions will distill into a reusable skill.');
    }
  }, [isRecordingMacro, macros.length, messages.length, speakBriefing]);

  // Core Command / Prompt Router (handles Local Directives, BRO HUD, Agent, and Chat)
  const submitDirective = useCallback(
    async (rawText: string, overrideMode?: AppMode) => {
      const text = rawText.trim();
      if (!text || isBusy) return;

      const targetMode = overrideMode ?? mode;
      setInputValue('');
      setLastUserTranscript(text);

      // 1. Check fast deterministic local directives first
      const local = parseLocalBroDirective(text);
      if (local.handled) {
        if (local.settingsPatch) updateSettings(local.settingsPatch);
        if (local.openDialog === 'brainDump') setBrainDumpOpen(true);
        if (local.openDialog === 'airGestures') setAirGesturesOpen(true);
        if (local.openDialog === 'settings') setSettingsOpen(true);
        if (local.triggerSelfEvolve) {
          await handleTriggerSelfEvolve();
          return;
        }
        if (local.toggleMacro) {
          handleToggleMacro();
          return;
        }
        if (local.reply) {
          speakBriefing(local.reply);
          if (targetMode !== 'bro') {
            setMessages((prev) => [
              ...prev,
              { id: `u_${Date.now()}`, role: 'user', text, timestamp: Date.now() },
              { id: `a_${Date.now() + 1}`, role: 'agent', text: local.reply!, timestamp: Date.now() + 1 },
            ]);
          }
        }
        return;
      }

      // 2. Route to Gemini Server-Side API
      setIsBusy(true);
      taskAbortedRef.current = false;

      if (targetMode === 'agent') {
        const userMsg: BroChatMessage = {
          id: `u_${Date.now()}`,
          role: 'user',
          text,
          timestamp: Date.now(),
        };
        const baseMessages = [...messages, userMsg];
        setMessages(baseMessages);
        setActiveTaskGoal(text);
        setActiveTaskStep(1);
        setIsTaskPaused(false);
        setHudPhase('executing');

        try {
          const res = await fetch('/api/bro/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              goal: text,
              personality: settings.personality,
              hermesContext,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Agent execution failed.');
          }

          const steps: { step?: number; action?: string; detail?: string }[] = Array.isArray(
            data.steps
          )
            ? data.steps
            : [];

          let updatedMsgs = [...baseMessages];
          for (let i = 0; i < steps.length; i++) {
            if (taskAbortedRef.current) break;
            const s = steps[i];
            const stepNum = s.step ?? i + 1;
            setActiveTaskStep(stepNum);
            const stepMsg: BroChatMessage = {
              id: `step_${Date.now()}_${i}`,
              role: 'agent',
              step: stepNum,
              text: `**${s.action || 'Executing action'}** — ${s.detail || 'Completed step.'}`,
              timestamp: Date.now(),
            };
            updatedMsgs = [...updatedMsgs, stepMsg];
            setMessages(updatedMsgs);
            await new Promise((r) => setTimeout(r, 320));
          }

          if (!taskAbortedRef.current) {
            // Sync any created items into Productivity Suite
            if (Array.isArray(data.createdTodos) && data.createdTodos.length > 0) {
              setTodos((prev) => [
                ...data.createdTodos.map((t: string, idx: number) => ({
                  id: `todo_${Date.now()}_${idx}`,
                  title: t,
                  completed: false,
                  createdAt: Date.now(),
                })),
                ...prev,
              ]);
            }
            if (Array.isArray(data.createdEvents) && data.createdEvents.length > 0) {
              setEvents((prev) => [
                ...data.createdEvents.map(
                  (e: { title?: string; time?: string }, idx: number) => ({
                    id: `ev_${Date.now()}_${idx}`,
                    title: e.title || 'Scheduled Event',
                    time: e.time || 'Today',
                    createdAt: Date.now(),
                  })
                ),
                ...prev,
              ]);
            }
            if (Array.isArray(data.createdNotes) && data.createdNotes.length > 0) {
              setNotes((prev) => [
                ...data.createdNotes.map(
                  (n: { title?: string; content?: string }, idx: number) => ({
                    id: `note_${Date.now()}_${idx}`,
                    title: n.title || 'Agent Note',
                    content: n.content || '',
                    updatedAt: Date.now(),
                  })
                ),
                ...prev,
              ]);
            }

            const summaryMsg: BroChatMessage = {
              id: `sum_${Date.now()}`,
              role: 'system',
              text: data.summary || 'Autonomous task sequence completed.',
              timestamp: Date.now(),
            };
            updatedMsgs = [...updatedMsgs, summaryMsg];
            setMessages(updatedMsgs);
            saveSessionSnapshot(text, 'agent', 'success', updatedMsgs);
            setLastBroReply(data.summary || 'Task completed.');
          } else {
            const cancelMsg: BroChatMessage = {
              id: `can_${Date.now()}`,
              role: 'system',
              text: 'Task execution cancelled by operator.',
              timestamp: Date.now(),
            };
            updatedMsgs = [...updatedMsgs, cancelMsg];
            setMessages(updatedMsgs);
            saveSessionSnapshot(text, 'agent', 'cancelled', updatedMsgs);
          }
        } catch (err: unknown) {
          const errText = err instanceof Error ? err.message : 'Agent execution error.';
          const errMsg: BroChatMessage = {
            id: `err_${Date.now()}`,
            role: 'error',
            text: errText,
            timestamp: Date.now(),
          };
          const failedMsgs = [...baseMessages, errMsg];
          setMessages(failedMsgs);
          saveSessionSnapshot(text, 'agent', 'failed', failedMsgs);
        } finally {
          setActiveTaskGoal(null);
          setActiveTaskStep(0);
          setHudPhase('idle');
          setIsBusy(false);
        }
        return;
      }

      // Chat Mode or BRO HUD Mode
      const userMsg: BroChatMessage = {
        id: `u_${Date.now()}`,
        role: 'user',
        text,
        timestamp: Date.now(),
      };
      const pendingAgentId = `a_${Date.now() + 1}`;
      const withPending: BroChatMessage[] = [
        ...messages,
        userMsg,
        { id: pendingAgentId, role: 'agent', text: '', timestamp: Date.now() },
      ];

      if (targetMode === 'chat') {
        setMessages(withPending);
      } else {
        setHudPhase('thinking');
      }

      try {
        const res = await fetch('/api/bro/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: messages.slice(-10),
            personality: settings.personality,
            hermesContext,
            mode: targetMode,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Unable to reach BRO intelligence core.');
        }

        const reply = data.reply || 'Standing by.';
        const finalMsgs: BroChatMessage[] = [
          ...messages,
          userMsg,
          { id: pendingAgentId, role: 'agent', text: reply, timestamp: Date.now() },
        ];
        setMessages(finalMsgs);

        if (targetMode === 'bro') {
          speakBriefing(reply);
        } else {
          setLastBroReply(reply);
          saveSessionSnapshot(text, 'chat', 'success', finalMsgs);
        }
      } catch (err: unknown) {
        const errText = err instanceof Error ? err.message : 'Failed to connect to BRO core.';
        const errMsgs: BroChatMessage[] = [
          ...messages,
          userMsg,
          { id: pendingAgentId, role: 'error', text: errText, timestamp: Date.now() },
        ];
        setMessages(errMsgs);
        if (targetMode === 'bro') {
          setLastBroReply(errText);
          setHudPhase('idle');
        }
      } finally {
        setIsBusy(false);
      }
    },
    [
      isBusy,
      mode,
      messages,
      settings.personality,
      hermesContext,
      updateSettings,
      handleTriggerSelfEvolve,
      handleToggleMacro,
      speakBriefing,
      saveSessionSnapshot,
    ]
  );

  // Voice Recognition toggle (shared between BRO HUD hologram tap & Chat/Agent mic button)
  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setHudPhase('idle');
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    };
    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      if (mode === 'bro') {
        setLastBroReply('Microphone speech recognition is unavailable here—type your command below.');
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys_${Date.now()}`,
            role: 'system',
            text: 'Speech recognition unavailable in this browser — type your directive below.',
            timestamp: Date.now(),
          },
        ]);
      }
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    setIsListening(true);
    if (mode === 'bro') setHudPhase('listening');

    let latestTranscript = '';
    recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
      latestTranscript = Array.from(event.results)
        .map((r) => r[0]?.transcript ?? '')
        .join(' ')
        .trim();
      if (mode === 'bro') {
        setLastUserTranscript(latestTranscript);
      } else {
        setInputValue(latestTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setHudPhase('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (mode === 'bro') {
        if (latestTranscript) {
          void submitDirective(latestTranscript, 'bro');
        } else {
          setHudPhase('idle');
        }
      }
    };

    recognition.start();
  }, [isListening, mode, submitDirective]);

  const handleTriggerAirGesture = (banner: string, command?: string) => {
    setActiveGestureBanner(banner);
    setTimeout(() => setActiveGestureBanner(null), 3200);
    if (command) {
      void submitDirective(command, 'bro');
    }
  };

  const isBroHud = mode === 'bro';
  const isAgent = mode === 'agent';
  const pendingTodosCount = todos.filter((t) => !t.completed).length;

  return (
    <div
      className={`h-dvh w-full flex flex-col relative overflow-hidden transition-colors duration-300 ${
        isBroHud
          ? 'bg-black text-white'
          : 'bg-[#F1F5F9] dark:bg-[#090E17] text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* Ambient Liquid Glass Refraction Spheres (Exact match of LiquidGlassScaffold in glass_widgets.dart) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-12 -right-12 w-72 h-72 rounded-full blur-3xl transition-colors duration-500"
        style={{
          background: isBroHud
            ? 'radial-gradient(circle, rgba(0,229,255,0.14) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-12 -left-16 w-80 h-80 rounded-full blur-3xl transition-colors duration-500"
        style={{
          background: isBroHud
            ? 'radial-gradient(circle, rgba(186,104,200,0.10) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
        }}
      />

      {/* ================================================================= */}
      {/* TOP APP BAR (Exact 3-zone clean structure from home_screen.dart)  */}
      {/* ================================================================= */}
      <header
        className={`relative z-30 h-14 px-3 sm:px-6 flex items-center justify-between gap-4 shrink-0 ${
          isBroHud ? 'bg-transparent' : 'bg-transparent'
        }`}
      >
        {/* Left: Drawer Button + Brand Wordmark */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open sessions and productivity drawer"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isBroHud
                ? 'text-[#00E5FF] hover:bg-[#00E5FF]/10'
                : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          <span
            className={`whitespace-nowrap shrink-0 transition-all ${
              isBroHud
                ? 'font-mono text-lg font-black tracking-[0.26em] text-[#00E5FF]'
                : 'text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100'
            }`}
          >
            {isBroHud ? 'BRO' : 'Bro'}
          </span>

          {settings.sentryModeEnabled && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-amber-500 dark:text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              Sentry Armed
            </span>
          )}
        </div>

        {/* Right: Floating Overlay Bubble Toggle + Settings Button */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() =>
              updateSettings({
                floatingCopilotEnabled: !settings.floatingCopilotEnabled,
              })
            }
            aria-label={
              settings.floatingCopilotEnabled
                ? 'Hide floating copilot bubble'
                : 'Show floating copilot bubble'
            }
            title={
              settings.floatingCopilotEnabled
                ? 'Hide floating copilot bubble'
                : 'Show floating copilot bubble'
            }
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              settings.floatingCopilotEnabled
                ? 'text-[#00E5FF] bg-[#00E5FF]/15'
                : isBroHud
                ? 'text-[#00E5FF] hover:bg-[#00E5FF]/10'
                : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open Settings"
            title="Settings"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isBroHud
                ? 'text-[#00E5FF] hover:bg-[#00E5FF]/10'
                : 'text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ================================================================= */}
      {/* LIQUID GLASS SEGMENTED MODE SWITCHER (Agent | Chat | BRO)         */}
      {/* ================================================================= */}
      <LiquidGlassModeSwitcher
        selectedMode={mode}
        isBusy={isBusy}
        onModeChanged={(next) => {
          setMode(next);
          if (next !== 'bro') {
            setHudPhase('idle');
          }
        }}
      />

      {/* ================================================================= */}
      {/* MAIN DYNAMIC VIEWPORT                                             */}
      {/* ================================================================= */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10">
        {isBroHud ? (
          <BroHudView
            phase={hudPhase}
            executionStep={activeTaskStep}
            screenStyle={settings.screenStyle}
            alwaysOn={settings.alwaysOn}
            airGesturesEnabled={settings.airGesturesEnabled}
            isRecordingMacro={isRecordingMacro}
            activeGestureBanner={activeGestureBanner}
            lastUserTranscript={lastUserTranscript}
            lastBroReply={lastBroReply}
            isBusy={isBusy}
            onTapHologram={toggleVoiceInput}
            onSendCommand={(cmd) => void submitDirective(cmd, 'bro')}
            onAbortTask={() => {
              taskAbortedRef.current = true;
              setHudPhase('idle');
            }}
            onToggleAlwaysOn={() => {
              const next = !settings.alwaysOn;
              updateSettings({ alwaysOn: next });
              speakBriefing(
                next
                  ? 'Always-On listening receptor active.'
                  : 'Always-On receptor placed in standby.'
              );
            }}
            onOpenBrainDump={() => setBrainDumpOpen(true)}
            onTriggerSelfEvolve={() => void handleTriggerSelfEvolve()}
            onOpenAirGestures={() => setAirGesturesOpen(true)}
            onToggleScreenStyle={() =>
              updateSettings({
                screenStyle:
                  settings.screenStyle === 'arcReactor' ? 'hologram' : 'arcReactor',
              })
            }
            onToggleMacro={handleToggleMacro}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-0 w-full max-w-3xl mx-auto">
            {/* Active Autonomous Task Bar (Exact match of _activeTaskBar in home_screen.dart) */}
            {activeTaskGoal && (
              <div className="px-4 pt-1 pb-2 shrink-0">
                <div className="rounded-[18px] px-3.5 py-2.5 backdrop-blur-xl bg-white/80 dark:bg-white/[0.06] border border-black/10 dark:border-white/[0.12] flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs font-extrabold text-indigo-600 dark:text-indigo-300 tabular-nums shrink-0">
                    {activeTaskStep}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold leading-tight">
                      {isTaskPaused ? 'Paused' : 'Running task'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {activeTaskGoal}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTaskPaused((p) => !p)}
                    aria-label={isTaskPaused ? 'Resume task' : 'Pause task'}
                    className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer"
                  >
                    {isTaskPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      taskAbortedRef.current = true;
                    }}
                    aria-label="Cancel task"
                    className="w-10 h-10 rounded-full hover:bg-red-500/15 text-red-500 flex items-center justify-center cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            )}

            {/* Transcript or Clean Empty State Hero Card */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center py-6">
                  <div className="w-full max-w-md rounded-[24px] p-6 sm:p-7 backdrop-blur-xl bg-white/75 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.10] shadow-xl text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-indigo-500/25 to-indigo-500/5 border border-indigo-400/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      {isAgent ? (
                        <Bot className="w-7 h-7" />
                      ) : (
                        <MessageCircle className="w-7 h-7" />
                      )}
                    </div>

                    <h1 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                      {isAgent ? 'Autonomous Agent' : 'Private AI Assistant'}
                    </h1>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isAgent
                        ? 'Describe a multi-step goal and BRO plans, executes, and syncs directly to your Tasks, Calendar, and Notes.'
                        : 'Fast, private conversations grounded in your local Hermes context with zero interface clutter.'}
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {(isAgent ? AGENT_SUGGESTIONS : CHAT_SUGGESTIONS).map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => void submitDirective(prompt)}
                          className="min-h-[38px] px-3.5 py-1.5 rounded-2xl bg-indigo-500/[0.09] hover:bg-indigo-500/20 border border-indigo-500/25 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer"
                        >
                          “{prompt}”
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pb-2">
                  {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))}
                  <div ref={transcriptEndRef} />
                </div>
              )}
            </div>

            {/* Floating Liquid Glass Input Bar (Exact match of _inputBar in home_screen.dart) */}
            <div className="px-4 pt-1.5 pb-4 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitDirective(inputValue);
                }}
                className="rounded-[28px] pl-3.5 pr-1.5 py-1.5 backdrop-blur-xl bg-white/85 dark:bg-white/[0.06] border border-black/10 dark:border-white/[0.14] shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35)] flex items-center gap-1.5"
              >
                <span className="text-indigo-500 dark:text-indigo-400 shrink-0 pl-1">
                  {isAgent ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                </span>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isBusy}
                  placeholder={
                    isBusy
                      ? isAgent
                        ? 'BRO Agent is executing…'
                        : 'Thinking…'
                      : isAgent
                      ? 'Describe a task for BRO…'
                      : 'Ask BRO anything…'
                  }
                  aria-label={isAgent ? 'Describe a task for BRO' : 'Ask BRO anything'}
                  className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400/70 px-2 py-2.5 focus:outline-none"
                />

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={toggleVoiceInput}
                  aria-label="Voice input"
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    isListening
                      ? 'text-red-500 bg-red-500/15'
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  disabled={isBusy || !inputValue.trim()}
                  aria-label={isAgent ? 'Run task' : 'Send message'}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-md shadow-indigo-500/35 flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* DRAWERS, DIALOGS & FLOATING COPILOT                               */}
      {/* ================================================================= */}
      <SessionsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sessions={sessions}
        pendingTodosCount={pendingTodosCount}
        scheduledEventsCount={events.length}
        notesCount={notes.length}
        onNewSession={() => {
          setMessages([]);
          setLastUserTranscript('');
          setLastBroReply('');
        }}
        onSelectSession={(session) => {
          setMessages(session.messages);
          setMode(session.mode === 'bro' ? 'chat' : session.mode);
        }}
        onDeleteSession={(id) =>
          setSessions((prev) => prev.filter((s) => s.id !== id))
        }
        onOpenTodos={() => setActiveSheet('todos')}
        onOpenCalendar={() => setActiveSheet('calendar')}
        onOpenNotes={() => setActiveSheet('notes')}
        onOpenBrainDump={() => setBrainDumpOpen(true)}
      />

      <BrainDumpDialog
        isOpen={brainDumpOpen}
        onClose={() => setBrainDumpOpen(false)}
        onSpeak={(summary) => speakBriefing(summary)}
        onCompletedItems={({ todos: newTodos, events: newEvents, notes: newNotes }) => {
          if (Array.isArray(newTodos) && newTodos.length > 0) {
            setTodos((prev) => [
              ...newTodos.map((title, idx) => ({
                id: `todo_${Date.now()}_${idx}`,
                title,
                completed: false,
                createdAt: Date.now(),
              })),
              ...prev,
            ]);
          }
          if (Array.isArray(newEvents) && newEvents.length > 0) {
            setEvents((prev) => [
              ...newEvents.map((e, idx) => ({
                id: `ev_${Date.now()}_${idx}`,
                title: e.title,
                time: e.time,
                createdAt: Date.now(),
              })),
              ...prev,
            ]);
          }
          if (Array.isArray(newNotes) && newNotes.length > 0) {
            setNotes((prev) => [
              ...newNotes.map((n, idx) => ({
                id: `note_${Date.now()}_${idx}`,
                title: n.title,
                content: n.content,
                updatedAt: Date.now(),
              })),
              ...prev,
            ]);
          }
        }}
      />

      <AirGesturesDialog
        isOpen={airGesturesOpen}
        isEnabled={settings.airGesturesEnabled}
        onClose={() => setAirGesturesOpen(false)}
        onToggleEnabled={() =>
          updateSettings({ airGesturesEnabled: !settings.airGesturesEnabled })
        }
        onTriggerGesture={handleTriggerAirGesture}
      />

      <ProductivitySheets
        activeSheet={activeSheet}
        onClose={() => setActiveSheet(null)}
        todos={todos}
        events={events}
        notes={notes}
        onAddTodo={(title) =>
          setTodos((prev) => [
            { id: `todo_${Date.now()}`, title, completed: false, createdAt: Date.now() },
            ...prev,
          ])
        }
        onToggleTodo={(id) =>
          setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
          )
        }
        onDeleteTodo={(id) => setTodos((prev) => prev.filter((t) => t.id !== id))}
        onAddEvent={(title, time) =>
          setEvents((prev) => [
            { id: `ev_${Date.now()}`, title, time, createdAt: Date.now() },
            ...prev,
          ])
        }
        onDeleteEvent={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
        onAddNote={(title, content) =>
          setNotes((prev) => [
            { id: `note_${Date.now()}`, title, content, updatedAt: Date.now() },
            ...prev,
          ])
        }
        onDeleteNote={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        hermesContext={hermesContext}
        onUpdateHermes={setHermesContext}
        onTriggerSelfEvolve={handleTriggerSelfEvolve}
        isEvolving={isEvolving}
        macros={macros}
        onOpenAirGestures={() => setAirGesturesOpen(true)}
        onOpenBrainDump={() => setBrainDumpOpen(true)}
      />

      <FloatingCopilotBubble
        visible={settings.floatingCopilotEnabled}
        onQuickCommand={(cmd) => void submitDirective(cmd)}
        onCloseOverlay={() => updateSettings({ floatingCopilotEnabled: false })}
      />
    </div>
  );
}
