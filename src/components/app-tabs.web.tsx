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

export default function AppTabsWeb() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          {/* 1. Shield Dashboard Trigger */}
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Guard</TabButton>
          </TabTrigger>

          {/* 2. Geolocation Map Trigger */}
          <TabTrigger name="map" href="/map" asChild>
            <TabButton>Live Map</TabButton>
          </TabTrigger>

          {/* 3. Emergency Contacts Trigger */}
          <TabTrigger name="contacts" href="/contacts" asChild>
            <TabButton>Guardians</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? "backgroundSelected" : "backgroundElement"}
        style={styles.tabButtonView}
      >
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

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {/* Re-branded custom title matching SafeRoute pitch */}
        <ThemedText type="smallBold" style={styles.brandText}>
          🛡️ SafeRoute Portal
        </ThemedText>

        {props.children}

        {/* Keeping the boilerplate link but updating context to look like help docs */}
        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Help</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: "questionmark.circle", web: "questionmark.circle" }}
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
    bottom: 0, // Keeps the layout bar snapped securely to view borders
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  brandText: {
    marginRight: "auto",
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
