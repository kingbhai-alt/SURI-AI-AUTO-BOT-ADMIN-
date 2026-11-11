import React from 'react';
import { ShieldAlert, Volume2, VolumeX, Download, Code2, Bot, Terminal } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playCyberClick } from '../utils/audio';

interface HeaderProps {
  onOpenStandaloneModal: () => void;
  onOpenBotModal: () => void;
  totalKeysCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStandaloneModal,
  onOpenBotModal,
  totalKeysCount,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playCyberClick();
  };

  return (
    <header className="border-b border-red-950/60 bg-black/75 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-rose-950 p-[1.5px] cyber-glow-red transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-red-500 font-mono text-xl font-bold">
                <Bot className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/80 border border-red-800/50">
                CYBER ADMIN HQ
              </span>
              <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                v2.4.0 ENCRYPTED
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider font-cyber cyber-glow-text text-white flex items-center gap-2">
              SURI AI AUTO BOT
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/40 font-mono hidden lg:inline">
                PANEL
              </span>
            </h1>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Active Status Badges */}
          <div className="hidden sm:flex items-center gap-2 bg-zinc-950/90 border border-zinc-800/90 px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400">CIPHER:</span>
            <span className="text-emerald-400 font-bold">FEISTEL-B32</span>
          </div>

          <div className="flex items-center gap-1.5 bg-red-950/50 border border-red-800/60 px-3 py-1.5 rounded-lg text-xs font-mono text-red-300">
            <span className="text-zinc-400">RULE:</span>
            <span className="text-white font-bold">SURI-*$</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300">
            <span className="text-zinc-500">STORED:</span>
            <span className="text-red-400 font-bold">{totalKeysCount} Keys</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundOn ? 'Disable Cyber Sound Effects' : 'Enable Cyber Sound Effects'}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle Cyber SFX"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-red-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* Bot Code Docs */}
          <button
            type="button"
            onClick={() => {
              playCyberClick();
              onOpenBotModal();
            }}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-900/60 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Code2 className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Bot Verify Code</span>
          </button>

          {/* Standalone HTML Exporter (Requirement 5) */}
          <button
            type="button"
            onClick={() => {
              playCyberClick();
              onOpenStandaloneModal();
            }}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 border border-red-700/60 text-xs font-mono font-bold text-red-200 hover:text-white transition-all flex items-center gap-2 shadow-sm shadow-red-950"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>Standalone HTML</span>
          </button>

        </div>

      </div>
    </header>
  );
};
