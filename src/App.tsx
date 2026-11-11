import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Download, 
  Terminal, 
  Code2, 
  Check, 
  Layers, 
  KeyRound, 
  Cpu, 
  Activity,
  AlertTriangle,
  Zap,
  Globe
} from 'lucide-react';
import { Header } from './components/Header';
import { GeneratorCard } from './components/GeneratorCard';
import { ValidatorCard } from './components/ValidatorCard';
import { LicensesTable } from './components/LicensesTable';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { BotIntegrationModal } from './components/BotIntegrationModal';
import { 
  LicenseRecord, 
  generateLicenseKey, 
  createLicenseRecord 
} from './utils/license';

export default function App() {
  const [licenses, setLicenses] = useState<LicenseRecord[]>(() => {
    try {
      const stored = localStorage.getItem('suri_bot_licenses_v2');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    // Default initial seed records to ensure the dashboard looks populated and professional right away
    const key1 = generateLicenseKey({ durationDays: 7, format: 'compact' });
    const key2 = generateLicenseKey({ durationDays: 30, format: 'compact' });
    const rec1 = createLicenseRecord(key1, 7, 'Alpha-Trader-01', 'VIP Standard Pass');
    const rec2 = createLicenseRecord(key2, 30, 'Nexus-Bot-Master', 'Enterprise Monthly');
    return [rec2, rec1];
  });

  const [lastGeneratedKey, setLastGeneratedKey] = useState<string>(() => {
    return licenses[0]?.key || generateLicenseKey({ durationDays: 7, format: 'compact' });
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isStandaloneModalOpen, setIsStandaloneModalOpen] = useState<boolean>(false);
  const [isBotModalOpen, setIsBotModalOpen] = useState<boolean>(false);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(372);

  // Sync licenses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('suri_bot_licenses_v2', JSON.stringify(licenses));
    } catch {
      // ignore
    }
  }, [licenses]);

  // Cyber HUD clock/uptime ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopySuccess = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleKeysGenerated = (newRecords: LicenseRecord[]) => {
    setLicenses((prev) => [...newRecords, ...prev]);
    handleCopySuccess(`SUCCESSFULLY GENERATED ${newRecords.length} ENCRYPTED KEY(S)`);
  };

  const handleDeleteRecord = (id: string) => {
    setLicenses((prev) => prev.filter((r) => r.id !== id));
    handleCopySuccess('DELETED LICENSE RECORD');
  };

  const handleClearAll = () => {
    setLicenses([]);
    handleCopySuccess('CLEARED ALL LICENSE HISTORY');
  };

  const handleToggleStatus = (id: string) => {
    setLicenses((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'active' ? 'revoked' : 'active';
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const activeCount = licenses.filter((r) => r.status === 'active').length;
  const standardCount = licenses.filter((r) => r.durationDays === 7).length;
  const premiumCount = licenses.filter((r) => r.durationDays === 30).length;

  const formatUptime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen cyber-grid-bg text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        onOpenStandaloneModal={() => setIsStandaloneModalOpen(true)}
        onOpenBotModal={() => setIsBotModalOpen(true)}
        totalKeysCount={licenses.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Cyber HUD Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Key Policy */}
          <div className="bg-zinc-950/80 border border-red-950/80 p-4 rounded-xl relative overflow-hidden group hover:border-red-900/60 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                SECURITY PATTERN
              </span>
              <span className="text-[10px] font-mono font-bold text-red-500 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-900/40">
                ACTIVE
              </span>
            </div>
            <div className="text-red-400 font-mono font-bold text-base sm:text-lg flex items-center gap-1.5">
              <span>SURI-*$</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">
              Prefix "SURI-" & Secret "$" Enforced
            </p>
          </div>

          {/* Card 2: 7-Day Standard Keys */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                7-DAY STANDARD
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                TIER 1
              </span>
            </div>
            <div className="text-white font-mono font-bold text-base sm:text-lg flex items-center gap-2">
              <span className="text-amber-400">{standardCount}</span>
              <span className="text-xs text-zinc-500 font-normal">Registered</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">
              Weekly / Trial Bot Keys
            </p>
          </div>

          {/* Card 3: 30-Day Premium Keys */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                30-DAY PREMIUM
              </span>
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                TIER 2
              </span>
            </div>
            <div className="text-white font-mono font-bold text-base sm:text-lg flex items-center gap-2">
              <span className="text-red-400">{premiumCount}</span>
              <span className="text-xs text-zinc-500 font-normal">Registered</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">
              Monthly Full Access Keys
            </p>
          </div>

          {/* Card 4: System Uptime & Standalone Download */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                NODE UPTIME
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="text-emerald-400 font-mono font-bold text-base sm:text-lg">
              {formatUptime(uptimeSeconds)}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">Active Keys: {activeCount}</span>
              <button
                type="button"
                onClick={() => setIsStandaloneModalOpen(true)}
                className="text-red-400 hover:text-red-300 underline underline-offset-2 flex items-center gap-1"
              >
                <span>Export HTML</span>
              </button>
            </div>
          </div>

        </div>

        {/* Primary Row: Generator Card (Left) & Key Validator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Key Generator (7 Cols) */}
          <div className="lg:col-span-7">
            <GeneratorCard
              onKeysGenerated={handleKeysGenerated}
              onCopySuccess={handleCopySuccess}
              lastGeneratedKey={lastGeneratedKey}
              setLastGeneratedKey={setLastGeneratedKey}
            />
          </div>

          {/* Real-time Key Validator & Bot Snippet (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ValidatorCard initialKey={lastGeneratedKey} />

            {/* Quick Bot Callout Banner */}
            <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 shrink-0">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold font-cyber text-white flex items-center gap-2">
                  <span>AUTONOMOUS BOT INTEGRATION</span>
                  <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-300">
                    PYTHON / JS
                  </span>
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-1 leading-relaxed">
                  Easily verify generated <code className="text-red-400 font-bold">SURI-XXXX-XXXX$</code> keys inside Telegram bots, Discord trading bots, or local execution scripts.
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBotModalOpen(true)}
                    className="text-xs font-mono font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 underline underline-offset-4"
                  >
                    <span>View Integration Snippets</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* License History Log & Search Table */}
        <LicensesTable
          records={licenses}
          onDeleteRecord={handleDeleteRecord}
          onClearAll={handleClearAll}
          onToggleStatus={handleToggleStatus}
          onCopySuccess={handleCopySuccess}
        />

        {/* Standalone HTML / Netlify / Vercel Delivery Card (Requirement 5) */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900/80 to-zinc-950 border border-red-900/40 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-950 p-0.5 cyber-glow-red flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center text-red-400">
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                DEPLOYMENT & STANDALONE DELIVERABLE
              </span>
              <h4 className="text-base font-bold font-cyber text-white">
                Standalone Single-File HTML / CSS / JS Available
              </h4>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Zero external bundler required. Double-click locally or deploy immediately to Netlify or Vercel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="/standalone.html"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              Open Direct HTML
            </a>

            <button
              type="button"
              onClick={() => setIsStandaloneModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all cyber-glow-red"
            >
              <Download className="w-4 h-4" />
              <span>Export Code / Download</span>
            </button>
          </div>
        </div>

      </main>

      {/* Cyber Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 to-rose-700 text-white px-5 py-3.5 rounded-xl shadow-2xl font-mono text-xs font-bold tracking-wide flex items-center gap-2.5 cyber-glow-red animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <StandaloneExportModal
        isOpen={isStandaloneModalOpen}
        onClose={() => setIsStandaloneModalOpen(false)}
        onCopySuccess={handleCopySuccess}
      />

      <BotIntegrationModal
        isOpen={isBotModalOpen}
        onClose={() => setIsBotModalOpen(false)}
        onCopySuccess={handleCopySuccess}
      />

      {/* Cyber Footer */}
      <footer className="border-t border-zinc-900/90 py-5 px-4 text-center text-xs font-mono text-zinc-600">
        <p>SURI AI AUTO BOT • LICENSING PROTOCOL • 2026 ENCRYPTED BUILD</p>
      </footer>

    </div>
  );
}
