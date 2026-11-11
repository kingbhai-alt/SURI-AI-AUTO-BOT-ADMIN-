import React, { useState } from 'react';
import { X, Code2, Copy, Check, Terminal, Cpu } from 'lucide-react';
import { playCyberCopy, playCyberClick } from '../utils/audio';
import { copyToClipboard } from '../utils/clipboard';

interface BotIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySuccess: (text: string) => void;
}

export const BotIntegrationModal: React.FC<BotIntegrationModalProps> = ({
  isOpen,
  onClose,
  onCopySuccess,
}) => {
  const [lang, setLang] = useState<'python' | 'nodejs'>('python');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const pythonSnippet = `# SURI AI AUTO BOT - License Key Validator Snippet (Python)
import time

CYBER_CHARSET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
SECRET_SEED = 0x8F
CIPHER_MASK = [0x5A, 0xA5, 0x3C, 0xC3, 0x96]

def verify_suri_license(key: str) -> dict:
    key = key.strip()
    
    # 1. Enforce prefix "SURI-" and secret symbol "$"
    if not key.startswith("SURI-"):
        return {"valid": False, "error": "Missing SURI- prefix"}
    if not key.endswith("$"):
        return {"valid": False, "error": "Missing secret symbol '$'"}
        
    body = key[5:-1]
    parts = body.split("-")
    if len(parts) != 2 or len(parts[0]) != 4 or len(parts[1]) != 4:
        return {"valid": False, "error": "Must match SURI-XXXX-XXXX$ format"}
        
    # 2. Decode 8 Base32 chars into 5 bytes
    val = 0
    for char in (parts[0] + parts[1]).upper():
        idx = CYBER_CHARSET.find(char)
        if idx == -1:
            return {"valid": False, "error": "Invalid character in key"}
        val = (val << 5) | idx
        
    bytes_list = []
    for i in range(4, -1, -1):
        bytes_list.append((val >> (i * 8)) & 0xFF)
        
    # 3. Decrypt bytes
    out = list(bytes_list)
    out[4] = (out[4] ^ out[3]) & 0xFF
    out[3] = (out[3] ^ out[2]) & 0xFF
    out[2] = (out[2] ^ out[1]) & 0xFF
    out[1] = (out[1] ^ out[0]) & 0xFF
    for i in range(5):
        out[i] = (out[i] ^ CIPHER_MASK[i]) & 0xFF
        
    b0, b1, b2, b3, b4 = out
    expected_checksum = (b0 * 31 + b1 * 17 + b2 * 13 + b3 * 7 + SECRET_SEED) & 0xFF
    if b4 != expected_checksum:
        return {"valid": False, "error": "Tampered key or invalid checksum"}
        
    duration_days = b0
    issue_day = (b1 << 8) | b2
    created_ts = (issue_day + 20089) * 86400
    expires_ts = created_ts + (duration_days * 86400)
    now_ts = time.time()
    
    if now_ts > expires_ts:
        return {"valid": False, "error": "License expired"}
        
    return {
        "valid": True,
        "duration_days": duration_days,
        "days_remaining": int((expires_ts - now_ts) / 86400)
    }

# Example usage in bot startup:
# res = verify_suri_license("SURI-A9F2-K8M3$")
# if not res["valid"]: sys.exit("License Invalid!")
`;

  const nodeSnippet = `// SURI AI AUTO BOT - License Key Validator Snippet (Node.js / JavaScript)
const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const SECRET_SEED = 0x8f;
const CIPHER_MASK = [0x5a, 0xa5, 0x3c, 0xc3, 0x96];

function verifySuriLicense(key) {
  key = (key || '').trim();
  
  // 1. Enforce prefix "SURI-" and secret symbol "$"
  if (!key.startsWith('SURI-')) return { valid: false, error: 'Missing SURI- prefix' };
  if (!key.endsWith('$')) return { valid: false, error: 'Missing secret symbol "$"' };
  
  const body = key.slice(5, -1);
  const parts = body.split('-');
  if (parts.length !== 2 || parts[0].length !== 4 || parts[1].length !== 4) {
    return { valid: false, error: 'Must match SURI-XXXX-XXXX$ format' };
  }
  
  let val = 0n;
  for (const c of (parts[0] + parts[1]).toUpperCase()) {
    const idx = CHARSET.indexOf(c);
    if (idx === -1) return { valid: false, error: 'Invalid character' };
    val = (val << 5n) | BigInt(idx);
  }
  
  const bytes = [];
  for (let i = 4; i >= 0; i--) {
    bytes.push(Number((val >> BigInt(i * 8)) & 0xffn));
  }
  
  bytes[4] = (bytes[4] ^ bytes[3]) & 0xff;
  bytes[3] = (bytes[3] ^ bytes[2]) & 0xff;
  bytes[2] = (bytes[2] ^ bytes[1]) & 0xff;
  bytes[1] = (bytes[1] ^ bytes[0]) & 0xff;
  for (let i = 0; i < 5; i++) bytes[i] = (bytes[i] ^ CIPHER_MASK[i]) & 0xff;
  
  const [b0, b1, b2, b3, b4] = bytes;
  const expectedCheck = (b0 * 31 + b1 * 17 + b2 * 13 + b3 * 7 + SECRET_SEED) & 0xff;
  if (b4 !== expectedCheck) return { valid: false, error: 'Tamper detected / bad checksum' };
  
  const durationDays = b0;
  const issueDay = (b1 << 8) | b2;
  const expiresMs = ((issueDay + 20089) * 86400000) + (durationDays * 86400000);
  
  return {
    valid: Date.now() <= expiresMs,
    durationDays,
    expired: Date.now() > expiresMs
  };
}
`;

  const codeToShow = lang === 'python' ? pythonSnippet : nodeSnippet;

  const handleCopy = async () => {
    playCyberCopy();
    await copyToClipboard(codeToShow);
    setIsCopied(true);
    onCopySuccess('COPIED BOT VALIDATION CODE');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-zinc-950 border border-red-900/80 rounded-2xl cyber-glow-red overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-500 uppercase font-bold tracking-widest block">
                INTEGRATION GUIDE
              </span>
              <h3 className="text-lg font-bold font-cyber text-white">
                EMBEDDED BOT VALIDATOR CODE
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

        {/* Language Tabs & Copy Button */}
        <div className="px-6 py-3 border-b border-zinc-800/80 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playCyberClick();
                setLang('python');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                lang === 'python'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Python (Bot script)
            </button>
            <button
              type="button"
              onClick={() => {
                playCyberClick();
                setLang('nodejs');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                lang === 'nodejs'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Node.js / Discord Bot
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              isCopied
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'COPIED!' : 'COPY CODE'}</span>
          </button>
        </div>

        {/* Code View */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          <pre className="bg-black/95 p-4 rounded-xl border border-zinc-800 text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
            {codeToShow}
          </pre>
        </div>

      </div>
    </div>
  );
};
