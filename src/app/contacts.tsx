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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Fetch verified guardians out of memory on component load
  useEffect(() => {
    loadGuardians();
  }, []);

  const loadGuardians = async () => {
    const localData = await getLocalContacts();
    setContacts(localData);
  };

  const handleRegisterGuardian = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(
        "Input Error",
        "Please fill out both fields before registering.",
      );
      return;
    }

    const insertedId = await addLocalContact(name, phone);
    if (insertedId) {
      setName("");
      setPhone("");
      await loadGuardians(); // Refresh lists
      Alert.alert(
        "Success",
        `${name} is now monitoring your security vectors.`,
      );
    }
  };

  const handleDeleteGuardian = async (id: number | undefined) => {
    if (id === undefined) return;
    await deleteLocalContact(id);
    await loadGuardians();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Guardians</Text>
      <Text style={styles.subtitle}>
        These contacts are parsed locally out of relational storage during
        device runtime alerts.
      </Text>

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

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardPhone}>{item.phone}</Text>
            </View>
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
