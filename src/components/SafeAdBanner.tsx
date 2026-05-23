import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

// Try to safely check if we are running in a native production build environment.
// If we are just running inside the Expo Go sandbox player, we will fall back
// to our clean mock banner layout to prevent native SDK loader crashes.
let BannerAd: any = null;
let TestIds: any = null;

try {
  // This will naturally fail inside Expo Go, which is exactly what we want to catch
  const AdsModule = require("react-native-google-mobile-ads");
  BannerAd = AdsModule.BannerAd;
  TestIds = AdsModule.TestIds;
} catch (e) {
  // Native binaries missing (Expo Go mode) - fallback flag handled below
  BannerAd = null;
}

export default function SafeAdBanner() {
  // If on the web or inside the Expo Go sandbox player app
  const isExpoGo = BannerAd === null || Platform.OS === "web";

  if (isExpoGo) {
    // Google Test Ad placeholder
    return (
      <View style={styles.sandboxAdContainer}>
        <View style={styles.googleBadge}>
          <Text style={styles.googleBadgeText}>AdMob Test</Text>
        </View>
        <Text style={styles.sandboxAdText}>Google Banner Placeholder</Text>
      </View>
    );
  }

  // If running on a compiled development build, render the real Google Test Banner unit
  const BannerAdComponent = BannerAd;
  return (
    <View style={styles.nativeAdWrapper}>
      <BannerAdComponent
        unitId={TestIds.BANNER} // Safe Google Sandbox Test ID
        size={"BANNER"}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sandboxAdContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#2C2C2C",
    borderWidth: 1,
    borderColor: "#444444",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginVertical: 8,
  },
  googleBadge: {
    position: "absolute",
    top: 2,
    left: 4,
    backgroundColor: "#F4B400",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  googleBadgeText: {
    color: "#000000",
    fontSize: 8,
    fontWeight: "bold",
  },
  sandboxAdText: {
    color: "#A0A0A0",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  sandboxAdSubtext: {
    color: "#666666",
    fontSize: 9,
    marginTop: 1,
  },
  nativeAdWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
});
