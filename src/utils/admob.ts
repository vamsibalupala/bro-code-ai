/**
 * Google AdMob Rewarded Ads Manager & Freemium Quota Enforcement
 * Rules:
 * - Free tier users can watch rewarded video ads to unlock:
 *   1. 15 additional minutes of live voice translation (900 seconds)
 *   2. Single-session HD (1080p) Watch Party pass
 * - Maximum 5 rewarded ad impressions per 24-hour sliding window
 * - Tracks impressions with timestamp, ad unit ID, and rewarded entitlement
 */

export type AdRewardChoice = 'translation_time' | 'hd_watch_pass';

export interface AdImpressionRecord {
  id: string;
  adUnitId: string;
  rewardType: AdRewardChoice;
  timestamp: number;
}

export const MAX_DAILY_REWARDED_ADS = 5;
export const AD_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Checks whether user can watch another rewarded ad and calculates remaining allowance
 */
export function evaluateAdImpressionQuota(
  history: AdImpressionRecord[],
  currentTime: number = Date.now()
): {
  canWatchAd: boolean;
  remainingImpressions: number;
  recentCount: number;
  nextResetTimestamp: number | null;
} {
  const windowStart = currentTime - AD_WINDOW_MS;
  const recentImpressions = history.filter((rec) => rec.timestamp >= windowStart);

  const recentCount = recentImpressions.length;
  const remaining = Math.max(0, MAX_DAILY_REWARDED_ADS - recentCount);
  const canWatch = remaining > 0;

  let nextResetTimestamp: number | null = null;
  if (recentImpressions.length > 0) {
    const oldestInWindow = Math.min(...recentImpressions.map((r) => r.timestamp));
    nextResetTimestamp = oldestInWindow + AD_WINDOW_MS;
  }

  return {
    canWatchAd: canWatch,
    remainingImpressions: remaining,
    recentCount,
    nextResetTimestamp,
  };
}

/**
 * Applies the selected reward to user's quotas
 */
export function grantAdReward(
  choice: AdRewardChoice,
  currentBonusSeconds: number,
  currentWatchPasses: number
): {
  newBonusSeconds: number;
  newWatchPasses: number;
  rewardTitle: string;
} {
  if (choice === 'translation_time') {
    return {
      newBonusSeconds: currentBonusSeconds + 900, // +15 mins
      newWatchPasses: currentWatchPasses,
      rewardTitle: '+15 Extra Minutes Live Translation Unlocked',
    };
  } else {
    return {
      newBonusSeconds: currentBonusSeconds,
      newWatchPasses: currentWatchPasses + 1,
      rewardTitle: '1-Session HD Watch Party Pass Unlocked',
    };
  }
}
