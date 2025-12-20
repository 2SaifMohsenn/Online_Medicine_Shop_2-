// AdminDashboard.tsx
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminDashboard() {
  // Temporary placeholder data
  const totalUsers = 120;
  const totalOrdersToday = 35;
  const totalRevenue = 1250;
  const lowStockMedicines = 5;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Admin Dashboard</Text>

      {/* Dashboard summary cards */}
      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Users</Text>
          <Text style={styles.cardValue}>{totalUsers}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Orders Today</Text>
          <Text style={styles.cardValue}>{totalOrdersToday}</Text>
        </View>
      </View>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue</Text>
          <Text style={styles.cardValue}>${totalRevenue}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Low Stock</Text>
          <Text style={[styles.cardValue, { color: '#E57373' }]}>{lowStockMedicines}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Quick Links */}
      <Text style={styles.quickLinksTitle}>Quick Access</Text>
      <View style={styles.quickLinksContainer}>
        <Link href="/3ProductMangment" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Manage Products</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/3Orders" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>View Orders</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/3Users" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>View Users</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E8BC0',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 6,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8BC0',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 18,
  },
  quickLinksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickLinksContainer: {
    gap: 12,
  },
  linkButton: {
    backgroundColor: '#2E8BC0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
});
