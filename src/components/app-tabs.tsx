import { Colors } from "@/constants/theme";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
import { useColorScheme } from "react-native";

export default function AppTabs() {
  // Checking if the phone is on dark mode or light mode
  const scheme = useColorScheme();
  // Fallback to light mode if the system scheme is acting weird or unspecified
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      {/* Tab 1: The main dashboard screen */}
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/* Tab 2: The live tracking map page */}
      <NativeTabs.Trigger name="map">
        <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require("@/assets/images/tabIcons/explore.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/* Tab 3: Emergency contact manager screen */}
      <NativeTabs.Trigger name="contacts">
        <NativeTabs.Trigger.Label>Guardians</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          // Just using the home icon as a placeholder for now until a proper icon is added
          src={require("@/assets/images/tabIcons/home.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      {/* Tab 4: Hardware sensor fall-detection page */}
      <NativeTabs.Trigger name="sensors">
        <NativeTabs.Trigger.Label>sensors</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          // Re-using the explore icon as a temporary placeholder for the sensor view
          src={require("@/assets/images/tutorial-web.png")}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
