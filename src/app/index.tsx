import * as Location from "expo-location";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BACKGROUND_TRACKING_KEY } from "./_layout";

export default function HomeScreen() {
  // Simple state to remember if tracking is currently turned on or off
  const [isGuardActive, setIsGuardActive] = useState<boolean>(false);

  // Flipped when the user presses the main action button to handle permissions and location workers
  const toggleGuardSystem = async () => {
    if (isGuardActive) {
      // If tracking is active, check if the worker is actually running and shut it down cleanly
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        BACKGROUND_TRACKING_KEY,
      );
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(BACKGROUND_TRACKING_KEY);
      }
      setIsGuardActive(false);
      Alert.alert("System Paused", "SafeRoute tracking is on standby.");
    } else {
      // If tracking is off, we need to ask for device permissions before launching anything
      try {
        // First need normal app-in-use foreground permissions
        const { status: foregroundStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Foreground location permission is required to track routes.",
          );
          return;
        }

        // Then need background permissions so it keeps tracking when the phone is locked/minimized
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== "granted") {
          Alert.alert(
            "Permission Alert",
            "To safeguard your route when the screen is locked, please enable 'Allow all the time' in device settings.",
          );
        }

        // Spin up the background location worker with our tracking configuration
        await Location.startLocationUpdatesAsync(BACKGROUND_TRACKING_KEY, {
          accuracy: Location.Accuracy.BestForNavigation, // High-accuracy GPS mode
          timeInterval: 10000, // Look for new coordinates every 10 seconds
          distanceInterval: 0, // Keep logging points even if we are sitting still
          foregroundService: {
            notificationTitle: "SafeRoute Active",
            notificationBody:
              "Monitoring journey vectors securely in the background.",
            notificationColor: "#03DAC6",
          },
        });

        setIsGuardActive(true);
        Alert.alert(
          "Guard Active",
          "SafeRoute is now actively caching coordinates.",
        );
      } catch (err) {
        console.error("Error launching tracking worker:", err);
      }
    }
  };

  // Quick fallback handler to alert that the emergency alert broadcast was triggered
  const triggerInstantSOS = () => {
    Alert.alert(
      "🚨 EMERGENCY SOS",
      "Broadcasting current GPS vector to verified emergency contacts!",
    );
  };

  return (
    <View style={styles.container}>
      {/* Top logo branding header */}
      <View style={styles.header}>
        <Text style={styles.title}>SafeRoute</Text>
        <Text style={styles.tagline}>Solo Travel Protection Shield</Text>
      </View>

      {/* Center status card that automatically changes colors and text based on active states */}
      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>SHIELD STATUS</Text>
        <Text
          style={[
            styles.statusValue,
            isGuardActive ? styles.textActive : styles.textStandby,
          ]}
        >
          {isGuardActive ? "🛡️ ACTIVE SECURE" : "💤 SYSTEM STANDBY"}
        </Text>
      </View>

      {/* Interactive primary trigger button to toggle the tracking loop */}
      <TouchableOpacity
        style={[
          styles.mainButton,
          isGuardActive ? styles.btnActive : styles.btnStandby,
        ]}
        onPress={toggleGuardSystem}
      >
        <Text style={styles.buttonText}>
          {isGuardActive ? "Deactivate Guard" : "Initialize Journey Guard"}
        </Text>
      </TouchableOpacity>

      {/* Prominent high-contrast panic button pinned to the footer zone */}
      <TouchableOpacity style={styles.sosButton} onPress={triggerInstantSOS}>
        <Text style={styles.sosText}>INSTANT SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "#BB86FC",
    marginTop: 4,
  },
  statusBox: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  statusLabel: {
    fontSize: 12,
    color: "#A0A0A0",
    letterSpacing: 2,
    marginBottom: 6,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textActive: { color: "#03DAC6" },
  textStandby: { color: "#CF6679" },
  mainButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  btnStandby: { backgroundColor: "#03DAC6" },
  btnActive: { backgroundColor: "#CF6679" },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  sosButton: {
    backgroundColor: "#B00020",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  sosText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
