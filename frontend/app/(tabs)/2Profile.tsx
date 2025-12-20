// // Profile.tsx
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export default function Profile() {
//   const router = useRouter();

//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [passwordModalVisible, setPasswordModalVisible] = useState(false);

//   const [name, setName] = useState('Jessica Miller');
//   const [email, setEmail] = useState('jessica.miller@example.com');
//   const [phone, setPhone] = useState('(555) 123-4567');
//   const [address, setAddress] = useState('123 Wellness Ave, Suite 4B, Healthville, ST 54321');

//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleLogout = () => {
//     router.replace('/');
//   };

//   const handleSaveProfile = () => {
//     // Save profile changes logic here
//     setEditModalVisible(false);
//   };

//   const handleChangePassword = () => {
//     if (newPassword !== confirmPassword) {
//       alert("New passwords do not match!");
//       return;
//     }
//     // Call API to change password
//     setPasswordModalVisible(false);
//     setCurrentPassword('');
//     setNewPassword('');
//     setConfirmPassword('');
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>My Profile</Text>

//       <View style={styles.profileCard}>
//         {/* User Info */}
//         <View style={styles.userInfo}>
//           <View style={styles.userText}>
//             <Text style={styles.userName}>{name}</Text>
//             <Text style={styles.userEmail}>{email}</Text>
//           </View>
//         </View>

//         {/* Personal Information */}
//         <View style={styles.personalInfo}>
//           <Text style={styles.sectionTitle}>Personal Information</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Shipping Address</Text>
//             <Text style={styles.infoValue}>{address}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Phone Number</Text>
//             <Text style={styles.infoValue}>{phone}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Email Address</Text>
//             <Text style={styles.infoValue}>{email}</Text>
//           </View>
//         </View>

//         {/* Account Actions */}
//         <View style={styles.actionsRow}>
//           <TouchableOpacity onPress={handleLogout}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>

//           <View style={styles.rightButtons}>
//             <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
//               <Text style={styles.editButtonText}>Edit Profile</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.changePassButton} onPress={() => setPasswordModalVisible(true)}>
//               <Text style={styles.changePassText}>Change Password</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {/* Edit Profile Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={editModalVisible}
//         onRequestClose={() => setEditModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Edit Profile</Text>

//             <TextInput
//               style={styles.input}
//               value={name}
//               onChangeText={setName}
//               placeholder="Name"
//             />
//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               placeholder="Email"
//             />
//             <TextInput
//               style={styles.input}
//               value={phone}
//               onChangeText={setPhone}
//               placeholder="Phone Number"
//             />
//             <TextInput
//               style={styles.input}
//               value={address}
//               onChangeText={setAddress}
//               placeholder="Shipping Address"
//             />

//             <View style={styles.modalButtons}>
//               <Button title="Cancel" color="#da0505" onPress={() => setEditModalVisible(false)} />
//               <Button title="Save" onPress={handleSaveProfile} />
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Change Password Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={passwordModalVisible}
//         onRequestClose={() => setPasswordModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Change Password</Text>

//             <TextInput
//               style={styles.input}
//               value={currentPassword}
//               onChangeText={setCurrentPassword}
//               placeholder="Current Password"
//               secureTextEntry
//             />
//             <TextInput
//               style={styles.input}
//               value={newPassword}
//               onChangeText={setNewPassword}
//               placeholder="New Password"
//               secureTextEntry
//             />
//             <TextInput
//               style={styles.input}
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               placeholder="Confirm New Password"
//               secureTextEntry
//             />

//             <View style={styles.modalButtons}>
//               <Button title="Cancel" color="#da0505" onPress={() => setPasswordModalVisible(false)} />
//               <Button title="Save" onPress={handleChangePassword} />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
//   title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333333' },
//   profileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
//   userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
//   userText: { flex: 1 },
//   userName: { fontSize: 18, fontWeight: 'bold', color: '#333333' },
//   userEmail: { fontSize: 14, color: '#666666', marginTop: 2 },
//   personalInfo: { borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 15 },
//   sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333333' },
//   infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
//   infoLabel: { fontSize: 14, color: '#666666' },
//   infoValue: { fontSize: 14, fontWeight: '500', flex: 1, textAlign: 'right', color: '#333333' },
//   actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
//   rightButtons: { flexDirection: 'row', gap: 10 },
//   editButton: { backgroundColor: '#2E8BC0', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
//   editButtonText: { color: '#fff', fontWeight: 'bold' },
//   changePassButton: { backgroundColor: '#A1D9A6', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
//   changePassText: { color: '#fff', fontWeight: 'bold' },
//   logoutText: { color: '#da0505ff', fontWeight: 'bold', fontSize: 16 },

//   // Modal styles
//   modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
//   modalContainer: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 20 },
//   modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333333' },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
//   modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
// });



import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function UserProfile() {
  // Temporary user data (replace later with API)
  const user = {
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed@gmail.com',
    phone: '+20 101 234 5678',
    address: '12 Tahrir Street',
    city: 'Cairo',
    state: 'Cairo',
    zipCode: '11511',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </Text>
        </View>

        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Account Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Information</Text>

        <View style={styles.field}>
          <Text style={styles.label}>First Name</Text>
          <TextInput value={user.firstName} editable={false} style={styles.inputDisabled} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput value={user.lastName} editable={false} style={styles.inputDisabled} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput value={user.email} editable={false} style={styles.inputDisabled} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <TextInput value={user.phone} editable={false} style={styles.inputDisabled} />
        </View>
      </View>

      {/* Shipping Address */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shipping Address</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            value={user.address}
            placeholder="Street address"
            style={styles.input}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>City</Text>
            <TextInput value={user.city} placeholder="City" style={styles.input} />
          </View>

          <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>State</Text>
            <TextInput value={user.state} placeholder="State" style={styles.input} />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            value={user.zipCode}
            placeholder="ZIP Code"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      {/* Change Password */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Change Password</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            placeholder="Enter current password"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            placeholder="Enter new password"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            placeholder="Confirm new password"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
  row: {
    flexDirection: 'row',
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
    backgroundColor: '#2E8BC0',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
