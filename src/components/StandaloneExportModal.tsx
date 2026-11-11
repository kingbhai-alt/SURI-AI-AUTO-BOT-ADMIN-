import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Code2, 
  Globe, 
  UploadCloud, 
  FileCode,
  Terminal
} from 'lucide-react';
import { generateStandaloneHtml } from '../utils/standaloneHtml';
import { playCyberCopy, playCyberClick } from '../utils/audio';
import { copyToClipboard } from '../utils/clipboard';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess: (text: string) => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
  onCopySuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'deploy'>('code');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const standaloneHtml = generateStandaloneHtml();

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    playCyberCopy();
    await copyToClipboard(standaloneHtml);
    setIsCopied(true);
    onCopySuccess('COPIED STANDALONE HTML/JS CODE TO CLIPBOARD');
    setTimeout(() => setIsCopied(false), 2200);
  };

  const handleDownload = () => {
    playCyberClick();
    const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'suri_ai_bot_admin_standalone.html';
    link.click();
    URL.revokeObjectURL(url);
    onCopySuccess('DOWNLOADED suri_ai_bot_admin_standalone.html');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-zinc-950 border border-red-900/80 rounded-2xl cyber-glow-red overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-widest block">
                REQUIREMENT 5 DELIVERABLE
              </span>
              <h3 className="text-lg font-bold font-cyber text-white">
                STANDALONE SINGLE-FILE HTML / CSS / JS
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation & quick action buttons */}
        <div className="px-6 py-3 border-b border-zinc-800/80 bg-black/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                activeTab === 'code'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Pure HTML/JS Code
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deploy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                activeTab === 'deploy'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Netlify / Vercel Guide
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                isCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'COPIED CODE!' : 'COPY CODE'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-red-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD .HTML</span>
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'code' ? (
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span>Self-contained single-file with Tailwind CDN, Google Fonts, and zero dependencies:</span>
                <span className="text-red-400 font-bold">{standaloneHtml.length} characters</span>
              </div>
              <pre className="bg-black/95 p-4 rounded-xl border border-zinc-800 text-zinc-300 overflow-x-auto max-h-[50vh] text-[11px] leading-relaxed select-all">
                {standaloneHtml}
              </pre>
            </div>
          ) : (
            <div className="space-y-6 text-zinc-300">
              <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/20">
                <h4 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>How to Run Locally (Zero Setup):</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-300">
                  <li>Click <strong className="text-white">"DOWNLOAD .HTML"</strong> above.</li>
                  <li>Double click the downloaded <code className="bg-black px-1.5 py-0.5 rounded text-red-400">suri_ai_bot_admin_standalone.html</code> in Windows Explorer, macOS Finder, or Linux.</li>
                  <li>It runs instantly in Chrome, Firefox, Safari, or Edge without any server, Node.js, or build command!</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>Deploy to Netlify (10 Seconds, Free):</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300">
                  <li>Rename the file to <code className="bg-black px-1.5 py-0.5 rounded text-white">index.html</code>.</li>
                  <li>Place <code className="bg-black px-1.5 py-0.5 rounded text-white">index.html</code> inside an empty folder (e.g. <code className="bg-black px-1.5 py-0.5 rounded text-zinc-400">suri-admin</code>).</li>
                  <li>Go to <strong className="text-emerald-400">app.netlify.com/drop</strong> and drag-and-drop the folder.</li>
                  <li>Your admin panel is instantly live with a global HTTPS URL!</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Deploy to Vercel (CLI or GitHub):</span>
                </h4>
                <p className="text-xs text-zinc-400 mb-2">
                  Run inside the folder containing <code className="bg-black px-1 py-0.5 rounded text-white">index.html</code>:
                </p>
                <pre className="bg-black p-3 rounded-lg text-emerald-400 text-xs">
npx vercel deploy --prod
                </pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
