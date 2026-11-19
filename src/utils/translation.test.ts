import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTranslationQuota,
  formatSecondsToTime,
  translateSample,
  SUPPORTED_LANGUAGES,
} from './translation';

test('supported languages include all 5 required languages', () => {
  const codes = Object.keys(SUPPORTED_LANGUAGES);
  assert.deepEqual(codes.sort(), ['en', 'hi', 'kn', 'ta', 'te'].sort());
  assert.equal(SUPPORTED_LANGUAGES.te.nativeName, 'తెలుగు');
  assert.equal(SUPPORTED_LANGUAGES.ta.nativeName, 'தமிழ்');
  assert.equal(SUPPORTED_LANGUAGES.kn.nativeName, 'ಕನ್ನಡ');
  assert.equal(SUPPORTED_LANGUAGES.hi.nativeName, 'हिन्दी');
  assert.equal(SUPPORTED_LANGUAGES.en.tagline, "I DON'T CARE");
});

test('calculateTranslationQuota gives 15m for free tier, plus bonus from ads', () => {
  // Free tier starts with 900s (15 min)
  const initial = calculateTranslationQuota(0, 0, false);
  assert.equal(initial.totalAllowedSeconds, 900);
  assert.equal(initial.remainingSeconds, 900);
  assert.equal(initial.canTranslate, true);

  // 10 minutes used
  const partial = calculateTranslationQuota(600, 0, false);
  assert.equal(partial.remainingSeconds, 300);
  assert.equal(partial.percentUsed, 67);

  // Expired
  const expired = calculateTranslationQuota(900, 0, false);
  assert.equal(expired.remainingSeconds, 0);
  assert.equal(expired.canTranslate, false);

  // Rewarded Ad adds 900s bonus
  const rewarded = calculateTranslationQuota(900, 900, false);
  assert.equal(rewarded.totalAllowedSeconds, 1800);
  assert.equal(rewarded.remainingSeconds, 900);
  assert.equal(rewarded.canTranslate, true);

  // Pro users get unlimited
  const pro = calculateTranslationQuota(5000, 0, true);
  assert.equal(pro.canTranslate, true);
});

test('formatSecondsToTime outputs MM:SS accurately', () => {
  assert.equal(formatSecondsToTime(900), '15:00');
  assert.equal(formatSecondsToTime(65), '01:05');
  assert.equal(formatSecondsToTime(0), '00:00');
});

test('translateSample returns accurate localized strings', () => {
  assert.equal(translateSample('dont_care', 'te'), 'నాకేం పట్టదు');
  assert.equal(translateSample('dont_care', 'ta'), 'எனக்கு கவலை இல்லை');
  assert.equal(translateSample('dont_care', 'kn'), 'ನನಗೇನು ಚಿಂತೆ ಇಲ್ಲ');
  assert.equal(translateSample('dont_care', 'hi'), 'मुझे कोई फर्क नहीं पड़ता');
});
