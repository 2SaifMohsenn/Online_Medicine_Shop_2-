import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getUser } from '@/constants/userStorage';

const logoImage = require('@/assets/images/logo.png');

const bestSellers = [
  {
    id: '1',
    name: 'Pain Reliever',
    desc: '500mg, 24 Tablets',
    price: '55 EGP',
    img: require('@/assets/images/pain_Reliever.png'),
  },
  {
    id: '2',
    name: 'Vitamin C',
    desc: '1000mg, 90 Capsules',
    price: '84 EGP',
    img: require('@/assets/images/vitamin_C.png'),
  },
  {
    id: '3',
    name: 'Cold & Flu Relief',
    desc: 'Day & Night Combo',
    price: '76 EGP',
    img: require('@/assets/images/Panadol.png'),
  },
  {
    id: '4',
    name: 'Allergy Relief',
    desc: '24-Hour, 30 Tablets',
    price: '64 EGP',
    img: require('@/assets/images/Allergy_Relief.png'),
  },
];

export default function HomePage() {
  const router = useRouter();
  const user = getUser();
  const userName = user ? `${user.first_name} ${user.last_name}` : 'Guest';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logoImage} />
          <Text style={styles.logo}>PharMe</Text>
        </View>

        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.push('/2Profile')}>
            <Text style={styles.navItem}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/2View_Cart')}>
            <Text style={styles.navItem}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.navItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Welcome, {userName}!</Text>
        <Text style={styles.heroSubtitle}>
          Medicines, vitamins & healthcare products
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines, vitamins..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categories}>
        {[
          { title: 'Pain Relief', sub: 'Aches & pains', route: '/Pain_Relief' },
          { title: 'Vitamins', sub: 'Daily wellness', route: '/Vitamins' },
          { title: 'Cold & Flu', sub: 'Fast relief', route: '/Cold_&_Flu' },
          { title: 'Hair Care', sub: 'Healthy hair', route: '/Hair_Care' },
        ].map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() => router.push(cat.route as any)}
          >
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            <Text style={styles.categorySubtitle}>{cat.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Best Sellers */}
      <Text style={styles.sectionTitle}>Best Sellers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {bestSellers.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <Image source={item.img} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDesc}>{item.desc}</Text>

            <View style={styles.productFooter}>
              <Text style={styles.productPrice}>{item.price}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3F8',
    padding: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 38,
    height: 38,
    marginRight: 8,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8BC0',
  },
  nav: {
    flexDirection: 'row',
    gap: 16,
  },
  navItem: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },

  /* Hero */
  hero: {
    backgroundColor: '#62a5c9ff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#E5F3FF',
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  /* Sections */
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 14,
  },

  /* Categories */
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8BC0',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  /* Products */
  productCard: {
    backgroundColor: '#FFFFFF',
    width: 190,
    borderRadius: 20,
    padding: 16,
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  productDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E8BC0',
  },
  addButton: {
    backgroundColor: '#2E8BC0',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

