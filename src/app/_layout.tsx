// Getting firebase initialized right at the start
import "@/services/firebaseConfig";
// Bringing in our local database setup script
import { initDatabase } from "@/services/sqliteService";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";

// Custom splash screen animation and our main tab buttons
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

export default function TabLayout() {
  // Kick off the local SQLite database as soon as the app loads up
  useEffect(() => {
    (async () => {
      await initDatabase();
    })();
  }, []);

  // Grab the device's system theme (light or dark mode)
  const colorScheme = useColorScheme();

  return (
    // Wrap the app in the correct theme so colors don't look weird
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Show the cool intro splash animation */}
      <AnimatedSplashOverlay />

      {/* Render the actual bottom tab bars and screens */}
      <AppTabs />
    </ThemeProvider>
  );
}

// Quick custom wrapper for useEffect just to keep things matching in this file
function useEffect(effect: React.EffectCallback, deps: React.DependencyList) {
  React.useEffect(effect, deps);
}
