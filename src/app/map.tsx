import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function MapPlaceholderScreen() {
  return (
    <View style={styles.container}>
      {/* Visual Mock Element representing the map frame */}
      <View style={styles.mapCanvasMock}>
        <ActivityIndicator size="large" color="#03DAC6" />
        <Text style={styles.mockTextHeader}>
          🛰️ GPS Positioning Engine Offline
        </Text>
        <Text style={styles.mockTextSub}>
          SafeRoute live routing mapping grid will load here in Sprint 2.
        </Text>
      </View>

      {/* Metrics Dashboard Simulation Panel */}
      <View style={styles.dashboardPanel}>
        <Text style={styles.panelTitle}>Telemetry Diagnostics</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Coordinates:</Text>
          <Text style={styles.value}>Waiting for GPS Lock...</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tracking Mode:</Text>
          <Text style={styles.value}>Standby</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
    paddingTop: 60,
  },
  mapCanvasMock: {
    flex: 2,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    borderWidth: 1,
    borderColor: "#2C2C2C",
    borderStyle: "dashed", // Dashed border indicates a building block placeholder
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
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginTop: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  panelTitle: {
    color: "#BB86FC",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2C",
  },
  label: {
    color: "#A0A0A0",
    fontSize: 14,
  },
  value: {
    color: "#03DAC6",
    fontSize: 14,
    fontWeight: "600",
  },
});
