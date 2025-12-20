import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Dummy users data
const dummyUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "0123456789" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "0987654321" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com", phone: "0112233445" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(dummyUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin – View Users</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userCard}
            onPress={() => {
              setSelectedUser(item);
              setModalVisible(true);
            }}
          >
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />

      {/* User Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            {selectedUser && (
              <>
                <Text style={styles.modalTitle}>User Details</Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Name:</Text> {selectedUser.name}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Email:</Text> {selectedUser.email}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Phone:</Text> {selectedUser.phone}
                </Text>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "white" }}>Close</Text>
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
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userCard: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333333",
  },
  userEmail: {
    color: "#333333",
    marginTop: 4,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E8BC0",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 4,
    color: "#333333",
  },
  bold: { fontWeight: "bold" },
  closeBtn: {
    backgroundColor: "#2E8BC0",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
});
