package com.bro.app.billing;

import android.app.Activity;
import androidx.annotation.NonNull;
import com.revenuecat.purchases.CustomerInfo;
import com.revenuecat.purchases.Package;
import com.revenuecat.purchases.Purchases;
import com.revenuecat.purchases.PurchasesError;
import com.revenuecat.purchases.interfaces.PurchaseCallback;
import com.revenuecat.purchases.interfaces.ReceiveCustomerInfoCallback;

/**
 * Handles RevenueCat Subscriptions with Google Play Billing & UPI AutoPay.
 * Localized pricing tiers:
 * - Monthly Flex: ₹249
 * - Annual VIP: ₹1,799 (Recommended)
 * - Lifetime Founder: ₹4,999
 */
public class RevenueCatBillingManager {

    public static final String ENTITLEMENT_PRO = "bro_pro";

    public interface EntitlementCheckListener {
        void onResult(boolean isPro);
    }

    public static void checkProEntitlement(EntitlementCheckListener listener) {
        Purchases.getSharedInstance().getCustomerInfo(new ReceiveCustomerInfoCallback() {
            @Override
            public void onReceived(@NonNull CustomerInfo customerInfo) {
                boolean hasPro = customerInfo.getEntitlements().get(ENTITLEMENT_PRO) != null 
                        && customerInfo.getEntitlements().get(ENTITLEMENT_PRO).isActive();
                listener.onResult(hasPro);
            }

            @Override
            public void onError(@NonNull PurchasesError error) {
                listener.onResult(false);
            }
        });
    }

    public static void purchaseProPlan(Activity activity, Package aPackage, PurchaseCallback callback) {
        Purchases.getSharedInstance().purchasePackage(activity, aPackage, callback);
    }
}
