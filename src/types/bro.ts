export type AppMode = 'agent' | 'chat' | 'bro';

export type BroScreenStyle = 'arcReactor' | 'hologram';

export type BroPhase = 'idle' | 'listening' | 'thinking' | 'speaking' | 'executing';

export type ChatRole = 'user' | 'agent' | 'system' | 'error';

export type PersonalityMode = 'concise' | 'balanced' | 'witty';

export type ThemeAppearance = 'dark' | 'light';

export interface BroChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: number;
  step?: number;
}

export interface TaskSession {
  id: string;
  goal: string;
  mode: AppMode;
  status: 'success' | 'failed' | 'cancelled';
  startedAt: number;
  messages: BroChatMessage[];
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  createdAt: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface DecoupledTask {
  id: string;
  category: 'reminder' | 'todo' | 'note' | 'message' | 'calculation' | 'hardware' | 'search' | string;
  title: string;
  result: string;
  status: 'running' | 'done' | 'error';
}

export interface HermesContext {
  soul: string;
  user: string;
  agent: string;
  lastEvolvedAt: number;
  evolutionCount: number;
}

export interface MacroSkill {
  id: string;
  name: string;
  stepsCount: number;
  createdAt: number;
}

export interface BroSettings {
  theme: ThemeAppearance;
  screenStyle: BroScreenStyle;
  alwaysOn: boolean;
  voiceReply: boolean;
  speechRate: number;
  speechPitch: number;
  personality: PersonalityMode;
  airGesturesEnabled: boolean;
  sentryModeEnabled: boolean;
  floatingCopilotEnabled: boolean;
  maxSteps: number;
}

export interface BrowserSpeechRecognitionEvent {
  results: ArrayLike<{
    0?: {
      transcript?: string;
    };
  }>;
}

export interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

