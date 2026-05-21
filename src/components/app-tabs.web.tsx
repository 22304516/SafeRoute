import {
    TabList,
    TabListProps,
    Tabs,
    TabSlot,
    TabTrigger,
    TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

import { ExternalLink } from "./external-link";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";

// Main layout wrapper for the web version of our tabs
export default function AppTabsWeb() {
  return (
    <Tabs>
      {/* Keeps the content container taking up the full height */}
      <TabSlot style={{ height: "100%" }} />

      <TabList asChild>
        <CustomTabList>
          {/* Main dashboard tab for turning the tracker on/off */}
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Guard</TabButton>
          </TabTrigger>

          {/* Map tab for checking live GPS location later */}
          <TabTrigger name="map" href="/map" asChild>
            <TabButton>Live Map</TabButton>
          </TabTrigger>

          {/* Contacts tab to manage emergency numbers/guardians */}
          <TabTrigger name="contacts" href="/contacts" asChild>
            <TabButton>Guardians</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

// Reusable custom button style for individual tabs
export function TabButton({
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps) {
  return (
    // Added a slight opacity change here so the user gets visual feedback when clicking
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      {/* Changes the background color depending on if the tab is selected or not */}
      <ThemedView
        type={isFocused ? "backgroundSelected" : "backgroundElement"}
        style={styles.tabButtonView}
      >
        {/* Dim the text color slightly if the tab isn't active */}
        <ThemedText
          type="small"
          themeColor={isFocused ? "text" : "textSecondary"}
        >
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

// Custom bar container that holds all our tabs together
export function CustomTabList(props: TabListProps) {
  // Grab system light/dark theme so colors don't look weird
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {/* Customized header text to match the project name */}
        <ThemedText type="smallBold" style={styles.brandText}>
          🛡️ SafeRoute Portal
        </ThemedText>

        {/* This injects the actual tab triggers we defined up in AppTabsWeb */}
        {props.children}

        {/* External link placeholder repurposed as a help button */}
        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Help</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name="questionmark.circle"
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: "absolute",
    width: "100%",
    padding: Spacing.three,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    bottom: 0, // Pins the tab bar down to the bottom of the screen
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five, // Round edges for a cleaner UI look
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    borderWidth: 1,
    borderColor: "#2C2C2C", // Dark border lines matching our theme layout
  },
  brandText: {
    marginRight: "auto", // Forces the logo text to stay on the left side
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});
