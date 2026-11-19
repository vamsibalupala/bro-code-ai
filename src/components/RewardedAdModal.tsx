import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, Film, Radio, Sparkles, Tv } from 'lucide-react';
import { AdRewardChoice } from '../utils/admob';

interface RewardedAdModalProps {
  onClose: () => void;
  onRewardEarned: (choice: AdRewardChoice) => void;
  remainingImpressions: number;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  onClose,
  onRewardEarned,
  remainingImpressions,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [rewardClaimable, setRewardClaimable] = useState(false);
  const [selectedReward, setSelectedReward] = useState<AdRewardChoice>('translation_time');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setRewardClaimable(true);
    }
  }, [countdown]);

  const handleClaim = () => {
    onRewardEarned(selectedReward);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
      <div className="relative w-full max-w-sm bg-[#181818] border border-[#333] rounded-3xl overflow-hidden shadow-2xl p-5 text-center space-y-4">
        {/* Top AdMob banner */}
        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono border-b border-[#2a2a2a] pb-2">
          <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded font-bold">
            Google AdMob Rewarded Video
          </span>
          {rewardClaimable ? (
            <button onClick={onClose} className="hover:text-white">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span>Reward in {countdown}s</span>
          )}
        </div>

        {/* Video Creative Mockup */}
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80"
            alt="Ad creative"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center p-3 text-center">
            <Sparkles className="w-8 h-8 text-amber-400 mb-1 animate-spin" />
            <h4 className="text-white font-extrabold text-sm">Airtel 5G Plus Ultra-Low Latency</h4>
            <p className="text-[10px] text-neutral-300 mt-1">
              Stream movies in 4K & make crystal clear WebRTC calls on Bro.
            </p>
          </div>
        </div>

        {/* Reward Choice Picker */}
        <div className="text-left space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Select Your Freemium Reward:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedReward('translation_time')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedReward === 'translation_time'
                  ? 'bg-amber-500/20 border-amber-500 text-white shadow'
                  : 'bg-[#222] border-[#333] text-neutral-400 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4 text-amber-400 mb-1" />
              <p className="text-xs font-bold">+15 Mins</p>
              <p className="text-[10px] opacity-70">Voice Translation</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedReward('hd_watch_pass')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedReward === 'hd_watch_pass'
                  ? 'bg-rose-500/20 border-rose-500 text-white shadow'
                  : 'bg-[#222] border-[#333] text-neutral-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-rose-400 mb-1" />
              <p className="text-xs font-bold">1 HD Pass</p>
              <p className="text-[10px] opacity-70">Watch Party Stream</p>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">
            {rewardClaimable ? '🎉 Video Completed! Ready to Claim' : 'Watching Sponsored Video'}
          </h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            {remainingImpressions} rewarded ad impressions remaining today.
          </p>
        </div>

        <button
          onClick={handleClaim}
          disabled={!rewardClaimable}
          className={`w-full py-3 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg ${
            rewardClaimable
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:scale-102 active:scale-98'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{rewardClaimable ? 'Claim Selected Reward' : `Claim Reward in ${countdown}s`}</span>
        </button>
      </div>
    </div>
  );
};
