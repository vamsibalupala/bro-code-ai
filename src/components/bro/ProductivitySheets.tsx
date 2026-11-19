import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  BookOpen,
  CheckSquare,
} from 'lucide-react';
import type { TodoItem, CalendarEvent, NoteItem } from '../../types/bro';

interface ProductivitySheetsProps {
  activeSheet: 'todos' | 'calendar' | 'notes' | null;
  onClose: () => void;
  todos: TodoItem[];
  events: CalendarEvent[];
  notes: NoteItem[];
  onAddTodo: (title: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddEvent: (title: string, time: string) => void;
  onDeleteEvent: (id: string) => void;
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const ProductivitySheets: React.FC<ProductivitySheetsProps> = ({
  activeSheet,
  onClose,
  todos,
  events,
  notes,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAddEvent,
  onDeleteEvent,
  onAddNote,
  onDeleteNote,
}) => {
  const [todoInput, setTodoInput] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  if (!activeSheet) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        activeSheet === 'todos'
          ? 'Tasks and To-Do'
          : activeSheet === 'calendar'
          ? 'Calendar and Schedule'
          : 'Notes and Knowledge Base'
      }
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/65 backdrop-blur-md"
    >
      <div className="w-full sm:max-w-lg max-h-[82vh] flex flex-col rounded-t-[28px] sm:rounded-[24px] bg-white dark:bg-[#0F172A] border border-black/10 dark:border-white/15 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            {activeSheet === 'todos' && <CheckSquare className="w-5 h-5 text-indigo-500" />}
            {activeSheet === 'calendar' && <Calendar className="w-5 h-5 text-sky-500" />}
            {activeSheet === 'notes' && <BookOpen className="w-5 h-5 text-purple-500" />}
            <h2 className="text-base font-bold">
              {activeSheet === 'todos' && 'Tasks & To-Do'}
              {activeSheet === 'calendar' && 'Calendar & Schedule'}
              {activeSheet === 'notes' && 'Notes & Knowledge Base'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeSheet === 'todos' && (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!todoInput.trim()) return;
                  onAddTodo(todoInput.trim());
                  setTodoInput('');
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  placeholder="Add a new task…"
                  aria-label="New task title"
                  className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </form>

              {todos.length === 0 ? (
                <p className="text-center py-8 text-sm text-slate-500">
                  No tasks yet. Add one above or dictate a Brain Dump.
                </p>
              ) : (
                <div className="space-y-2">
                  {todos.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.08]"
                    >
                      <button
                        type="button"
                        onClick={() => onToggleTodo(item.id)}
                        aria-label={`Toggle task ${item.title}`}
                        className="text-indigo-500 cursor-pointer"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          item.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {item.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteTodo(item.id)}
                        aria-label={`Delete task ${item.title}`}
                        className="w-9 h-9 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-500 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSheet === 'calendar' && (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!eventTitle.trim()) return;
                  onAddEvent(eventTitle.trim(), eventTime.trim() || 'Today');
                  setEventTitle('');
                  setEventTime('');
                }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_130px_auto] gap-2"
              >
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Event or reminder…"
                  aria-label="Event title"
                  className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="e.g. 5:00 PM"
                  aria-label="Event time"
                  className="rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </form>

              {events.length === 0 ? (
                <p className="text-center py-8 text-sm text-slate-500">
                  Your schedule is clear.
                </p>
              ) : (
                <div className="space-y-2">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.08]"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{ev.title}</p>
                        <p className="text-xs text-sky-600 dark:text-sky-400 font-mono mt-0.5">
                          {ev.time}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteEvent(ev.id)}
                        aria-label={`Delete event ${ev.title}`}
                        className="w-9 h-9 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-500 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSheet === 'notes' && (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!noteTitle.trim() && !noteContent.trim()) return;
                  onAddNote(
                    noteTitle.trim() || 'Untitled Note',
                    noteContent.trim() || 'Quick note saved by BRO.'
                  );
                  setNoteTitle('');
                  setNoteContent('');
                }}
                className="space-y-2"
              >
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note title…"
                  aria-label="Note title"
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-500"
                />
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={2}
                  placeholder="Knowledge entry or note body…"
                  aria-label="Note content"
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="w-full min-h-[44px] rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Note</span>
                </button>
              </form>

              {notes.length === 0 ? (
                <p className="text-center py-8 text-sm text-slate-500">
                  No notes stored yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.08]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold">{n.title}</h3>
                        <button
                          type="button"
                          onClick={() => onDeleteNote(n.id)}
                          aria-label={`Delete note ${n.title}`}
                          className="w-8 h-8 rounded-lg hover:bg-red-500/15 text-slate-400 hover:text-red-500 flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {n.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
