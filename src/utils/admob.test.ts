import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateAdImpressionQuota,
  grantAdReward,
  MAX_DAILY_REWARDED_ADS,
  AD_WINDOW_MS,
  AdImpressionRecord,
} from './admob';

test('fresh user starts with full 5 rewarded ad impressions', () => {
  const result = evaluateAdImpressionQuota([]);
  assert.equal(result.canWatchAd, true);
  assert.equal(result.remainingImpressions, MAX_DAILY_REWARDED_ADS);
  assert.equal(result.recentCount, 0);
});

test('enforces daily limit of 5 rewarded ads within 24 hours', () => {
  const now = 10000000;
  const history: AdImpressionRecord[] = [
    { id: '1', adUnitId: 'ca-app-pub-test/1', rewardType: 'translation_time', timestamp: now - 3600000 },
    { id: '2', adUnitId: 'ca-app-pub-test/1', rewardType: 'translation_time', timestamp: now - 3000000 },
    { id: '3', adUnitId: 'ca-app-pub-test/1', rewardType: 'hd_watch_pass', timestamp: now - 2000000 },
    { id: '4', adUnitId: 'ca-app-pub-test/1', rewardType: 'translation_time', timestamp: now - 1000000 },
    { id: '5', adUnitId: 'ca-app-pub-test/1', rewardType: 'hd_watch_pass', timestamp: now - 500000 },
  ];

  const quota = evaluateAdImpressionQuota(history, now);
  assert.equal(quota.canWatchAd, false);
  assert.equal(quota.remainingImpressions, 0);
  assert.equal(quota.recentCount, 5);

  // After 24 hours from oldest ad, allowance recovers
  const laterTime = now + AD_WINDOW_MS - 3500000;
  const recovered = evaluateAdImpressionQuota(history, laterTime);
  assert.equal(recovered.canWatchAd, true);
  assert.equal(recovered.remainingImpressions, 1);
});

test('grantAdReward awards translation time or HD watch pass accurately', () => {
  const transReward = grantAdReward('translation_time', 300, 0);
  assert.equal(transReward.newBonusSeconds, 1200);
  assert.equal(transReward.newWatchPasses, 0);

  const watchReward = grantAdReward('hd_watch_pass', 1200, 1);
  assert.equal(watchReward.newBonusSeconds, 1200);
  assert.equal(watchReward.newWatchPasses, 2);
});
