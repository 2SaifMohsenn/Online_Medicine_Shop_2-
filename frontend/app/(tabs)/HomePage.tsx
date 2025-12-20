// HomePage.tsx
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

// Images
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

  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.navItem}>View Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/2Contact')}>
            <Text style={styles.navItem}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your Health, Delivered.</Text>
        <Text style={styles.heroSubtitle}>
          Search for the medicines and products you need.
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for medicines, vitamins, and more..."
        />
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        <TouchableOpacity
          style={styles.categoryBox}
          onPress={() => router.push('/Pain_Relief')}
        >
          <Text style={styles.categoryTitle}>Pain Relief</Text>
          <Text style={styles.categorySubtitle}>For aches and pains</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryBox}
          onPress={() => router.push('/Vitamins')}
        >
          <Text style={styles.categoryTitle}>Vitamins</Text>
          <Text style={styles.categorySubtitle}>Boost your wellness</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryBox}
          onPress={() => router.push('/Cold_&_Flu')}
        >
          <Text style={styles.categoryTitle}>Cold & Flu</Text>
          <Text style={styles.categorySubtitle}>Relief from symptoms</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryBox}
          onPress={() => router.push('/Hair_Care')}
        >
          <Text style={styles.categoryTitle}>Hair Care</Text>
          <Text style={styles.categorySubtitle}>
            Support your hair health
          </Text>
        </TouchableOpacity>
      </View>

      {/* Best Sellers */}
      <Text style={styles.sectionTitle}>Best-Sellers</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bestSellers}
      >
        {bestSellers.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <Image source={item.img} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDesc}>{item.desc}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  logoContainer: { flexDirection: 'row', alignItems: 'center' },

  logoImage: {
    width: 40,
    height: 40,
    marginRight: 8,
    resizeMode: 'contain',
  },

  logo: { fontSize: 22, fontWeight: 'bold' },

  nav: { flexDirection: 'row', gap: 15 },

  navItem: { fontSize: 16, color: '#333' },

  hero: { marginBottom: 20 },

  heroTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },

  heroSubtitle: { fontSize: 16, color: '#666', marginBottom: 10 },

  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  categoryBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
  },

  categoryTitle: { fontWeight: 'bold', marginBottom: 5 },

  categorySubtitle: { color: '#666', fontSize: 12 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },

  bestSellers: { flexDirection: 'row' },

  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: 180,
    marginRight: 10,
  },

  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  productName: { fontWeight: 'bold', marginBottom: 5 },

  productDesc: { color: '#666', fontSize: 12, marginBottom: 5 },

  productPrice: { fontWeight: 'bold', marginBottom: 10 },

  addButton: {
    backgroundColor: '#2e8bc0ff',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },

  addButtonText: { color: '#fff', fontWeight: 'bold' },
});
