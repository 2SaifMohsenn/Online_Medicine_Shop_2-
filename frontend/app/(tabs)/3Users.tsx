import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE_URL = 'http://127.0.0.1:8000';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  shipping_address: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin – View Users</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search users by name or email..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Users List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E8BC0" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => {
                setSelectedUser(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found</Text>
          }
        />
      )}

      {/* User Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            {selectedUser && (
              <>
                <Text style={styles.modalTitle}>User Details</Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>First Name:</Text> {selectedUser.first_name}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Last Name:</Text> {selectedUser.last_name}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Email:</Text> {selectedUser.email}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Address:</Text> {selectedUser.shipping_address || 'Not provided'}
                </Text>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "white", fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E8BC0",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 40,
    fontSize: 16,
  },
  userCard: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1F2937",
  },
  userEmail: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 14,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2E8BC0",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 6,
    color: "#333333",
  },
  bold: { fontWeight: "bold" },
  closeBtn: {
    backgroundColor: "#2E8BC0",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
});
