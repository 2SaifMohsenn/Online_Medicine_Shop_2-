import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function StackLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF', // white header
          shadowColor: 'transparent', // remove iOS shadow
          elevation: 0, // remove Android shadow
        },
        headerTintColor: '#333333', // text & icons color
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => alert('Other action')} style={styles.iconButton}>
            <Ionicons name="arrow-forward" size={24} color="#333333" />
          </TouchableOpacity>
        ),
      }}
    >
      {/* Add all your screens here */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="cart" options={{ title: 'Cart' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="payment" options={{ title: 'Payment' }} />
      <Stack.Screen name="contact" options={{ title: 'Contact Us' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 12,
  },
});
