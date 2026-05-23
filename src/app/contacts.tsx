import {
    addLocalContact,
    Contact,
    deleteLocalContact,
    getLocalContacts,
} from "@/services/sqliteService";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ContactsScreen() {
  // State variables to manage the list of contacts and input field values
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Load the contacts automatically as soon as this screen opens
  useEffect(() => {
    loadGuardians();
  }, []);

  // Helper function to grab contacts from SQLite and update the state
  const loadGuardians = async () => {
    const localData = await getLocalContacts();
    setContacts(localData);
  };

  // Triggered when clicking the register button
  const handleRegisterGuardian = async () => {
    // Basic validation to make sure the user didn't leave fields empty
    if (!name.trim() || !phone.trim()) {
      Alert.alert(
        "Input Error",
        "Please fill out both fields before registering.",
      );
      return;
    }

    // Try saving the new contact info into the local SQLite database
    const insertedId = await addLocalContact(name, phone);
    if (insertedId) {
      // If it worked, clear out the input text boxes so they are ready for the next one
      setName("");
      setPhone("");
      // Refresh the UI list so the new contact shows up instantly
      await loadGuardians();
      Alert.alert(
        "Success",
        `${name} is now monitoring your security vectors.`,
      );
    }
  };

  // Deletion logic for removing a contact
  const handleDeleteGuardian = async (id: number | undefined) => {
    if (id === undefined) return;
    // Tell SQLite to drop the row matching this specific ID
    await deleteLocalContact(id);
    // Reload the list so the UI updates and reflects the removal
    await loadGuardians();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Guardians</Text>
      <Text style={styles.subtitle}>
        Grabs your emergency contacts from the app's saved list when you trigger
        an alert.
      </Text>

      {/* Input form section for adding new contacts */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Guardian Name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleRegisterGuardian}
        >
          <Text style={styles.addText}>Register Secure Guardian</Text>
        </TouchableOpacity>
      </View>

      {/* List container that dynamically scrolls through the saved contacts */}
      <FlatList
        data={contacts}
        // Fallback key generation if database ID is somehow missing
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardPhone}>{item.phone}</Text>
            </View>
            {/* Simple pressable area to trigger individual deletion */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteGuardian(item.id)}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// Styling definitions for the dark theme layouts
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#A0A0A0",
    marginVertical: 10,
    lineHeight: 20,
  },
  form: {
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  addButton: {
    backgroundColor: "#03DAC6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addText: {
    color: "#000000",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2C2C2C",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cardPhone: {
    color: "#BB86FC",
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "#CF667922",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CF6679",
  },
  deleteText: {
    color: "#CF6679",
    fontSize: 12,
    fontWeight: "bold",
  },
});
