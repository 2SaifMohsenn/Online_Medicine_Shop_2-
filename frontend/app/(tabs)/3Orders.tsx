import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from 'expo-router';
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "@/constants/api";

interface OrderItemData {
  id: number;
  medicine: number;
  medicine_name?: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: number;
  user: number;
  user_name?: string;
  total_price: string;
  created_at: string;
  is_paid: boolean;
  items: OrderItemData[];
  status?: string;
}

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const statusColors: any = {
    Pending: "#2E8BC0",
    Packed: "#A1D9A6",
    Delivered: "#333333",
  };

  // Fetch orders when page is focused
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Fetch orders
      const ordersResponse = await fetch(`${API_BASE_URL}/api/orders/`);
      const ordersData = await ordersResponse.json();

      // Fetch users to get names
      const usersResponse = await fetch(`${API_BASE_URL}/api/users/`);
      const usersData = await usersResponse.json();

      // Fetch medicines to get names
      const medicinesResponse = await fetch(`${API_BASE_URL}/api/medicines/`);
      const medicinesData = await medicinesResponse.json();

      // Fetch order items
      const orderItemsResponse = await fetch(`${API_BASE_URL}/api/order-items/`);
      const orderItemsData = await orderItemsResponse.json();

      // Create user lookup map
      const userMap: { [key: number]: string } = {};
      usersData.forEach((user: any) => {
        userMap[user.id] = `${user.first_name} ${user.last_name}`;
      });

      // Create medicine lookup map
      const medicineMap: { [key: number]: string } = {};
      medicinesData.forEach((medicine: any) => {
        medicineMap[medicine.id] = medicine.name;
      });

      // Create order items lookup map
      const orderItemsMap: { [key: number]: OrderItemData[] } = {};
      orderItemsData.forEach((item: any) => {
        if (!orderItemsMap[item.order]) {
          orderItemsMap[item.order] = [];
        }
        orderItemsMap[item.order].push({
          ...item,
          medicine_name: medicineMap[item.medicine] || `Medicine #${item.medicine}`,
        });
      });

      // Combine all data
      const enrichedOrders = ordersData.map((order: any) => ({
        ...order,
        user_name: userMap[order.user] || `User #${order.user}`,
        items: orderItemsMap[order.id] || [],
        status: order.is_paid ? "Confirmed" : "Pending",
      }));

      // Sort by newest first
      enrichedOrders.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(enrichedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    if (selectedOrder) {
      const updated = { ...selectedOrder, status };
      setSelectedOrder(updated);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status } : o))
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2E8BC0" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Orders Management</Text>
        <TouchableOpacity style={styles.dashboardBtn} onPress={() => router.push('/3AdminDashboard')}>
          <Text style={styles.dashboardBtnText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subHeader}>{orders.length} total orders</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => {
                setSelectedOrder(item);
                setModalVisible(true);
              }}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
              </View>
              <Text style={styles.orderUser}>👤 {item.user_name}</Text>
              <Text style={styles.orderItems}>{item.items.length} item(s)</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{parseFloat(item.total_price).toFixed(2)} EGP</Text>
                <View
                  style={[styles.statusBadge, { backgroundColor: statusColors[item.status || 'Pending'] || '#2E8BC0' }]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal for Order Details */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            {selectedOrder && (
              <>
                <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Customer</Text>
                  <Text style={styles.modalValue}>{selectedOrder.user_name}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Date</Text>
                  <Text style={styles.modalValue}>{formatDate(selectedOrder.created_at)}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Items</Text>
                  {selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, i) => (
                      <Text key={i} style={styles.itemText}>
                        • {item.medicine_name} × {item.quantity} ({parseFloat(item.price.toString()).toFixed(2)} EGP)
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.itemText}>No items found</Text>
                  )}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Total</Text>
                  <Text style={styles.modalTotal}>{parseFloat(selectedOrder.total_price).toFixed(2)} EGP</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Update Status</Text>
                  <View style={styles.statusButtons}>
                    {["Pending", "Packed", "Delivered"].map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusBtn,
                          selectedOrder.status === status && styles.statusBtnActive
                        ]}
                        onPress={() => handleStatusChange(status)}
                      >
                        <Text style={[
                          styles.statusBtnText,
                          selectedOrder.status === status && styles.statusBtnTextActive
                        ]}>{status}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#6B7280",
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  dashboardBtn: {
    backgroundColor: '#2E8BC0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dashboardBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subHeader: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  orderCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "bold",
    color: "#2E8BC0",
    fontSize: 16,
  },
  orderDate: {
    color: "#6B7280",
    fontSize: 12,
  },
  orderUser: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
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
    marginBottom: 20,
    color: "#2E8BC0",
  },
  modalSection: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  modalValue: {
    fontSize: 16,
    color: "#333333",
  },
  modalTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E8BC0",
  },
  itemText: {
    fontSize: 14,
    color: "#333333",
    marginVertical: 2,
  },
  statusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statusBtn: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statusBtnActive: {
    backgroundColor: "#2E8BC0",
  },
  statusBtnText: {
    color: "#333333",
    fontWeight: "600",
    fontSize: 12,
  },
  statusBtnTextActive: {
    color: "white",
  },
  closeBtn: {
    backgroundColor: "#2E8BC0",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  closeBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
