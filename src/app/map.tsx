import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function MapPlaceholderScreen() {
  return (
    // Main full-screen wrapper using the assignment's dark theme
    <View style={styles.container}>
      {/* TEMPORARY MAP MOCK: 
        Putting a fake map frame here for Sprint 1 so the app doesn't crash 
        while I work on getting the actual map API keys sorted in Sprint 2.
      */}
      <View style={styles.mapCanvasMock}>
        {/* Loading spinner just to make it look like it's trying to connect */}
        <ActivityIndicator size="large" color="#03DAC6" />
        <Text style={styles.mockTextHeader}>
          🛰️ GPS Positioning Engine Offline
        </Text>
        <Text style={styles.mockTextSub}>
          SafeRoute live routing mapping grid will load here in Sprint 2.
        </Text>
      </View>

      {/* TELEMETRY PANEL:
        A placeholder box to show where the live data tracking updates 
        (like speed and heading) will display later on.
      */}
      <View style={styles.dashboardPanel}>
        <Text style={styles.panelTitle}>Telemetry Diagnostics</Text>

        {/* Row for coordinate readout */}
        <View style={styles.row}>
          <Text style={styles.label}>Coordinates:</Text>
          <Text style={styles.value}>Waiting for GPS Lock...</Text>
        </View>

        {/* Row for status state */}
        <View style={styles.row}>
          <Text style={styles.label}>Tracking Mode:</Text>
          <Text style={styles.value}>Standby</Text>
        </View>
      </View>
    </View>
  );
}

// Custom UI styling for the dark layout scheme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Clean dark background
    padding: 16,
    paddingTop: 60, // Padding at top to prevent notch overlap on phones
  },
  mapCanvasMock: {
    flex: 2, // Takes up twice as much vertical space as the telemetry box
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderWidth: 1,
    borderColor: "#2C2C2C",
    borderStyle: "dashed", // Dashed border makes it visually obvious that this is a placeholder box
  },
  mockTextHeader: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  mockTextSub: {
    color: "#A0A0A0",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  dashboardPanel: {
    flex: 1, // Takes up remaining bottom portion of the screen
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  panelTitle: {
    color: "#BB86FC", // Accent purple color from the theme constants
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row", // Standard side-by-side layout for labeling fields
    justifyContent: "space-between", // Pushes label to left, value to right
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2C", // Thin divider line between options
  },
  label: {
    color: "#A0A0A0",
    fontSize: 14,
  },
  value: {
    color: "#03DAC6", // Using the bright theme teal to make active text pop out
    fontSize: 14,
    fontWeight: "600",
  },
});
