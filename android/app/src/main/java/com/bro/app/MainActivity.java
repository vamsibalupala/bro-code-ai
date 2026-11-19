package com.bro.app;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.revenuecat.purchases.Purchases;
import com.revenuecat.purchases.PurchasesConfiguration;
import com.google.android.gms.ads.MobileAds;
import com.bro.app.databinding.ActivityMainBinding;

/**
 * Bro - "I DON'T CARE" Native Java Android Application
 * Full Production Architecture: Java + XML Layouts + Material 3
 * Features: E2EE Messaging, Vanish Mode, Teleparty Watch Party, Live 5-Lang Voice Translation, Live GPS Location
 */
public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private NavController navController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // 1. Initialize Google Mobile Ads SDK for Rewarded Video Passes
        MobileAds.initialize(this, initializationStatus -> {
            // AdMob ready
        });

        // 2. Initialize RevenueCat Android SDK for Google Play & UPI AutoPay Subscriptions
        Purchases.configure(new PurchasesConfiguration.Builder(
                this, 
                getString(R.string.revenuecat_api_key)
        ).build());

        // 3. Setup Navigation Component with Material 3 BottomNavigationView
        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager()
                .findFragmentById(R.id.nav_host_fragment);
        if (navHostFragment != null) {
            navController = navHostFragment.getNavController();
            NavigationUI.setupWithNavController(binding.bottomNavigation, navController);
        }
    }
}
