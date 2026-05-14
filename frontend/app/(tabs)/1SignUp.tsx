import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { signup } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !address || !phone) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (phone.length !== 11) {
      Alert.alert('Error', 'Phone number must be exactly 11 digits');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone,
        address,
      });

      Alert.alert(
        'Success',
        `Welcome, ${response.user?.first_name}! Your account has been created.`,
        [{ text: 'Login Now', onPress: () => router.push('/') }]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <Image
        source={require('@/assets/images/shampoo.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={14}
      />
      <View style={styles.tintOverlay} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logoCircle}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Join PharMe</Text>
            <Text style={styles.subtitle}>Create an account to start shopping</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#e6f2ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="rgba(230,242,255,0.6)"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#e6f2ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="rgba(230,242,255,0.6)"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#e6f2ff"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#e6f2ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone (11 digits)"
                keyboardType="numeric"
                value={phone}
                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                placeholderTextColor="rgba(230,242,255,0.6)"
                maxLength={11}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#e6f2ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Delivery Address"
                value={address}
                onChangeText={setAddress}
                placeholderTextColor="rgba(230,242,255,0.6)"
              />
            </View>

            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#071524',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  container: {
    width: '100%',
    maxWidth: 450,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
    overflow: 'hidden',
  },
  logoCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e6f7ff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(230,242,255,0.85)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#eaf6ff',
  },
  signupButton: {
    backgroundColor: '#007BFF',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  signupButtonDisabled: {
    backgroundColor: '#94a3b8',
    elevation: 0,
    shadowOpacity: 0,
  },
  signupText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 18,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 15,
    color: 'rgba(230,242,255,0.9)',
  },
  loginLinkBold: {
    color: '#39E6A2',
    fontWeight: '700',
  },
  backgroundImage: {
    position: 'absolute',
    width: '140%',
    height: '140%',
    top: '-20%',
    left: '-20%',
    zIndex: -2,
  },
  tintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3,34,54,0.45)',
    zIndex: -1,
  },
});
