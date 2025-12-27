import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { getUser } from '@/constants/userStorage';
import { getCart, saveCart } from '@/constants/cartStorage';
import { API_BASE_URL, getImageUrl } from '@/constants/api';

const logoImage = require('@/assets/images/logo.png');

interface Medicine {
  id: number;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: number;
  is_available: boolean;
  image: string | null;
}

// Best sellers will be dynamically populated from the API

export default function HomePage() {
  const router = useRouter();
  const user = getUser();
  const userName = user ? `${user.first_name} ${user.last_name}` : 'Guest';

  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch medicines from API
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Define the valid categories for search
  const VALID_CATEGORIES = ['Vitamins', 'Pain Relief', 'Hair Care', 'Cold & Flu'];

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/medicines/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Filter to include only medicines from the four main categories
      const filteredData = data.filter((medicine: Medicine) =>
        VALID_CATEGORIES.includes(medicine.category)
      );
      console.log(`Fetched ${filteredData.length} medicines from ${VALID_CATEGORIES.length} categories`);
      setMedicines(filteredData);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      // Show alert to help debug connection issues
      alert('Could not load medicines. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Filter medicines based on search query
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add to cart function
  const addToCart = (medicine: Medicine) => {
    const cart = getCart();
    const existingItem = cart.find((item: any) => item.id === medicine.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: medicine.id,
        name: medicine.name,
        price: parseFloat(medicine.price),
        quantity: 1,
        image: medicine.image,
      });
    }

    saveCart(cart);
    alert(`${medicine.name} added to cart!`);
  };

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
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Search Results - Only show when there's a search query */}
      {searchQuery.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Search Results ({filteredMedicines.length})
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#2E8BC0" style={{ marginVertical: 20 }} />
          ) : filteredMedicines.length > 0 ? (
            <View style={styles.searchResults}>
              {filteredMedicines.map((medicine) => (
                <View key={medicine.id} style={styles.searchResultCard}>
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultName}>{medicine.name}</Text>
                    <Text style={styles.searchResultCategory}>{medicine.category}</Text>
                    <Text style={styles.searchResultPrice}>{medicine.price} EGP</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(medicine)}
                  >
                    <Text style={styles.addButtonText}>＋</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noResults}>No medicines found matching "{searchQuery}"</Text>
          )}
        </>
      )}

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

      <Text style={styles.sectionTitle}>Available Products</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {medicines.filter(m => m.is_available).map((item) => (
          <View key={item.id} style={styles.productCard}>
            {item.image ? (
              <Image source={{ uri: getImageUrl(item.image) }} style={styles.productImage} />
            ) : (
              <View style={[styles.productImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 10 }]}>
                <Text style={{ fontSize: 40 }}>💊</Text>
              </View>
            )}
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productDesc} numberOfLines={2}>{item.description || item.category}</Text>

            <View style={styles.productFooter}>
              <Text style={styles.productPrice}>{item.price} EGP</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.addButtonText}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {medicines.filter(m => m.is_available).length === 0 && (
          <Text style={styles.noResults}>No available products found.</Text>
        )}
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

  /* Search Results */
  searchResults: {
    marginBottom: 20,
  },
  searchResultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  searchResultCategory: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  searchResultPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E8BC0',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 15,
    color: '#6B7280',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});

