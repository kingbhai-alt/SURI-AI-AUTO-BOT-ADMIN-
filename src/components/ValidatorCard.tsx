import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  FileCheck,
  ClipboardPaste,
  Sparkles
} from 'lucide-react';
import { validateLicenseKey, ValidationResult } from '../utils/license';
import { playCyberClick } from '../utils/audio';

interface ValidatorCardProps {
  initialKey?: string;
}

export const ValidatorCard: React.FC<ValidatorCardProps> = ({ initialKey = '' }) => {
  const [inputKey, setInputKey] = useState<string>(initialKey);
  const [result, setResult] = useState<ValidationResult | null>(() => {
    return initialKey ? validateLicenseKey(initialKey) : null;
  });

  const handleInputChange = (val: string) => {
    setInputKey(val);
    if (!val.trim()) {
      setResult(null);
      return;
    }
    const res = validateLicenseKey(val);
    setResult(res);
  };

  const handlePaste = async () => {
    playCyberClick();
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputKey(text);
        setResult(validateLicenseKey(text));
      }
    } catch {
      // fallback
    }
  };

  const testKeySample = (key: string) => {
    playCyberClick();
    setInputKey(key);
    setResult(validateLicenseKey(key));
  };

  return (
    <div className="bg-gradient-to-b from-zinc-950/95 to-black/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-red-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                INTEGRITY VERIFICATION
              </span>
              <h3 className="text-base sm:text-lg font-bold font-cyber text-white">
                KEY VALIDATOR & DECODER
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            DECRYPTOR
          </span>
        </div>

        <p className="text-xs text-zinc-400 font-mono mb-4 leading-relaxed">
          Inspect, decrypt, and verify any license key. Enforces prefix <span className="text-red-400 font-bold">SURI-</span> and secret terminator <span className="text-red-400 font-bold">$</span>:
        </p>

        {/* Input with Paste button */}
        <div className="relative mb-4">
          <input
            type="text"
            value={inputKey}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste license key (e.g. SURI-A9F2-K8M3$)..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-3.5 pr-24 py-3 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>PASTE</span>
          </button>
        </div>

        {/* Real-time Verification Checklist */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            inputKey.startsWith('SURI-')
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
              : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
          }`}>
            {inputKey.startsWith('SURI-') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-zinc-600 shrink-0" />
            )}
            <span>Starts with "SURI-"</span>
          </div>

          <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            inputKey.endsWith('$')
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
              : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
          }`}>
            {inputKey.endsWith('$') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-zinc-600 shrink-0" />
            )}
            <span>Ends with "$"</span>
          </div>
        </div>

        {/* Detailed Result Card */}
        {result ? (
          <div className={`rounded-xl border p-4 font-mono transition-all ${
            result.isValid
              ? 'bg-zinc-950/90 border-emerald-600/50 shadow-md shadow-emerald-950/40'
              : 'bg-zinc-950/90 border-red-800/60 shadow-md shadow-red-950/40'
          }`}>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 mb-3">
              <span className="text-xs text-zinc-400">STATUS REPORT:</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  result.isValid
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}
              >
                {result.statusText}
              </span>
            </div>

            {result.isValid ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Decoded Tier:</span>
                  <span className="text-white font-bold">{result.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Duration:</span>
                  <span className="text-emerald-400 font-bold">{result.durationDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Issued On:</span>
                  <span className="text-zinc-300">{result.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Expiration Date:</span>
                  <span className="text-zinc-300">{result.expiresAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Remaining:</span>
                  <span className="text-amber-300 font-bold">{result.daysRemaining} Days</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800 pt-2 text-[11px] text-zinc-500">
                  <span>Cryptographic Seal:</span>
                  <span className="text-emerald-400">MATCHED</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs">
                <div className="text-red-400 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{result.errorReason}</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Ensure the key has not been altered and ends with the secret "$" symbol.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 text-center text-xs font-mono text-zinc-500">
            Awaiting license key input to decrypt...
          </div>
        )}
      </div>

      {/* Preset Test Buttons for Quick Evaluation */}
      <div className="mt-5 pt-4 border-t border-zinc-800/80">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">
          QUICK DIAGNOSTIC TESTS:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => testKeySample('SURI-37A4-KM82$')}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white transition-colors"
          >
            Sample 7D
          </button>
          <button
            type="button"
            onClick={() => testKeySample('SURI-9Q7E-5XZP$')}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white transition-colors"
          >
            Sample 30D
          </button>
          <button
            type="button"
            onClick={() => testKeySample('SURI-A9F2-K8M3')}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-amber-400/80 hover:text-amber-300 transition-colors"
          >
            Test Missing $
          </button>
          <button
            type="button"
            onClick={() => testKeySample('BOT-8888-9999$')}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-red-400/80 hover:text-red-300 transition-colors"
          >
            Test Invalid Prefix
          </button>
        </div>
      </div>
    </div>
  );
};
