import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getUser } from '@/constants/userStorage';
import { getDashboardStats } from '@/constants/api';

export default function AdminDashboard() {
  const admin = getUser();
  const adminName = admin ? `${admin.first_name}` : 'Admin';

  // Stats state
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockMedicines, setLowStockMedicines] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const stats = await getDashboardStats();
      setTotalUsers(stats.total_users);
      setTotalOrders(stats.total_orders);
      setTotalRevenue(stats.total_revenue);
      setLowStockMedicines(stats.low_stock_count);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with profile */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Welcome, {adminName}!</Text>

        <Link href="/3AdminProfile" asChild>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileText}>{adminName}</Text>
          </TouchableOpacity>
        </Link>

      </View>

      {/* Top Quick Access Bar */}
      <View style={styles.topBar}>
        <Link href="/3ProductMangment" asChild>
          <TouchableOpacity style={styles.topBarButton}>
            <Text style={styles.topBarText}>Products</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/3Orders" asChild>
          <TouchableOpacity style={styles.topBarButton}>
            <Text style={styles.topBarText}>Orders</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/3Users" asChild>
          <TouchableOpacity style={styles.topBarButton}>
            <Text style={styles.topBarText}>Users</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Centered Statistics Cards */}
      <View style={styles.statsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2E8BC0" />
        ) : (
          <>
            <View style={styles.cardsRow}>
              <Link href="/3Users" asChild>
                <TouchableOpacity style={styles.statCard}>
                  <Text style={styles.cardTitle}>Users</Text>
                  <Text style={styles.cardValue}>{totalUsers}</Text>
                </TouchableOpacity>
              </Link>

              <View style={styles.statCard}>
                <Text style={styles.cardTitle}>Total Orders</Text>
                <Text style={styles.cardValue}>{totalOrders}</Text>
              </View>
            </View>

            <View style={styles.cardsRow}>
              <View style={styles.statCard}>
                <Text style={styles.cardTitle}>Revenue</Text>
                <Text style={styles.cardValue}>{totalRevenue} EGP</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.cardTitle}>Low Stock</Text>
                <Text style={[styles.cardValue, { color: lowStockMedicines > 0 ? '#E57373' : '#4CAF50' }]}>
                  {lowStockMedicines}
                </Text>
              </View>
            </View>
          </>
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E8BC0',
    letterSpacing: 0.5,
  },
  profileButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  profileText: {
    color: '#2E8BC0',
    fontWeight: 'bold',
    fontSize: 14,
  },

  /* Top Bar */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  topBarButton: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#2E8BC0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  topBarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Stats Section */
  statsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 14,

    // Android shadow
    elevation: 10,
  },
  cardTitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E8BC0',
  },
});
