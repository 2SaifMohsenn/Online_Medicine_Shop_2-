import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { API_BASE_URL, getImageUrl } from '@/constants/api';
import { addToCart, CartItem } from '@/constants/cartStorage';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
}

export default function PainReliefPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/medicines/`);
      const data = await response.json();
      const filtered = data.filter((p: any) => p.category === 'Pain Relief');
      setProducts(filtered);

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      quantity: 1,
      image: product.image || null,
    };
    addToCart(cartItem);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2E8BC0" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Pain Relief</Text>
      {products.length === 0 ? (
        <Text style={styles.emptyText}>No products available in this category</Text>
      ) : (
        <View style={styles.grid}>
          {products.map((item) => (
            <Animated.View key={item.id} style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
              {item.image ? (
                <Image source={{ uri: getImageUrl(item.image) }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}><Text style={styles.placeholderText}>💊</Text></View>
              )}
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price} EGP</Text>
              <View style={[styles.stockBadge, item.stock === 0 && styles.outOfStock]}>
                <Text style={[styles.stockText, item.stock === 0 && styles.outOfStockText]}>
                  {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.button, item.stock === 0 && styles.buttonDisabled]}
                disabled={item.stock === 0}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEF3F8', padding: 16 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#6B7280' },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 18, color: '#1F2937' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', width: '48%', padding: 16, borderRadius: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 6 },
  image: { width: '100%', height: 110, resizeMode: 'contain', marginBottom: 12, borderRadius: 10 },
  imagePlaceholder: { width: '100%', height: 110, backgroundColor: '#F3F4F6', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  placeholderText: { fontSize: 40 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  price: { fontSize: 15, fontWeight: '600', color: '#2E8BC0', marginBottom: 8 },
  stockBadge: { alignSelf: 'flex-start', backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  outOfStock: { backgroundColor: '#FDECEA' },
  stockText: { fontSize: 12, fontWeight: '600', color: '#2E7D32' },
  outOfStockText: { color: '#C62828' },
  button: { backgroundColor: '#2E8BC0', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#B0BEC5' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
