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
import { useRouter } from 'expo-router';
import { getUser, saveUser } from '@/constants/userStorage';
import { updateAdminProfile, changePassword } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';

export default function AdminProfile() {
  const router = useRouter();
  const storedAdmin = getUser();

  // Editable fields state
  const [firstName, setFirstName] = useState(storedAdmin?.first_name || 'Admin');
  const [lastName, setLastName] = useState(storedAdmin?.last_name || 'User');
  const [isUpdating, setIsUpdating] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const email = storedAdmin?.email || 'admin@example.com';

  const handleSaveProfile = async () => {
    if (!storedAdmin?.id) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await updateAdminProfile({
        admin_id: storedAdmin.id,
        first_name: firstName,
        last_name: lastName,
      });

      // Update local storage
      if (response.user) {
        saveUser({
          ...response.user,
          role: 'admin',
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
    if (!storedAdmin?.id) {
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
        user_id: storedAdmin.id,
        role: 'admin',
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
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Admin Profile</Text>
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => router.push('/3AdminDashboard')}
          >
            <Ionicons name="speedometer-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.topButtonText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.push('/')}
          >
            <Ionicons name="log-out-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentCenter}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderCentered}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstName.charAt(0)}{lastName.charAt(0)}</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{firstName} {lastName}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Personal Information</Text>

            <View style={styles.field}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                placeholder="Enter first name"
                placeholderTextColor="#9AA6B2"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
                placeholder="Enter last name"
                placeholderTextColor="#9AA6B2"
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
        </View>

        <View style={styles.passwordCard}>
          <Text style={styles.cardTitle}>Change Password</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#9AA6B2"
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
              placeholderTextColor="#9AA6B2"
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
              placeholderTextColor="#9AA6B2"
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6F9',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F1724',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E8BC0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#2E8BC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  topButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ba1515',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  contentCenter: {
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    maxWidth: 760,
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 6,
  },
  profileHeaderCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#2E8BC0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F1724',
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  cardBody: {
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2E8BC0',
    marginBottom: 10,
  },
  passwordCard: {
    width: '100%',
    maxWidth: 760,
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 6,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E6EEF6',
    color: '#0F1724',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#6B7280',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#2E8BC0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
