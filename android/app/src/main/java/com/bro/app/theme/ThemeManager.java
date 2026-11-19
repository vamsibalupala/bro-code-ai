package com.bro.app.theme;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.appcompat.app.AppCompatDelegate;

/**
 * Bro Application Theme & Palette Manager
 * Controls user-toggleable Dark Mode themes:
 * - OBSIDIAN (Default): #151515 surfaces, #292929 elevated cards, #A9003D burgundy gradient
 * - CHARCOAL_OLED: #080808 base, #151515 cards, ruby accents
 * - MIDNIGHT_VELVET: #0D0B0F base, #18141D cards, deep wine burgundy
 */
public class ThemeManager {
    private static final String PREFS_NAME = "bro_theme_preferences";
    private static final String KEY_THEME_MODE = "selected_theme_mode";
    private static final String KEY_DARK_MODE_ENABLED = "dark_mode_enabled";

    public enum ThemeVariant {
        OBSIDIAN_STREAM,
        CHARCOAL_OLED,
        MIDNIGHT_VELVET
    }

    private final SharedPreferences preferences;

    public ThemeManager(Context context) {
        this.preferences = context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public void setDarkModeEnabled(boolean enabled) {
        preferences.edit().putBoolean(KEY_DARK_MODE_ENABLED, enabled).apply();
        if (enabled) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
        }
    }

    public boolean isDarkModeEnabled() {
        return preferences.getBoolean(KEY_DARK_MODE_ENABLED, true);
    }

    public void setThemeVariant(ThemeVariant variant) {
        preferences.edit().putString(KEY_THEME_MODE, variant.name()).apply();
    }

    public ThemeVariant getThemeVariant() {
        String name = preferences.getString(KEY_THEME_MODE, ThemeVariant.OBSIDIAN_STREAM.name());
        try {
            return ThemeVariant.valueOf(name);
        } catch (IllegalArgumentException e) {
            return ThemeVariant.OBSIDIAN_STREAM;
        }
    }

    public static void applyInitialTheme(Context context) {
        ThemeManager manager = new ThemeManager(context);
        if (manager.isDarkModeEnabled()) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
        }
    }
}
