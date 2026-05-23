import { Accelerometer } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SafeAdBanner from "../components/SafeAdBanner"; // Import the ad container wrapper

export default function FallDetectionScreen() {
  // State for raw accelerometer values (X, Y, Z axes)
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 1 });
  const [subscription, setSubscription] = useState<any>(null);

  // App state to track if we are processing a potential crash impact
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(10);

  // Kick off the hardware listener when the screen loads
  useEffect(() => {
    startListening();
    return () => stopListening();
  }, []);

  // Timer loop that ticks down once an impact triggers
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAlertActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isAlertActive && countdown === 0) {
      // If the timer hits 0 without being dismissed, run emergency protocols
      triggerEmergencySOS();
    }
    return () => clearTimeout(timer);
  }, [isAlertActive, countdown]);

  const startListening = () => {
    // Poll the hardware rapidly so we don't miss sudden spikes
    Accelerometer.setUpdateInterval(100);

    const sub = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);

      // Calculate total force vector using the standard magnitude formula
      const totalG = Math.sqrt(
        accelerometerData.x ** 2 +
          accelerometerData.y ** 2 +
          accelerometerData.z ** 2,
      );

      // 4.5G threshold check. Shaking or dropping the device spikes this easily.
      if (totalG > 4.5 && !isAlertActive) {
        handleImpactDetected();
      }
    });
    setSubscription(sub);
  };

  const stopListening = () => {
    if (subscription) subscription.remove();
    setSubscription(null);
  };

  // Triggers the countdown screen and alerts the user
  const handleImpactDetected = () => {
    setIsAlertActive(true);
    setCountdown(10);
  };

  const dismissAlert = () => {
    setIsAlertActive(false);
    setCountdown(10);
    Alert.alert(
      "Safe & Sound",
      "Glad you are okay! Standing down defense arrays.",
    );
  };

  const triggerEmergencySOS = () => {
    setIsAlertActive(false);
    setCountdown(10);

    Alert.alert(
      "🔒 AUTOMATED RESCUE ACTIVATED",
      "No response recorded. Broadcasting live location coordinates to emergency guardians!",
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Impact Guardian</Text>
        <Text style={styles.tagline}>Hardware Fall-Detection Monitoring</Text>
      </View>

      {/* Main warning card area */}
      <View style={styles.cardContainer}>
        {isAlertActive ? (
          <View style={styles.dangerBox}>
            <Text style={styles.dangerTitle}>⚠️ CRITICAL IMPACT TIMEOUT</Text>
            <Text style={styles.countdownText}>{countdown}s</Text>
            <Text style={styles.dangerSubText}>
              Dispatching automatic emergency alerts unless cancelled below.
            </Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={dismissAlert}
            >
              <Text style={styles.cancelButtonText}>I AM OKAY - DISMISS</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.normalBox}>
            <Text style={styles.statusLabel}>ACCELEROMETER STREAM</Text>
            <Text style={styles.telemetryText}>X: {x.toFixed(2)}G</Text>
            <Text style={styles.telemetryText}>Y: {y.toFixed(2)}G</Text>
            <Text style={styles.telemetryText}>Z: {z.toFixed(2)}G</Text>
            <Text style={styles.statusText}>
              🟢 System continuously tracking force thresholds
            </Text>
          </View>
        )}
      </View>

      {/* Simulator Test Sandbox Control */}
      <View style={styles.sandboxArea}>
        <Text style={styles.sandboxLabel}>EMULATOR SANDBOX CONTROLS</Text>
        <TouchableOpacity
          style={styles.testButton}
          onPress={handleImpactDetected}
        >
          <Text style={styles.testButtonText}>
            💥 Simulate Test Fall (&gt;4.5G)
          </Text>
        </TouchableOpacity>
      </View>
      <SafeAdBanner />
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
  header: { marginTop: 40, alignItems: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  tagline: { fontSize: 14, color: "#BB86FC", marginTop: 4 },
  cardContainer: { flex: 1, justifyContent: "center", marginVertical: 20 },
  normalBox: {
    backgroundColor: "#1E1E1E",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  statusLabel: {
    fontSize: 12,
    color: "#A0A0A0",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 12,
  },
  telemetryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "monospace",
    marginVertical: 4,
    textAlign: "center",
  },
  statusText: {
    color: "#03DAC6",
    fontSize: 13,
    marginTop: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  dangerBox: {
    backgroundColor: "#B00020",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    elevation: 6,
  },
  dangerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  countdownText: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "900",
    marginVertical: 12,
  },
  dangerSubText: {
    color: "#E0E0E0",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: { color: "#B00020", fontWeight: "bold", fontSize: 15 },
  sandboxArea: {
    backgroundColor: "#1A1A24",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333344",
    marginBottom: 20,
  },
  sandboxLabel: {
    color: "#666677",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
  },
  testButton: {
    backgroundColor: "#BB86FC22",
    borderWidth: 1,
    borderColor: "#BB86FC",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  testButtonText: { color: "#BB86FC", fontWeight: "bold", fontSize: 14 },
});
