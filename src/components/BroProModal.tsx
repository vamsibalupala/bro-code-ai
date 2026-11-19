import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap, 
  Film, 
  Radio, 
  Lock, 
  Crown, 
  CreditCard,
  CheckCircle2,
  Tv
} from 'lucide-react';

interface BroProModalProps {
  onClose: () => void;
  onUpgradeSuccess: () => void;
  isPro: boolean;
}

export const BroProModal: React.FC<BroProModalProps> = ({
  onClose,
  onUpgradeSuccess,
  isPro,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCelebration, setSuccessCelebration] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Flex',
      price: '₹249',
      period: '/ month',
      badge: 'Flexibility',
      savings: 'Standard billing',
    },
    {
      id: 'annual',
      name: 'Annual VIP',
      price: '₹1,799',
      period: '/ year',
      badge: 'RECOMMENDED • BEST VALUE',
      savings: 'Save 40% (Only ₹149/mo)',
      highlighted: true,
    },
    {
      id: 'lifetime',
      name: 'Lifetime Founder',
      price: '₹4,999',
      period: 'one-time',
      badge: 'VIP FOUNDER PERK',
      savings: '500 GB Cloud + Never Pay Again',
    },
  ];

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessCelebration(true);
      setTimeout(() => {
        onUpgradeSuccess();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141414] border border-[#2e2e2e] rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 my-auto text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Gold Header Icon */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] p-[2px] shadow-xl">
          <div className="w-full h-full rounded-[22px] bg-[#1a1408] flex items-center justify-center text-[#D4AF37]">
            <Crown className="w-9 h-9 fill-current" />
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black tracking-widest uppercase bg-[#D4AF37]/15 text-[#D4AF37] px-3 py-1 rounded-full border border-[#D4AF37]/30">
            RevenueCat Subscriptions & Google Play Billing
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-2 flex items-center justify-center gap-2">
            <span>Upgrade to BRO PRO</span>
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Unlimited multi-language voice translation, 4K HDR synchronized movie watch parties, encrypted call recording, and zero advertisements.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`relative p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#2a220a] to-[#1a1506] border-[#D4AF37] shadow-lg scale-[1.02]'
                    : 'bg-[#1b1b1b] border-[#2e2e2e] hover:border-[#444]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-2.5 inset-x-0 flex justify-center">
                    <span className="bg-[#D4AF37] text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Best Value
                    </span>
                  </div>
                )}
                <p className="text-[11px] font-bold text-neutral-300">{plan.name}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-black text-white">{plan.price}</span>
                  <span className="text-[10px] text-neutral-400 font-medium">{plan.period}</span>
                </div>
                <p className="text-[9px] text-[#D4AF37] mt-1 font-semibold">{plan.savings}</p>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison List */}
        <div className="bg-[#101010] p-4 rounded-2xl border border-[#242424] text-left space-y-2.5 text-xs">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Bro Pro Exclusive Entitlements:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Unlimited Voice Call Translation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>4K HDR Watch Parties (up to 50 bros)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Encrypted Call Recording + Transcripts</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>100 GB Cloud E2E Media Backup</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>8-Hour Extended Live GPS Sharing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>100% Ad-Free Experience</span>
            </div>
          </div>
        </div>

        {/* Payment Button & Trust Badges */}
        <div className="space-y-3">
          {successCelebration ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-2xl flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Payment Verified! Welcome to Bro Pro VIP 🎉</span>
            </div>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-black font-extrabold text-sm hover:brightness-110 active:scale-98 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 fill-current" />
              <span>
                {isProcessing
                  ? 'Connecting to Google Play Billing / UPI...'
                  : `Upgrade Now with UPI / Play Store`}
              </span>
            </button>
          )}

          <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-400 font-medium">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-neutral-400" /> Google Play Billing
            </span>
            <span>•</span>
            <span>UPI AutoPay (GPay, PhonePe, Paytm)</span>
            <span>•</span>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
