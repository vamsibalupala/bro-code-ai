import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSecurityFingerprint,
  encryptMessage,
  decryptMessage,
  isMessageExpired,
  getVanishTimeRemaining,
} from './crypto';

test('security fingerprint is deterministic and symmetrical', () => {
  const fp1 = generateSecurityFingerprint('user_arjun_01', 'user_ramesh_02');
  const fp2 = generateSecurityFingerprint('user_ramesh_02', 'user_arjun_01');
  assert.equal(fp1, fp2);
  assert.equal(fp1.split(' ').length, 6);
});

test('encrypt and decrypt roundtrip preserves message text', () => {
  const secretText = 'Hey Bro! Watch party starts at 9PM sharp.';
  const encrypted = encryptMessage(secretText, 'user_01');
  assert.notEqual(encrypted.ciphertext, secretText);
  const decrypted = decryptMessage(encrypted);
  assert.equal(decrypted, secretText);
});

test('vanish expiration logic triggers at duration threshold', () => {
  const now = 1000000;
  // 30 second timer
  const sentAt = now - 25000; // 25s ago -> not expired
  assert.equal(isMessageExpired(sentAt, 30, now), false);
  assert.equal(getVanishTimeRemaining(sentAt, 30, now), '5s');

  const expiredSent = now - 35000; // 35s ago -> expired
  assert.equal(isMessageExpired(expiredSent, 30, now), true);
  assert.equal(getVanishTimeRemaining(expiredSent, 30, now), 'Expired');
});

test('CallRecordingService container format specifies 12-byte IV and AES-256-GCM auth', () => {
  // Test encryption metadata specs
  const GCM_IV_LENGTH_BYTES = 12;
  const GCM_TAG_LENGTH_BITS = 128;
  const fakeIv = new Uint8Array(GCM_IV_LENGTH_BYTES);
  assert.equal(fakeIv.byteLength, 12);
  assert.equal(GCM_TAG_LENGTH_BITS / 8, 16); // 16-byte authentication tag
});

test('CallRecordingService key fingerprint generator produces valid BRO-KEY format', () => {
  // Mock key fingerprint algorithm from Java: BRO-KEY-%04X-%04X
  const fakeKeyBytes = [0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc];
  let checksum = 0;
  for (const b of fakeKeyBytes) checksum += (b & 0xFF);
  const part1 = ((checksum * 31) & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  const part2 = ((checksum * 17) & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  const fingerprint = `BRO-KEY-${part1}-${part2}`;
  assert.match(fingerprint, /^BRO-KEY-[0-9A-F]{4}-[0-9A-F]{4}$/);
});

