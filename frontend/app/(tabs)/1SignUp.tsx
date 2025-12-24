import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { signup } from '@/constants/api';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !address) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup({
        name,
        email,
        password,
        phone,
        address,
      });

      Alert.alert(
        'Signup Successful',
        `Welcome, ${response.user?.first_name}! Please login to continue.`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Signup</Text>

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

        <Text style={styles.inputLabel}>Password*</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.inputLabel}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="01234567890"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.inputLabel}>Address*</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Address"
          value={address}
          onChangeText={setAddress}
        />



        <TouchableOpacity
          style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#F8F9FA',
  },
  signupButton: {
    backgroundColor: '#2E8BC0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});












