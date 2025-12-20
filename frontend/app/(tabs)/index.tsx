import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />

        <ThemedText type="title" style={styles.title}>
          Welcome Back 
        </ThemedText>
        
        
        

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <ThemedText style={styles.loginButtonText}>Login</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.footerText}>
          Don’t have an account?{' '}
          <Link href="/1SignUp">
            <ThemedText type="link" style={styles.Link}>
              Sign Up
            </ThemedText>
          </Link>
        </ThemedText>

        <ThemedText style={styles.footerText}>
          Go To The dashboard {' '}
          <Link href="/3AdminDashboard">
            <ThemedText type="link" style={styles.Link}>
              Admin Dashboard
            </ThemedText>
          </Link>
        </ThemedText>

        <ThemedText style={styles.footerText}>
        Go To The Home Page{' '}
        <Link href="/HomePage" >
        <ThemedText type="link" style={styles.Link}>
        HOME PAGE
        </ThemedText>
        </Link>
        </ThemedText>

        
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E8BC0',
    marginBottom: 20,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  loginButton: {
    backgroundColor: '#2E8BC0',
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#6b7280',
  },
  Link: {
    color: '#0097eeff',
    fontWeight: '600',
  },
});
