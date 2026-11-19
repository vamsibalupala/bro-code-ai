import React from 'react';
import { Loader2 } from 'lucide-react';
import type { BroChatMessage } from '../../types/bro';
import { formatShortTime } from '../../utils/broEngine';

interface ChatBubbleProps {
  message: BroChatMessage;
}

function renderFormattedText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Parse inline **bold** and `code` tokens cleanly
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    const renderedParts = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={partIdx}
            className="font-mono text-[12.5px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <React.Fragment key={partIdx}>{part}</React.Fragment>;
    });

    return (
      <React.Fragment key={lineIdx}>
        {renderedParts}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const time = formatShortTime(message.timestamp);

  if (message.role === 'system') {
    return (
      <div className="py-1.5 flex justify-center">
        <div className="px-3.5 py-1.5 rounded-[20px] backdrop-blur-md bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.12] text-center max-w-md">
          <p className="text-xs text-slate-600 dark:text-slate-400">{message.text}</p>
        </div>
      </div>
    );
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end my-1.5">
        <div
          className="max-w-[85%] sm:max-w-[440px] rounded-[20px] px-3.5 pt-2.5 pb-2 backdrop-blur-md border border-[#818CF8]/50 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-white"
          style={{
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.72), rgba(79,70,229,0.48))',
          }}
        >
          <p className="text-[14px] leading-[1.4] whitespace-pre-wrap break-words">
            {message.text}
          </p>
          <div className="mt-1 text-right text-[10px] text-white/60 tabular-nums">
            {time}
          </div>
        </div>
      </div>
    );
  }

  if (message.role === 'error') {
    return (
      <div className="flex justify-start my-1.5">
        <div
          className="max-w-[88%] sm:max-w-[460px] rounded-[20px] px-3.5 pt-2.5 pb-2 backdrop-blur-md border border-red-500/40 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          style={{
            background:
              'linear-gradient(135deg, rgba(239,68,68,0.22), rgba(239,68,68,0.08))',
          }}
        >
          <div className="mb-1.5 text-[11px] font-bold text-red-500 dark:text-red-400 tracking-wide">
            Error
          </div>
          <p className="text-[14px] leading-[1.4] text-red-600 dark:text-red-300 break-words">
            {message.text}
          </p>
          <div className="mt-1 text-right text-[10px] text-red-500/60 tabular-nums">
            {time}
          </div>
        </div>
      </div>
    );
  }

  // Agent / BRO reply bubble
  return (
    <div className="flex justify-start my-1.5">
      <div className="max-w-[88%] sm:max-w-[520px] rounded-[20px] px-3.5 pt-2.5 pb-2 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.15] bg-gradient-to-br from-white/85 to-white/65 dark:from-white/[0.09] dark:to-white/[0.03] shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-slate-900 dark:text-slate-100">
        {message.step !== undefined && (
          <div className="mb-1.5 inline-flex items-center px-2 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-400/35 text-[11px] font-bold text-indigo-600 dark:text-indigo-300 tabular-nums">
            Step {message.step}
          </div>
        )}
        {message.text.length === 0 ? (
          <div className="flex items-center gap-2 py-0.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span className="text-[13px] italic text-slate-500 dark:text-slate-400">
              Thinking…
            </span>
          </div>
        ) : (
          <div className="text-[14px] leading-[1.45] break-words">
            {renderFormattedText(message.text)}
          </div>
        )}
        <div className="mt-1 text-right text-[10px] text-slate-500 dark:text-slate-400/70 tabular-nums">
          {time}
        </div>
      </div>
    </div>
  );
};
