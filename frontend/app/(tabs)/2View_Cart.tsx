
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const initialCart: CartItem[] = [
  { id: '1', name: 'Pain Reliever', price: 50, quantity: 1 },
  { id: '2', name: 'Allergy Relief', price: 35, quantity: 2 },
  { id: '3', name: 'Vitamin C', price: 25, quantity: 1 },
];

export default function ViewCart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

  const increaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price} EGP</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityBox}>
          <TouchableOpacity style={styles.qtyButton} onPress={() => decreaseQty(item.id)}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={() => increaseQty(item.id)}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🛒 My Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          style={{ marginBottom: 20 }}
        />
      )}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>{getTotalPrice()} EGP</Text>
      </View>

      <TouchableOpacity 
        style={styles.checkoutButton} 
        onPress={() => router.push('/2Payment')} 
      >
        <Text style={styles.checkoutText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333333', marginBottom: 20 },
  emptyText: { fontSize: 16, color: '#666666', textAlign: 'center', marginTop: 50 },
  itemCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  itemDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
  itemPrice: { fontSize: 16, fontWeight: '500', color: '#2E8BC0' },
  itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8 },
  qtyButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#2E8BC0', borderRadius: 6 },
  qtyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  qtyNumber: { paddingHorizontal: 12, fontSize: 16, color: '#333333', fontWeight: '500' },
  removeText: { color: '#A1D9A6', fontWeight: 'bold', fontSize: 14 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 5 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#333333' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#2e8bc0ff' },
  checkoutButton: { backgroundColor: '#2E8BC0', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
