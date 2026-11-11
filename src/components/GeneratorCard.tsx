import React, { useState } from 'react';
import { 
  KeyRound, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Hash, 
  Calendar,
  Zap
} from 'lucide-react';
import { 
  generateLicenseKey, 
  KeyFormat, 
  LicenseRecord, 
  createLicenseRecord 
} from '../utils/license';
import { playCyberGenerate, playCyberCopy, playCyberClick } from '../utils/audio';

import { copyToClipboard } from '../utils/clipboard';

interface GeneratorCardProps {
  onKeysGenerated: (newRecords: LicenseRecord[]) => void;
  onCopySuccess: (text: string) => void;
  lastGeneratedKey: string;
  setLastGeneratedKey: (key: string) => void;
}

export const GeneratorCard: React.FC<GeneratorCardProps> = ({
  onKeysGenerated,
  onCopySuccess,
  lastGeneratedKey,
  setLastGeneratedKey,
}) => {
  const [durationDays, setDurationDays] = useState<number>(7); // Default 7 Days (Standard)
  const [format, setFormat] = useState<KeyFormat>('compact'); // Default SURI-XXXX-XXXX$
  const [clientName, setClientName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [batchCount, setBatchCount] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    playCyberGenerate();

    setTimeout(() => {
      const records: LicenseRecord[] = [];
      let latest = '';

      for (let i = 0; i < batchCount; i++) {
        const clientLabel = clientName.trim()
          ? (batchCount > 1 ? `${clientName.trim()}-${i + 1}` : clientName.trim())
          : `Bot-Node-${Math.floor(100 + Math.random() * 900)}`;

        const key = generateLicenseKey({
          durationDays,
          format,
          clientName: clientLabel,
          notes,
        });

        latest = key;
        const record = createLicenseRecord(key, durationDays, clientLabel, notes);
        records.push(record);
      }

      setLastGeneratedKey(latest);
      onKeysGenerated(records);
      setIsGenerating(false);
    }, 200);
  };

  const handleCopyKey = async () => {
    if (!lastGeneratedKey) return;
    playCyberCopy();
    await copyToClipboard(lastGeneratedKey);
    setIsCopied(true);
    onCopySuccess(`COPIED LICENSE KEY: ${lastGeneratedKey}`);
    setTimeout(() => setIsCopied(false), 2200);
  };

  return (
    <div className="bg-gradient-to-b from-zinc-950/95 to-black/90 border border-red-900/60 rounded-2xl p-5 sm:p-7 cyber-glow-red relative overflow-hidden flex flex-col justify-between">
      
      {/* Background ambient lighting */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-950/60 border border-red-800/40">
                CORE MODULE
              </span>
              <span className="text-xs font-mono text-zinc-500">TAMPER-PROOF CIPHER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cyber text-white flex items-center gap-2 mt-1">
              <KeyRound className="w-6 h-6 text-red-500" />
              <span>LICENSE KEY GENERATOR</span>
            </h2>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              KEYGEN ENGINE READY
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              STRICT SYMBOL: <strong className="text-white">$</strong>
            </span>
          </div>
        </div>

        {/* 1. KEY DURATION SELECTION (Requirement 2) */}
        <div className="mb-6">
          <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span>1. SELECT DURATION TIER:</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 7 Days Standard Option */}
            <button
              type="button"
              onClick={() => {
                playCyberClick();
                setDurationDays(7);
              }}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative group ${
                durationDays === 7
                  ? 'border-amber-500 bg-gradient-to-br from-amber-950/40 via-zinc-950 to-black text-white shadow-lg shadow-amber-950/30'
                  : 'border-zinc-800/90 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-cyber font-bold text-lg tracking-wide flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${durationDays === 7 ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-zinc-600'}`} />
                  7 DAYS
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  STANDARD TIER
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Trial or weekly pass • Full bot access
              </p>
              {durationDays === 7 && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>

            {/* 30 Days Premium Option */}
            <button
              type="button"
              onClick={() => {
                playCyberClick();
                setDurationDays(30);
              }}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative group ${
                durationDays === 30
                  ? 'border-red-500 bg-gradient-to-br from-red-950/50 via-zinc-950 to-black text-white shadow-lg shadow-red-950/40'
                  : 'border-zinc-800/90 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-cyber font-bold text-lg tracking-wide flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${durationDays === 30 ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-zinc-600'}`} />
                  30 DAYS
                </span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                  PREMIUM TIER
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Full monthly subscription • High priority
              </p>
              {durationDays === 30 && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* 2. KEY FORMAT SELECTION (Requirement 3: Option to display "SURI-XXXX-XXXX$" formatted key) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-red-400" />
              <span>2. KEY FORMAT PATTERN:</span>
            </label>
            <span className="text-[11px] font-mono text-red-400">
              Must end with secret symbol: <strong className="text-white bg-red-950 px-1.5 py-0.5 rounded border border-red-800/60">$</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Standard SURI-XXXX-XXXX$ (Requirement 3) */}
            <label
              onClick={() => {
                playCyberClick();
                setFormat('compact');
              }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                format === 'compact'
                  ? 'border-red-500/80 bg-red-950/30 text-white'
                  : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <input
                type="radio"
                name="formatOption"
                checked={format === 'compact'}
                onChange={() => setFormat('compact')}
                className="mt-1 text-red-600 accent-red-600 focus:ring-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
                    SURI-XXXX-XXXX$
                  </span>
                  <span className="text-[9px] font-mono uppercase bg-red-900/60 text-red-200 px-1.5 py-0.2 rounded">
                    DEFAULT
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                  Compact 8-char encrypted payload + secret $
                </p>
              </div>
            </label>

            {/* Extended SURI-XXXX-XXXX-XXXX$ */}
            <label
              onClick={() => {
                playCyberClick();
                setFormat('extended');
              }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                format === 'extended'
                  ? 'border-red-500/80 bg-red-950/30 text-white'
                  : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <input
                type="radio"
                name="formatOption"
                checked={format === 'extended'}
                onChange={() => setFormat('extended')}
                className="mt-1 text-red-600 accent-red-600 focus:ring-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
                    SURI-XXXX-XXXX-XXXX$
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                  Extended 12-char enterprise entropy + secret $
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 3. OPTIONAL CLIENT & BATCH CONFIGURATION */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              ASSIGNED CLIENT / BOT TAG (OPTIONAL):
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. TraderBot-Alpha or VIP-User-01"
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              BATCH GENERATE:
            </label>
            <select
              value={batchCount}
              onChange={(e) => setBatchCount(Number(e.target.value))}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-red-500 transition-all"
            >
              <option value={1}>1 Key (Single)</option>
              <option value={5}>5 Keys (Batch)</option>
              <option value={10}>10 Keys (Batch)</option>
              <option value={25}>25 Keys (Bulk)</option>
            </select>
          </div>
        </div>

        {/* GENERATE ACTION BUTTON */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-cyber font-bold text-base sm:text-lg tracking-wider uppercase cyber-glow-red hover:cyber-glow-red-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Cpu className="w-5 h-5 animate-spin" />
              <span>ENCRYPTING CIPHER PAYLOAD...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-amber-300" />
              <span>
                GENERATE {batchCount > 1 ? `${batchCount} ENCRYPTED KEYS` : 'ENCRYPTED LICENSE KEY'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* OUTPUT DISPLAY & REQUIREMENT 4: "COPY KEY" BUTTON */}
      <div className="mt-8 pt-6 border-t border-zinc-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ACTIVE GENERATED KEY</span>
          </span>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
              durationDays === 7
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-red-500/20 text-red-300 border-red-500/40'
            }`}
          >
            {durationDays === 7 ? '7 DAYS STANDARD' : '30 DAYS PREMIUM'}
          </span>
        </div>

        {/* Cyber Key Container with prominent red border & glow */}
        <div className="bg-black/95 border-2 border-red-600/80 rounded-2xl p-4 sm:p-5 cyber-glow-red relative group transition-all">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* The Key String Display */}
            <div className="w-full text-center lg:text-left overflow-x-auto py-1">
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <span className="font-mono text-xl sm:text-2xl md:text-3xl font-extrabold tracking-widest text-red-400 select-all cyber-glow-text">
                  {lastGeneratedKey || 'SURI-XXXX-XXXX$'}
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-2 text-xs font-mono text-zinc-500">
                <span className="text-zinc-400">
                  Pattern: <span className="text-white font-semibold">{format === 'compact' ? 'SURI-XXXX-XXXX$' : 'SURI-XXXX-XXXX-XXXX$'}</span>
                </span>
                <span>•</span>
                <span className="text-zinc-400">
                  Valid: <span className="text-emerald-400 font-semibold">{durationDays} Days</span>
                </span>
                <span>•</span>
                <span className="text-red-400 font-semibold">Secret '$' Enforced</span>
              </div>
            </div>

            {/* REQUIREMENT 4: "COPY KEY" BUTTON */}
            <button
              type="button"
              onClick={handleCopyKey}
              className={`w-full lg:w-auto px-7 py-3.5 rounded-xl font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shrink-0 transition-all duration-200 active:scale-95 shadow-lg ${
                isCopied
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/60'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/70 hover:cyber-glow-red'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY KEY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security verification footnotes */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500 gap-2 px-1">
          <span>✓ Guaranteed to start with "SURI-"</span>
          <span>✓ Guaranteed to terminate with "$"</span>
          <span>✓ Encrypted with HMAC-SHA tamper seal</span>
        </div>
      </div>

    </div>
  );
};
