// 4Contact.tsx
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    Alert.alert('Success', 'Your message has been sent!');
    // Clear form
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📞 Contact Us</Text>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.inputLabel}>Email*</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.inputLabel}>Phone (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="+20 123 456 7890"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.inputLabel}>Message*</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Type your message here..."
          multiline
          numberOfLines={5}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Customer Support Info */}
      <View style={styles.supportContainer}>
        <Text style={styles.supportTitle}>Customer Support</Text>
        <Text style={styles.supportText}>📞 Phone: +20 120 666 1737</Text>
        <Text style={styles.supportText}>✉️ Email: s.mohsen2389@nu.edu.eg</Text>
        <Text style={styles.supportText}>🕒 Working Hours: Mon - Fri, 9:00 AM - 6:00 PM</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333333', marginBottom: 20 },
  formContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#333333', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, color: '#333333', backgroundColor: '#F8F9FA' },
  textArea: { height: 100, textAlignVertical: 'top' },
  sendButton: { backgroundColor: '#2E8BC0', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  supportContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  supportTitle: { fontSize: 18, fontWeight: 'bold', color: '#333333', marginBottom: 10 },
  supportText: { fontSize: 14, color: '#333333', marginBottom: 5 },
});
