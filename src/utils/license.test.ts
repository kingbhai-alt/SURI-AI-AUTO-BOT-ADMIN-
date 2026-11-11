import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateLicenseKey,
  validateLicenseKey,
  createLicenseRecord,
} from './license';

test('generates 7-Day standard license key matching SURI-XXXX-XXXX$ format', () => {
  const key = generateLicenseKey({ durationDays: 7, format: 'compact' });

  assert.ok(key.startsWith('SURI-'), `Key should start with SURI-, got: ${key}`);
  assert.ok(key.endsWith('$'), `Key should end with secret $, got: ${key}`);

  // Format check: SURI-XXXX-XXXX$ (exactly 15 characters: SURI- (5) + 4 + - + 4 + $ (1) = 15)
  const regex = /^SURI-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}\$$/;
  assert.match(key, regex, `Key must strictly match SURI-XXXX-XXXX$ format: ${key}`);
});

test('generates 30-Day premium license key matching SURI-XXXX-XXXX$ format', () => {
  const key = generateLicenseKey({ durationDays: 30, format: 'compact' });

  assert.ok(key.startsWith('SURI-'));
  assert.ok(key.endsWith('$'));

  const validation = validateLicenseKey(key);
  assert.equal(validation.isValid, true);
  assert.equal(validation.durationDays, 30);
  assert.equal(validation.tier, '30 Days (Premium)');
});

test('validates authentic key with decrypted payload and accurate duration', () => {
  const key7 = generateLicenseKey({ durationDays: 7, format: 'compact' });
  const result7 = validateLicenseKey(key7);

  assert.equal(result7.isValid, true);
  assert.equal(result7.durationDays, 7);
  assert.equal(result7.tier, '7 Days (Standard)');
  assert.equal(result7.isExpired, false);
  assert.ok(result7.daysRemaining! >= 6);

  const key30 = generateLicenseKey({ durationDays: 30, format: 'compact' });
  const result30 = validateLicenseKey(key30);

  assert.equal(result30.isValid, true);
  assert.equal(result30.durationDays, 30);
  assert.equal(result30.tier, '30 Days (Premium)');
});

test('rejects keys without SURI- prefix', () => {
  const invalidKey = 'BOT-A8B9-C3D4$';
  const result = validateLicenseKey(invalidKey);
  assert.equal(result.isValid, false);
  assert.equal(result.statusText, 'INVALID PREFIX');
});

test('rejects keys without secret $ suffix', () => {
  const key = generateLicenseKey({ durationDays: 7, format: 'compact' });
  const missingDollar = key.slice(0, -1); // strip $
  const result = validateLicenseKey(missingDollar);
  assert.equal(result.isValid, false);
  assert.equal(result.statusText, 'MISSING SECRET SYMBOL');
});

test('detects tampered characters or corrupted checksum', () => {
  const key = generateLicenseKey({ durationDays: 7, format: 'compact' });
  // Tamper with a middle character
  const parts = key.split('-');
  const corruptedPart = parts[1][0] === 'A' ? 'B' + parts[1].slice(1) : 'A' + parts[1].slice(1);
  const tamperedKey = `SURI-${corruptedPart}-${parts[2]}`;

  const result = validateLicenseKey(tamperedKey);
  assert.equal(result.isValid, false);
  assert.equal(result.statusText, 'TAMPER DETECTED');
});

test('creates license record properly for persistence', () => {
  const key = generateLicenseKey({ durationDays: 7, format: 'compact' });
  const record = createLicenseRecord(key, 7, 'TraderBot-Alpha', 'VIP Telegram User');

  assert.equal(record.key, key);
  assert.equal(record.durationDays, 7);
  assert.equal(record.tier, '7 Days Standard');
  assert.equal(record.clientName, 'TraderBot-Alpha');
  assert.equal(record.status, 'active');
  assert.ok(record.expiresAt > record.createdAt);
});
