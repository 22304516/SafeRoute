// Getting firebase initialized right at the start
import "@/services/firebaseConfig";
// Bringing in  local database setup script
import { initDatabase, saveLocalWaypoint } from "@/services/sqliteService";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import React from "react";
import { useColorScheme } from "react-native";

// Custom splash screen animation and  main tab buttons
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

// Define a distinct key identifier for  background task
export const BACKGROUND_TRACKING_KEY = "saferoute-geo-worker";

// Register the background runner in the absolute global scope
TaskManager.defineTask(BACKGROUND_TRACKING_KEY, async ({ data, error }) => {
  if (error) {
    console.error("Background tracker service error:", error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const latestLocation = locations[0];
      const { latitude, longitude } = latestLocation.coords;

      // Directly stream the background GPS coordinates straight into  SQLite cache for offline persistence, and eventual syncing to Firestore when the user gets back online
      await saveLocalWaypoint(latitude, longitude);
    }
  }
});

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
