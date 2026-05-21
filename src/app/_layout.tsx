import { initDatabase } from "@/services/sqliteService";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import React from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

export default function TabLayout() {
  useEffect(() => {
    (async () => {
      await initDatabase();
    })();
  }, []);

  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
function useEffect(effect: React.EffectCallback, deps: React.DependencyList) {
  // Delegate to React's useEffect to match expected behavior in this file
  React.useEffect(effect, deps);
}
