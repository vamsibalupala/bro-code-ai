import React, { useState } from 'react';
import {
  X,
  GitFork,
  Mic,
  MicOff,
  Loader2,
  CheckCircle2,
  Zap,
  AlertCircle,
} from 'lucide-react';
import type {
  DecoupledTask,
  BrowserSpeechRecognition,
  BrowserSpeechRecognitionEvent,
} from '../../types/bro';

interface BrainDumpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCompletedItems: (payload: {
    todos?: string[];
    events?: { title: string; time: string }[];
    notes?: { title: string; content: string }[];
    summary: string;
  }) => void;
  onSpeak?: (text: string) => void;
}

const EXAMPLE_DUMP =
  'Remind me at 5 PM to call Alex, add almond milk and coffee beans to my todo list, calculate 18% of 1450, and draft a quick message saying I will be 10 minutes late.';

export const BrainDumpDialog: React.FC<BrainDumpDialogProps> = ({
  isOpen,
  onClose,
  onCompletedItems,
  onSpeak,
}) => {
  const [input, setInput] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<DecoupledTask[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDictate = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    };
    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setError('Speech dictation is unavailable in this browser. Type your compound prompt below.');
      return;
    }

    setError(null);
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    setIsDictating(true);

    recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0]?.transcript ?? '')
        .join(' ');
      if (transcript.trim()) {
        setInput(transcript.trim());
      }
    };
    recognition.onerror = () => setIsDictating(false);
    recognition.onend = () => setIsDictating(false);
    recognition.start();
  };

  const handleProcess = async (overrideText?: string) => {
    const dumpText = (overrideText ?? input).trim();
    if (!dumpText || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    setSummary(null);
    setTasks([]);

    try {
      const res = await fetch('/api/bro/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dumpText }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to decouple tasks.');
      }

      const parsedTasks: DecoupledTask[] = (data.tasks || []).map(
        (t: { category?: string; title?: string; result?: string }, idx: number) => ({
          id: `dt_${Date.now()}_${idx}`,
          category: t.category || 'task',
          title: t.title || 'Executed Directive',
          result: t.result || 'Completed',
          status: 'done',
        })
      );

      setTasks(parsedTasks);
      const execSummary =
        data.summary || `Completed ${parsedTasks.length} parallel directives.`;
      setSummary(execSummary);

      onCompletedItems({
        todos: data.todos,
        events: data.events,
        notes: data.notes,
        summary: execSummary,
      });

      if (onSpeak) {
        onSpeak(execSummary);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to execute brain dump.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Multi-Task Decoupler"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <div className="w-full max-w-lg max-h-[86vh] flex flex-col rounded-[24px] p-5 bg-[#0A1522]/95 border border-[#00E5FF]/45 shadow-[0_0_36px_rgba(0,229,255,0.22)] text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/50 flex items-center justify-center shrink-0">
            <GitFork className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-mono text-[13.5px] font-bold tracking-[0.14em] text-[#00E5FF]">
              MULTI-TASK DECOUPLER
            </h2>
            <p className="text-[11px] text-white/60">
              Chaotic Brain Dump Parallel Engine
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Multi-Task Decoupler"
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Box */}
        <div className="mt-4">
          <div
            className={`rounded-2xl bg-black/50 border p-3 transition-colors ${
              isDictating ? 'border-red-400' : 'border-[#00E5FF]/30 focus-within:border-[#00E5FF]'
            }`}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              placeholder="Dictate or paste multiple rambling tasks at once (reminders, todos, math, drafts, notes)..."
              aria-label="Compound brain dump instructions"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 resize-none focus:outline-none leading-relaxed"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setInput(EXAMPLE_DUMP)}
                className="text-xs text-[#00E5FF]/80 hover:text-[#00E5FF] font-medium cursor-pointer"
              >
                Load sample prompt
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDictate}
                  aria-label="Voice dictate brain dump"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
                    isDictating
                      ? 'bg-red-500/20 border-red-400 text-red-400'
                      : 'bg-white/5 border-white/15 text-[#00E5FF] hover:bg-white/10'
                  }`}
                >
                  {isDictating ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  disabled={isProcessing || !input.trim()}
                  onClick={() => handleProcess()}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#33ECFF] text-slate-950 font-bold text-xs tracking-wide inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? 'Decoupling…' : 'Decouple & Execute'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/15 border border-red-500/35 flex items-start gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Parallel Execution Results */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1">
          {summary && (
            <div className="p-3 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-xs text-cyan-100 leading-relaxed">
              <span className="font-mono font-bold text-[#00E5FF] block mb-1">
                EXECUTIVE BRIEFING
              </span>
              {summary}
            </div>
          )}

          {tasks.length === 0 && !isProcessing && !error && (
            <div className="py-8 text-center text-xs text-slate-400 leading-relaxed">
              Parallel vectors stand by. Enter a compound request to split, compute, and sync directly into your Tasks, Calendar, and Notes.
            </div>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-white">{task.title}</span>
                  <span className="text-slate-500">·</span>
                  <span className="font-mono text-[10.5px] text-[#00E5FF] capitalize">
                    {task.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {task.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
