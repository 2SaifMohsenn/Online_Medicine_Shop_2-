import { Link } from 'expo-router';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getUser } from '@/constants/userStorage';
import { getDashboardStats } from '@/constants/api';

export default function AdminDashboard() {
  const admin = getUser();
  const adminName = admin ? `${admin.first_name}` : 'Admin';

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockMedicines, setLowStockMedicines] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
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

      {/* Header */}
      <View style={styles.topNav}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Pharmacy Management • Overview</Text>
        </View>

        <Link href="/3AdminProfile" asChild>
          <Pressable style={({ pressed }) => [styles.profileWrap, pressed && styles.pressed]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{adminName.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.profileName}>{adminName}</Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" style={{ marginLeft: 6 }} />
          </Pressable>
        </Link>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsRow}>
        <Link href="/3ProductMangment" asChild>
          <Pressable style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
            <MaterialIcons name="inventory-2" size={26} color="#2E8BC0" />
            <Text style={styles.actionLabel}>Products</Text>
          </Pressable>
        </Link>

        <Link href="/3Orders" asChild>
          <Pressable style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
            <Ionicons name="receipt-outline" size={26} color="#2E8BC0" />
            <Text style={styles.actionLabel}>Orders</Text>
          </Pressable>
        </Link>

        <Link href="/3Users" asChild>
          <Pressable style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
            <Ionicons name="people-outline" size={26} color="#2E8BC0" />
            <Text style={styles.actionLabel}>Users</Text>
          </Pressable>
        </Link>
      </View>

      {/* Stats Container */}
      <View style={styles.statsContainer}>
        {isLoading ? (
          <View style={styles.grid}>
            {[0, 1, 2, 3].map((i) => (
              <Animated.View
                key={i}
                style={[
                  styles.skeletonCard,
                  { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                ]}
              />
            ))}
          </View>
        ) : (
          <View style={styles.grid}>

            {/* Users Card */}
            <Link href="/3Users" asChild>
              <Pressable style={({ pressed }) => [styles.statCard, pressed && styles.pressedCard]}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIconWrap, { backgroundColor: '#2E8BC0' }]}>
                      <Ionicons name="person" size={18} color="#fff" />
                    </View>
                    <Text style={styles.cardLabel}>Users</Text>
                  </View>
                  <Text style={[styles.cardNumber, { color: '#2E8BC0' }]}>{totalUsers}</Text>
                  <Text style={styles.cardMicro}>Total this month</Text>
                </View>
              </Pressable>
            </Link>

            {/* Orders Card */}
            <Pressable style={({ pressed }) => [styles.statCard, pressed && styles.pressedCard]}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconWrap, { backgroundColor: '#4B3F72' }]}>
                    <Ionicons name="basket" size={18} color="#fff" />
                  </View>
                  <Text style={styles.cardLabel}>Orders</Text>
                </View>
                <Text style={[styles.cardNumber, { color: '#2E3A8C' }]}>{totalOrders}</Text>
                <Text style={styles.cardMicro}>Processed today</Text>
              </View>
            </Pressable>

            {/* Revenue Card */}
            <Pressable style={({ pressed }) => [styles.statCard, pressed && styles.pressedCard]}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconWrap, { backgroundColor: '#2E8BC0' }]}>
                    <Ionicons name="cash" size={18} color="#fff" />
                  </View>
                  <Text style={styles.cardLabel}>Revenue</Text>
                </View>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={[styles.cardNumber, { color: '#4CAF50' }]}
                >
                  {totalRevenue} EGP
                </Text>
                <Text style={styles.cardMicro}>Total this month</Text>
              </View>
            </Pressable>

            {/* Low Stock Card */}
            <Link href="/3LowStock" asChild>
              <Pressable style={({ pressed }) => [styles.statCard, pressed && styles.pressedCard]}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View
                      style={[
                        styles.cardIconWrap,
                        { backgroundColor: lowStockMedicines > 0 ? '#E57373' : '#4CAF50' },
                      ]}
                    >
                      <Ionicons name="warning" size={16} color="#fff" />
                    </View>
                    <Text style={styles.cardLabel}>Low Stock</Text>
                  </View>
                  <Text
                    style={[
                      styles.cardNumber,
                      { color: lowStockMedicines > 0 ? '#E53935' : '#4CAF50' },
                    ]}
                  >
                    {lowStockMedicines}
                  </Text>
                  <Text style={styles.cardMicro}>
                    {lowStockMedicines > 0 ? 'Action required' : 'All good'}
                  </Text>
                </View>
              </Pressable>
            </Link>

          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    padding: 16,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#102A43',
  },
  subtitle: {
    marginTop: 2,
    color: '#6B7280',
    fontSize: 12,
  },
  profileWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarLetter: { color: '#2E8BC0', fontWeight: '700' },
  profileName: { color: '#102A43', fontWeight: '600', fontSize: 13 },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionPill: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
  },
  actionLabel: {
    marginTop: 8,
    color: '#102A43',
    fontWeight: '700',
    fontSize: 12,
  },
  statsContainer: {
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    height: 160, // Fixed height for symmetry
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 16, // Consistent internal padding
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  cardNumber: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 2,
  },
  cardMicro: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  skeletonCard: {
    width: '48%',
    height: 160,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    marginBottom: 16,
  },
  pressed: { opacity: 0.7 },
  pressedCard: { transform: [{ scale: 0.97 }] },
});

