import type { BroPhase, BroSettings, HermesContext } from '../types/bro';

export const DEFAULT_HERMES_CONTEXT: HermesContext = {
  soul: `# SOUL.md — BRO Core Identity
- Identity: **BRO** — Autonomous, Local-First Personal AI & Tactical Operating System.
- Ethos: Zero trackers, privacy-first execution, calm precision under complexity.
- Voice: Direct, reliable, human-first executive briefings.`,
  user: `# USER.md — Operator Profile
- Prefers clean, clutter-free dark glass interfaces.
- Uses rapid voice dictation and compound multi-task brain dumps.
- Values fast execution over verbose boilerplate.`,
  agent: `# AGENT.md — Active Protocols & Skills
- Multi-Vector Parallel Execution (Brain Dump Decoupler).
- Observe-Think-Act multi-step automation planner.
- Dual 3D Hologram HUD (Arc Reactor Sphere & 3D Avatar Bust).
- Air Gestures & Sentry Watchdog telemetry modules.`,
  lastEvolvedAt: Date.now(),
  evolutionCount: 1,
};

export const DEFAULT_BRO_SETTINGS: BroSettings = {
  theme: 'dark',
  screenStyle: 'arcReactor',
  alwaysOn: false,
  voiceReply: true,
  speechRate: 1.05,
  speechPitch: 0.95,
  personality: 'balanced',
  airGesturesEnabled: false,
  sentryModeEnabled: false,
  floatingCopilotEnabled: false,
  maxSteps: 6,
};

export interface LocalCommandResult {
  handled: boolean;
  reply?: string;
  settingsPatch?: Partial<BroSettings>;
  openDialog?: 'brainDump' | 'airGestures' | 'settings' | 'todos' | 'calendar' | 'notes';
  triggerSelfEvolve?: boolean;
  toggleMacro?: boolean;
}

/**
 * Evaluates fast deterministic local directives (exact Jarvis voice commands renamed for BRO)
 * so hardware/UI controls react instantaneously before needing a cloud round-trip.
 */
export function parseLocalBroDirective(input: string): LocalCommandResult {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return { handled: false };

  if (
    normalized.includes('self evolve') ||
    normalized.includes('evolve context') ||
    normalized.includes('update your memory')
  ) {
    return {
      handled: true,
      triggerSelfEvolve: true,
    };
  }

  if (
    normalized === 'always on' ||
    normalized === 'enable always on' ||
    normalized === 'hands free' ||
    normalized === 'turn on always on'
  ) {
    return {
      handled: true,
      reply: 'Always-On continuous listening receptor activated. Ready for hands-free directives.',
      settingsPatch: { alwaysOn: true },
    };
  }

  if (
    normalized === 'turn off always on' ||
    normalized === 'disable always on' ||
    normalized === 'stop listening'
  ) {
    return {
      handled: true,
      reply: 'Always-On receptor placed in standby mode.',
      settingsPatch: { alwaysOn: false },
    };
  }

  if (
    normalized.includes('activate air gesture') ||
    normalized.includes('enable air gesture') ||
    normalized.includes('open air gesture')
  ) {
    return {
      handled: true,
      reply: 'Optical proximity air gestures enabled. Opening gesture HUD.',
      settingsPatch: { airGesturesEnabled: true },
      openDialog: 'airGestures',
    };
  }

  if (normalized.includes('disable air gesture') || normalized.includes('turn off air gesture')) {
    return {
      handled: true,
      reply: 'Air gesture sensor suite deactivated.',
      settingsPatch: { airGesturesEnabled: false },
    };
  }

  if (normalized.includes('hologram') || normalized.includes('avatar mode') || normalized.includes('suit mode')) {
    return {
      handled: true,
      reply: 'Projecting 3D Hologram Avatar bust on emitter pedestal.',
      settingsPatch: { screenStyle: 'hologram' },
    };
  }

  if (normalized.includes('arc reactor') || normalized.includes('sphere mode') || normalized.includes('core mode')) {
    return {
      handled: true,
      reply: 'Switching visual core to 3D Arc Reactor consciousness sphere.',
      settingsPatch: { screenStyle: 'arcReactor' },
    };
  }

  if (normalized.includes('brain dump') || normalized.includes('multitask') || normalized.includes('decouple')) {
    return {
      handled: true,
      reply: 'Opening Multi-Task Decoupler parallel engine.',
      openDialog: 'brainDump',
    };
  }

  if (normalized.includes('record macro') || normalized.includes('save macro')) {
    return {
      handled: true,
      toggleMacro: true,
    };
  }

  if (normalized.includes('enable sentry') || normalized.includes('sentry mode on')) {
    return {
      handled: true,
      reply: 'Sentry anti-theft watchdog armed. Monitoring motion and acoustic anomalies.',
      settingsPatch: { sentryModeEnabled: true },
    };
  }

  return { handled: false };
}

/**
 * Returns the exact dynamic HUD theme color hex from AbuZar-Ansarii/Jarvis
 * based on active phase:
 * - idle / listening -> Electric Arc Cyan (#00E5FF)
 * - thinking -> Quantum Violet-Purple (#BA68C8)
 * - speaking -> Radiant Solar Gold (#FFB300)
 * - executing -> Tactical Amber-Orange (#FF9100)
 */
export function getPhaseAccentColor(phase: BroPhase): string {
  switch (phase) {
    case 'thinking':
      return '#BA68C8';
    case 'speaking':
      return '#FFB300';
    case 'executing':
      return '#FF9100';
    case 'listening':
    case 'idle':
    default:
      return '#00E5FF';
  }
}

export function getPhaseLabel(phase: BroPhase, step = 0): string {
  switch (phase) {
    case 'listening':
      return 'LISTENING';
    case 'thinking':
      return 'COMPUTING';
    case 'speaking':
      return 'SPEAKING';
    case 'executing':
      return step > 0 ? `AUTOMATION STEP #${step}` : 'TASK IN PROGRESS';
    case 'idle':
    default:
      return 'STANDBY';
  }
}

export function formatShortTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatSessionDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
