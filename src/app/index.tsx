import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [isGuardActive, setIsGuardActive] = useState<boolean>(false);

  const toggleGuardSystem = () => {
    setIsGuardActive(!isGuardActive);
    Alert.alert(
      isGuardActive ? "System Paused" : "Guard Active",
      isGuardActive
        ? "SafeRoute tracking is on standby."
        : "SafeRoute is now actively monitoring device sensors.",
    );
  };

  const triggerInstantSOS = () => {
    Alert.alert(
      "🚨 EMERGENCY SOS",
      "Broadcasting current GPS vector to verified emergency contacts!",
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SafeRoute</Text>
        <Text style={styles.tagline}>Solo Travel Protection Shield</Text>
      </View>

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
