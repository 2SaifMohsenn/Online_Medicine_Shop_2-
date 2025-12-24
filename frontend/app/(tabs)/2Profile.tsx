
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
import { getUser, saveUser } from '@/constants/userStorage';
import { updateUserProfile, changePassword } from '@/constants/api';

export default function UserProfile() {
  const storedUser = getUser();

  // Editable fields state
  const [firstName, setFirstName] = useState(storedUser?.first_name || 'User');
  const [lastName, setLastName] = useState(storedUser?.last_name || 'Account');
  const [address, setAddress] = useState(storedUser?.shipping_address || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const email = storedUser?.email || 'user@example.com';

  const handleSaveProfile = async () => {
    if (!storedUser?.id) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await updateUserProfile({
        user_id: storedUser.id,
        first_name: firstName,
        last_name: lastName,
        shipping_address: address,
      });

      // Update local storage
      if (response.user) {
        saveUser({
          ...response.user,
          role: 'user',
        });
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      Alert.alert('Error', message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!storedUser?.id) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 3) {
      Alert.alert('Error', 'Password must be at least 3 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        user_id: storedUser.id,
        role: 'user',
        current_password: currentPassword,
        new_password: newPassword,
      });

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert('Success', 'Password changed successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password change failed';
      Alert.alert('Error', message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ================= Profile Header ================= */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {firstName.charAt(0)}
            {lastName.charAt(0)}
          </Text>
        </View>

        <Text style={styles.name}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* ================= Account Info ================= */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Information</Text>

        <View style={styles.field}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            placeholder="Enter first name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            placeholder="Enter last name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            editable={false}
            style={styles.inputDisabled}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isUpdating && styles.buttonDisabled]}
          onPress={handleSaveProfile}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ================= Change Password ================= */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Change Password</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isChangingPassword && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={isChangingPassword}
        >
          {isChangingPassword ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ================= Styles ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3F8',
    padding: 20,
  },

  /* Header */
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2E8BC0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  /* Cards */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8BC0',
    marginBottom: 16,
  },

  /* Fields */
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#6B7280',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  /* Button */
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
