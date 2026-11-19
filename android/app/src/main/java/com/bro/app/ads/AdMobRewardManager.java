package com.bro.app.ads;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.rewarded.RewardItem;

/**
 * Google AdMob Rewarded Video Manager for Bro Freemium Model
 * - Allows free users to watch rewarded ads to earn:
 *   1. 15 additional minutes of live voice translation (Telugu, Tamil, Kannada, English, Hindi)
 *   2. Single-session HD Watch Party pass (1080p Teleparty stream)
 * - Enforces sliding 24-hour limit of maximum 5 rewarded ad impressions
 */
public class AdMobRewardManager {
    private static final String PREFS_NAME = "bro_admob_rewards";
    private static final String KEY_IMPRESSIONS_COUNT = "daily_impressions_count";
    private static final String KEY_LAST_RESET_TIME = "last_reset_timestamp_ms";
    private static final String KEY_BONUS_TRANSLATION_SEC = "bonus_translation_seconds";
    private static final String KEY_HD_WATCH_PASSES = "hd_watch_party_passes";

    public static final int MAX_DAILY_ADS = 5;
    private static final long WINDOW_24H_MS = 24 * 60 * 60 * 1000L;
    
    // Test AdMob Rewarded Ad Unit ID
    public static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";

    public enum RewardChoice {
        TRANSLATION_TIME_15M,
        HD_WATCH_PASS_SINGLE
    }

    public interface RewardCallback {
        void onRewardGranted(RewardChoice choice, String message);
        void onAdFailedToLoad(String error);
        void onAdDismissedWithoutReward();
    }

    private final Context context;
    private final SharedPreferences prefs;
    private RewardedAd rewardedAd;
    private boolean isLoading = false;

    public AdMobRewardManager(Context context) {
        this.context = context.getApplicationContext();
        this.prefs = this.context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        resetDailyCounterIfExpired();
    }

    private void resetDailyCounterIfExpired() {
        long lastReset = prefs.getLong(KEY_LAST_RESET_TIME, 0L);
        long now = System.currentTimeMillis();
        if (now - lastReset > WINDOW_24H_MS) {
            prefs.edit()
                .putInt(KEY_IMPRESSIONS_COUNT, 0)
                .putLong(KEY_LAST_RESET_TIME, now)
                .apply();
        }
    }

    public int getRemainingDailyImpressions() {
        resetDailyCounterIfExpired();
        int used = prefs.getInt(KEY_IMPRESSIONS_COUNT, 0);
        return Math.max(0, MAX_DAILY_ADS - used);
    }

    public boolean canWatchRewardedAd() {
        return getRemainingDailyImpressions() > 0;
    }

    public int getBonusTranslationSeconds() {
        return prefs.getInt(KEY_BONUS_TRANSLATION_SEC, 0);
    }

    public int getHdWatchPasses() {
        return prefs.getInt(KEY_HD_WATCH_PASSES, 0);
    }

    public void loadRewardedAd(final Context activityContext) {
        if (rewardedAd != null || isLoading) return;
        isLoading = true;

        AdRequest adRequest = new AdRequest.Builder().build();
        RewardedAd.load(activityContext, AD_UNIT_ID, adRequest, new RewardedAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull RewardedAd ad) {
                rewardedAd = ad;
                isLoading = false;
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                rewardedAd = null;
                isLoading = false;
            }
        });
    }

    public void showRewardedAd(Activity activity, final RewardChoice choice, final RewardCallback callback) {
        if (!canWatchRewardedAd()) {
            if (callback != null) {
                callback.onAdFailedToLoad("Daily limit of 5 rewarded ads reached. Upgrade to Bro Pro for unlimited access.");
            }
            return;
        }

        if (rewardedAd == null) {
            // Load and retry or notify
            loadRewardedAd(activity);
            if (callback != null) {
                callback.onAdFailedToLoad("Ad is loading, please try again in a few moments.");
            }
            return;
        }

        rewardedAd.show(activity, new OnUserEarnedRewardListener() {
            @Override
            public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                int used = prefs.getInt(KEY_IMPRESSIONS_COUNT, 0) + 1;
                SharedPreferences.Editor editor = prefs.edit().putInt(KEY_IMPRESSIONS_COUNT, used);

                String msg;
                if (choice == RewardChoice.TRANSLATION_TIME_15M) {
                    int currentSec = prefs.getInt(KEY_BONUS_TRANSLATION_SEC, 0) + 900;
                    editor.putInt(KEY_BONUS_TRANSLATION_SEC, currentSec);
                    msg = "+15 Minutes Live Voice Translation added!";
                } else {
                    int passes = prefs.getInt(KEY_HD_WATCH_PASSES, 0) + 1;
                    editor.putInt(KEY_HD_WATCH_PASSES, passes);
                    msg = "1 HD Watch Party Pass added!";
                }
                editor.apply();

                rewardedAd = null;
                // Preload next
                loadRewardedAd(context);

                if (callback != null) {
                    callback.onRewardGranted(choice, msg);
                }
            }
        });
    }
}
