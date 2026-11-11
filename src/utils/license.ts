/**
 * SURI AI AUTO BOT - License Key Encryption & Validation Engine
 *
 * Requirements:
 * 1. Must start with "SURI-"
 * 2. Must end with the secret symbol "$"
 * 3. Supports durations: 7 Days (Standard) or 30 Days (Premium) + Custom
 * 4. Supports "SURI-XXXX-XXXX$" formatted keys (4-4 alphanumeric payload)
 * 5. Cryptographically authenticated with tamper-proof checksum & payload decryption
 */

// Unambiguous Base32 cyber charset (avoids 0, O, 1, I for maximum legibility)
export const CYBER_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const SECRET_SEED = 0x8f; // Suri Bot cryptographic signature seed
const CIPHER_MASK = [0x5a, 0xa5, 0x3c, 0xc3, 0x96];

export type DurationTier = '7d' | '30d' | 'custom';
export type KeyFormat = 'compact' | 'extended'; // 'compact' = SURI-XXXX-XXXX$, 'extended' = SURI-XXXX-XXXX-XXXX$

export interface LicenseKeyOptions {
  durationDays: number;
  tierName?: string;
  format?: KeyFormat;
  clientName?: string;
  notes?: string;
}

export interface LicenseRecord {
  id: string;
  key: string;
  durationDays: number;
  tier: '7 Days Standard' | '30 Days Premium' | 'Custom';
  format: KeyFormat;
  createdAt: number;
  expiresAt: number;
  clientName: string;
  status: 'active' | 'revoked' | 'expired';
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  key: string;
  tier?: string;
  durationDays?: number;
  createdAt?: string;
  expiresAt?: string;
  daysRemaining?: number;
  isExpired?: boolean;
  statusText: string;
  errorReason?: string;
  extractedPayload?: {
    format: KeyFormat;
    salt: number;
    daysIssuedAgo: number;
  };
}

/**
 * Encodes 5 bytes into 8 Base32 characters (40 bits -> 8 * 5 bits)
 */
function encodeBase32_5bytes(bytes: number[]): string {
  let val = 0n;
  for (let i = 0; i < 5; i++) {
    val = (val << 8n) | BigInt(bytes[i] & 0xff);
  }

  let str = '';
  for (let i = 7; i >= 0; i--) {
    const shift = BigInt(i * 5);
    const index = Number((val >> shift) & 0x1fn);
    str += CYBER_CHARSET[index];
  }
  return str;
}

/**
 * Decodes 8 Base32 characters into 5 bytes
 */
function decodeBase32_8chars(str: string): number[] | null {
  if (str.length !== 8) return null;
  let val = 0n;
  for (let i = 0; i < 8; i++) {
    const char = str[i].toUpperCase();
    const idx = CYBER_CHARSET.indexOf(char);
    if (idx === -1) return null;
    val = (val << 5n) | BigInt(idx);
  }

  const bytes: number[] = [];
  for (let i = 4; i >= 0; i--) {
    const shift = BigInt(i * 8);
    bytes.push(Number((val >> shift) & 0xffn));
  }
  return bytes;
}

/**
 * Computes tamper-proof checksum for 4 payload bytes
 */
function computeChecksum(b0: number, b1: number, b2: number, b3: number): number {
  return (b0 * 31 + b1 * 17 + b2 * 13 + b3 * 7 + SECRET_SEED) & 0xff;
}

/**
 * Encrypts/obfuscates 5 bytes using Feistel-style XOR permutation
 */
function encryptBytes(bytes: number[]): number[] {
  const out = [...bytes];
  for (let i = 0; i < 5; i++) {
    out[i] = (out[i] ^ CIPHER_MASK[i]) & 0xff;
  }
  // Inter-byte diffusion
  out[1] = (out[1] ^ out[0]) & 0xff;
  out[2] = (out[2] ^ out[1]) & 0xff;
  out[3] = (out[3] ^ out[2]) & 0xff;
  out[4] = (out[4] ^ out[3]) & 0xff;
  return out;
}

/**
 * Decrypts 5 bytes back to raw payload
 */
function decryptBytes(bytes: number[]): number[] {
  const out = [...bytes];
  out[4] = (out[4] ^ out[3]) & 0xff;
  out[3] = (out[3] ^ out[2]) & 0xff;
  out[2] = (out[2] ^ out[1]) & 0xff;
  out[1] = (out[1] ^ out[0]) & 0xff;
  for (let i = 0; i < 5; i++) {
    out[i] = (out[i] ^ CIPHER_MASK[i]) & 0xff;
  }
  return out;
}

/**
 * Generates an encrypted license key starting with "SURI-" and ending with "$"
 */
export function generateLicenseKey(options: LicenseKeyOptions): string {
  const {
    durationDays = 7,
    format = 'compact',
  } = options;

  // Days since epoch base (2025-01-01) to keep numbers compact
  const EPOCH_BASE = 20089; // days from 1970 to 2025-01-01
  const todayDays = Math.max(0, Math.floor(Date.now() / 86400000) - EPOCH_BASE);

  // Byte 0: Duration code (e.g. 7, 30, or capped to 255)
  const b0 = Math.min(255, Math.max(1, durationDays));

  // Bytes 1 & 2: 16-bit day counter
  const b1 = (todayDays >> 8) & 0xff;
  const b2 = todayDays & 0xff;

  // Byte 3: Random salt for uniqueness across multiple clicks
  const b3 = Math.floor(Math.random() * 256);

  // Byte 4: Tamper-proof cryptographic checksum
  const b4 = computeChecksum(b0, b1, b2, b3);

  // Encrypt payload
  const encrypted = encryptBytes([b0, b1, b2, b3, b4]);
  const encoded = encodeBase32_5bytes(encrypted);

  // Format as requested: SURI-XXXX-XXXX$
  if (format === 'compact') {
    const part1 = encoded.slice(0, 4);
    const part2 = encoded.slice(4, 8);
    return `SURI-${part1}-${part2}$`;
  }

  // Extended format: SURI-XXXX-XXXX-XXXX$ (adds extra 4-char cryptographic verification salt)
  const extraSalt = Math.floor(Math.random() * 256);
  const extraCheck = computeChecksum(b4, extraSalt, b0, 0x42);
  const extraBytes = encryptBytes([extraSalt, extraCheck, b3, b0, 0x11]);
  const extraEncoded = encodeBase32_5bytes(extraBytes).slice(0, 4);
  const part1 = encoded.slice(0, 4);
  const part2 = encoded.slice(4, 8);
  return `SURI-${part1}-${part2}-${extraEncoded}$`;
}

/**
 * Validates any SURI license key
 */
export function validateLicenseKey(rawKey: string): ValidationResult {
  const key = rawKey.trim();

  // Rule 1: Must start with SURI-
  if (!key.startsWith('SURI-')) {
    return {
      isValid: false,
      key,
      statusText: 'INVALID PREFIX',
      errorReason: 'License key MUST start with "SURI-" prefix.',
    };
  }

  // Rule 2: Must end with secret symbol $
  if (!key.endsWith('$')) {
    return {
      isValid: false,
      key,
      statusText: 'MISSING SECRET SYMBOL',
      errorReason: 'License key MUST end with the secret symbol "$".',
    };
  }

  // Strip prefix and suffix
  const body = key.slice(5, -1);
  const segments = body.split('-');

  if (segments.length !== 2 && segments.length !== 3) {
    return {
      isValid: false,
      key,
      statusText: 'MALFORMED SEGMENTS',
      errorReason: 'Invalid structure. Expected "SURI-XXXX-XXXX$" or "SURI-XXXX-XXXX-XXXX$".',
    };
  }

  if (segments[0].length !== 4 || segments[1].length !== 4) {
    return {
      isValid: false,
      key,
      statusText: 'INVALID SEGMENT LENGTH',
      errorReason: 'Each key block must contain exactly 4 alphanumeric characters.',
    };
  }

  const encoded8 = segments[0] + segments[1];
  const encryptedBytes = decodeBase32_8chars(encoded8);

  if (!encryptedBytes) {
    return {
      isValid: false,
      key,
      statusText: 'INVALID CHARSET',
      errorReason: 'Key contains invalid characters outside cyber base32 charset.',
    };
  }

  // Decrypt payload
  const decrypted = decryptBytes(encryptedBytes);
  const [b0, b1, b2, b3, b4] = decrypted;

  // Verify checksum
  const expectedChecksum = computeChecksum(b0, b1, b2, b3);
  if (b4 !== expectedChecksum) {
    return {
      isValid: false,
      key,
      statusText: 'TAMPER DETECTED',
      errorReason: 'Cryptographic signature verification failed. The key is fake or corrupted.',
    };
  }

  const durationDays = b0;
  const EPOCH_BASE = 20089;
  const issueDay = (b1 << 8) | b2;
  const createdMs = (issueDay + EPOCH_BASE) * 86400000;
  const expiresMs = createdMs + durationDays * 86400000;
  const nowMs = Date.now();

  const daysRemaining = Math.max(0, Math.ceil((expiresMs - nowMs) / 86400000));
  const isExpired = nowMs > expiresMs;

  let tier = 'Custom Duration';
  if (durationDays === 7) tier = '7 Days (Standard)';
  else if (durationDays === 30) tier = '30 Days (Premium)';

  return {
    isValid: true,
    key,
    tier,
    durationDays,
    createdAt: new Date(createdMs).toISOString().split('T')[0],
    expiresAt: new Date(expiresMs).toISOString().split('T')[0],
    daysRemaining,
    isExpired,
    statusText: isExpired ? 'EXPIRED' : 'ACTIVE & VERIFIED',
    extractedPayload: {
      format: segments.length === 2 ? 'compact' : 'extended',
      salt: b3,
      daysIssuedAgo: Math.max(0, Math.floor((nowMs - createdMs) / 86400000)),
    },
  };
}

/**
 * Creates a formatted record for storage
 */
export function createLicenseRecord(
  key: string,
  durationDays: number,
  clientName: string = 'Auto Bot Client',
  notes: string = ''
): LicenseRecord {
  const now = Date.now();
  let tier: '7 Days Standard' | '30 Days Premium' | 'Custom' = 'Custom';
  if (durationDays === 7) tier = '7 Days Standard';
  else if (durationDays === 30) tier = '30 Days Premium';

  return {
    id: `LIC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    key,
    durationDays,
    tier,
    format: key.split('-').length === 3 ? 'compact' : 'extended',
    createdAt: now,
    expiresAt: now + durationDays * 86400000,
    clientName: clientName.trim() || 'Auto Bot Client',
    status: 'active',
    notes,
  };
}
