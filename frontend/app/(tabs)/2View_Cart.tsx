import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  getCart,
  saveCart,
  removeFromCart,
  updateQuantity,
  getCartTotal,
  CartItem
} from '@/constants/cartStorage';

export default function ViewCart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Reload cart when page is focused
  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = () => {
    const items = getCart();
    setCartItems([...items]); // Create new array to trigger re-render
  };

  const increaseQty = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
      loadCart();
    }
  };

  const decreaseQty = (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
      loadCart();
    }
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
    loadCart();
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const renderItem = (item: CartItem) => {
    const itemTotal = item.price * item.quantity;

    return (
      <View key={item.id} style={styles.itemCard}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.price} EGP × {item.quantity}</Text>
          <Text style={styles.itemTotal}>{itemTotal.toFixed(2)} EGP</Text>
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

          <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🛒 My Cart</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/HomePage')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.itemsContainer}>
            {cartItems.map(item => renderItem(item))}
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({cartItems.length})</Text>
              <Text style={styles.summaryValue}>{getTotalPrice().toFixed(2)} EGP</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalPrice}>{getTotalPrice().toFixed(2)} EGP</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push('/2Payment')}
          >
            <Text style={styles.checkoutText}>Proceed to Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push('/HomePage')}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#2E8BC0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemsContainer: {
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  itemDetails: {
    marginBottom: 10
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8BC0',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8
  },
  qtyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2E8BC0',
    borderRadius: 6
  },
  qtyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  qtyNumber: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500'
  },
  removeText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 14
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333'
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8BC0'
  },
  checkoutButton: {
    backgroundColor: '#2E8BC0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  homeButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#2E8BC0',
  },
  homeButtonText: {
    color: '#2E8BC0',
    fontWeight: 'bold',
    fontSize: 16
  },
});
