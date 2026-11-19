import React from 'react';
import {
  X,
  Plus,
  CheckSquare,
  Calendar,
  BookOpen,
  GitFork,
  CheckCircle2,
  AlertCircle,
  StopCircle,
  Trash2,
} from 'lucide-react';
import type { TaskSession } from '../../types/bro';
import { formatSessionDate } from '../../utils/broEngine';

interface SessionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: TaskSession[];
  pendingTodosCount: number;
  scheduledEventsCount: number;
  notesCount: number;
  onNewSession: () => void;
  onSelectSession: (session: TaskSession) => void;
  onDeleteSession: (id: string) => void;
  onOpenTodos: () => void;
  onOpenCalendar: () => void;
  onOpenNotes: () => void;
  onOpenBrainDump: () => void;
}

export const SessionsDrawer: React.FC<SessionsDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  pendingTodosCount,
  scheduledEventsCount,
  notesCount,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  onOpenTodos,
  onOpenCalendar,
  onOpenNotes,
  onOpenBrainDump,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="fixed inset-0 bg-black/55 backdrop-blur-xs cursor-default"
      />

      {/* Drawer Panel (Exact Liquid Glass Slate Surface) */}
      <aside
        aria-label="Sessions and Productivity Suite"
        className="relative z-10 w-[300px] max-w-[84vw] h-full flex flex-col bg-white/95 dark:bg-[#090E17]/95 backdrop-blur-2xl border-r border-black/10 dark:border-white/10 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              BRO
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Local-First Autonomous AI
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Session CTA */}
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>

        {/* Productivity Suite */}
        <div className="px-3 py-2 border-t border-black/[0.06] dark:border-white/[0.08]">
          <p className="px-3 pt-2 pb-1.5 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400">
            Productivity Suite
          </p>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTodos();
            }}
            className="w-full min-h-[52px] flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.05] text-left transition-colors cursor-pointer"
          >
            <CheckSquare className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-100">
                Tasks &amp; To-Do
              </p>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 tabular-nums">
                {pendingTodosCount} pending {pendingTodosCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCalendar();
            }}
            className="w-full min-h-[52px] flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.05] text-left transition-colors cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-100">
                Calendar &amp; Schedule
              </p>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 tabular-nums">
                {scheduledEventsCount} scheduled {scheduledEventsCount === 1 ? 'event' : 'events'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNotes();
            }}
            className="w-full min-h-[52px] flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.05] text-left transition-colors cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-100">
                Notes &amp; Knowledge Base
              </p>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 tabular-nums">
                {notesCount} {notesCount === 1 ? 'note' : 'notes'} stored
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBrainDump();
            }}
            className="w-full min-h-[52px] flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#00E5FF]/10 text-left transition-colors cursor-pointer"
          >
            <GitFork className="w-5 h-5 text-[#00B8D4] dark:text-[#00E5FF] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-100">
                Multi-Task Decoupler
              </p>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400">
                Chaotic Brain Dump parallel engine
              </p>
            </div>
          </button>
        </div>

        {/* Recent Sessions */}
        <div className="px-3 py-2 border-t border-black/[0.06] dark:border-white/[0.08] flex-1">
          <p className="px-3 pt-2 pb-1.5 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400">
            Recent Sessions
          </p>

          {sessions.length === 0 ? (
            <p className="px-3 py-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No saved sessions yet. Run an agent task or conversation and it will appear here.
            </p>
          ) : (
            <div className="space-y-1">
              {sessions.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center gap-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.05] pr-1.5 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSession(entry);
                      onClose();
                    }}
                    className="flex-1 min-w-0 flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer"
                  >
                    {entry.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    {entry.status === 'failed' && (
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    {entry.status === 'cancelled' && (
                      <StopCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {entry.goal}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {formatSessionDate(entry.startedAt)} · {entry.mode.toUpperCase()}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSession(entry.id)}
                    aria-label={`Delete session ${entry.goal}`}
                    className="w-9 h-9 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
