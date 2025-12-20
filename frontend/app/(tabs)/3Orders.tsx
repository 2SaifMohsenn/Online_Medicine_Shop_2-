import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Dummy data for UI preview
const dummyOrders = [
  {
    id: "1",
    user: "John Doe",
    totalAmount: 120,
    status: "Pending",
    items: [
      { name: "Paracetamol", quantity: 2 },
      { name: "Vitamin C", quantity: 1 },
    ],
  },
  {
    id: "2",
    user: "Jane Smith",
    totalAmount: 85,
    status: "Packed",
    items: [{ name: "Aspirin", quantity: 3 }],
  },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState(dummyOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const statusColors: any = {
    Pending: "#2E8BC0",
    Packed: "#A1D9A6",
    Delivered: "#333333",
  };

  const handleStatusChange = (status: string) => {
    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, status });
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status } : o))
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin – Orders Management</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => {
              setSelectedOrder(item);
              setModalVisible(true);
            }}
          >
            <Text style={styles.orderId}>Order ID: {item.id}</Text>
            <Text>User: {item.user}</Text>
            <Text>Total: ${item.totalAmount}</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* ----------- Modal for Order Details ----------- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>Order Details</Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Order ID:</Text> {selectedOrder.id}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>User:</Text> {selectedOrder.user}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Total:</Text> ${selectedOrder.totalAmount}
                </Text>

                <Text style={styles.modalSubTitle}>Items:</Text>
                {selectedOrder.items.map((item: any, i: number) => (
                  <Text key={i} style={styles.modalText}>
                    • {item.name} × {item.quantity}
                  </Text>
                ))}

                <Text style={styles.modalSubTitle}>Update Status:</Text>
                <View style={styles.statusButtons}>
                  {["Pending", "Packed", "Delivered"].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={styles.statusBtn}
                      onPress={() => handleStatusChange(status)}
                    >
                      <Text>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

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
    color: "#333333",
    marginBottom: 10,
  },
  orderCard: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  orderId: {
    fontWeight: "bold",
    color: "#2E8BC0",
    marginBottom: 4,
  },
  statusBadge: {
    padding: 5,
    marginTop: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
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
  modalSubTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2E8BC0",
  },
  bold: { fontWeight: "bold" },
  statusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  statusBtn: {
    backgroundColor: "#A1D9A6",
    padding: 8,
    borderRadius: 6,
  },
  closeBtn: {
    backgroundColor: "#2E8BC0",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
});
