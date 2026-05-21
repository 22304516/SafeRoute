import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "Campus Security", phone: "+61 400 000 000" },
  ]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const addContact = () => {
    if (name.trim() && phone.trim()) {
      setContacts([...contacts, { id: Date.now().toString(), name, phone }]);
      setName("");
      setPhone("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Guardians</Text>
      <Text style={styles.subtitle}>
        These contacts are alerted automatically upon a sudden impact sensor
        event.
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
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addText}>Register Guardian</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardPhone}>{item.phone}</Text>
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
    backgroundColor: "#BB86FC",
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
  },
  cardName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cardPhone: {
    color: "#03DAC6",
    marginTop: 4,
  },
});
