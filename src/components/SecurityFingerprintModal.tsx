import React from 'react';
import { X, ShieldCheck, QrCode, Lock, CheckCircle2, Copy } from 'lucide-react';

interface SecurityFingerprintModalProps {
  partnerName: string;
  fingerprint: string;
  onClose: () => void;
}

export const SecurityFingerprintModal: React.FC<SecurityFingerprintModalProps> = ({
  partnerName,
  fingerprint,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fingerprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const blocks = fingerprint.split(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#161616] border border-[#2e2e2e] rounded-3xl p-6 shadow-2xl text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Verify End-to-End Encryption
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Messages and calls with <span className="text-white font-semibold">{partnerName}</span> are encrypted with Signal-grade AES-256-GCM. Compare this security number on both devices.
          </p>
        </div>

        {/* QR Code Graphic Mockup */}
        <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl shadow-lg flex flex-col items-center justify-center border-4 border-[#222]">
          <div className="w-full h-full border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center gap-2">
            <QrCode className="w-24 h-24 text-black" />
            <span className="text-[9px] font-mono text-neutral-600 font-bold uppercase tracking-widest">
              Bro E2EE Seal
            </span>
          </div>
        </div>

        {/* 6-Block 30-Digit Safety Number */}
        <div className="bg-[#101010] p-3.5 rounded-2xl border border-[#262626] font-mono text-xs sm:text-sm text-neutral-200 tracking-wider">
          <div className="grid grid-cols-3 gap-2 py-1">
            {blocks.map((b, i) => (
              <span key={i} className="bg-[#1c1c1c] px-2 py-1 rounded text-emerald-300 font-semibold">
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242424] hover:bg-[#303030] text-xs font-semibold text-neutral-200 border border-[#383838] transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Copy Security Number</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-2 border-t border-[#262626] flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>Zero-Knowledge Architecture • Signal Ratchet Protocol</span>
        </div>
      </div>
    </div>
  );
};
