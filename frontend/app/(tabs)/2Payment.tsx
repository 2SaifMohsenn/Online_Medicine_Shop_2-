// 2Payment.tsx
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';
import { getUser } from '@/constants/userStorage';
import { getCart, getCartTotal, clearCart } from '@/constants/cartStorage';
import { createOrder } from '@/constants/api';

// Helper for consistent alerts across platforms
const showFeedback = (title: string, message: string, onOk?: () => void) => {
  console.log(`[FEEDBACK] ${title}: ${message}`);
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    if (onOk) onOk();
  } else {
    Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  }
};

export default function PaymentPage() {
  const router = useRouter();
  const user = getUser();

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data and cart on mount
  useEffect(() => {
    console.log('PaymentPage: Initializing...');
    try {
      // Pre-fill address from user profile
      if (user?.shipping_address) {
        setAddress(user.shipping_address);
      }

      // Load cart items and total
      const items = getCart();
      const total = getCartTotal();
      console.log('PaymentPage: Loaded cart items:', items.length);
      console.log('PaymentPage: Total amount:', total);

      setCartItems(items);
      setTotalAmount(total);
    } catch (err) {
      console.error('PaymentPage: Error in useEffect:', err);
    }
  }, []);

  const handleConfirmOrder = async () => {
    console.log('handleConfirmOrder: Starting...');

    if (!phone || !address) {
      showFeedback('Error', 'Please enter both phone number and address');
      return;
    }

    if (!user) {
      showFeedback('Error', 'Please login again to place an order');
      router.push('/');
      return;
    }

    if (cartItems.length === 0) {
      showFeedback('Error', 'Your cart is empty. Add items first!');
      router.push('/2View_Cart');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order items for API
      const orderItems = cartItems.map(item => ({
        medicine_id: Number(item.id),
        quantity: Number(item.quantity),
        price: Number(item.price), // backend calculates total_price per item usually, or receives unit price
      }));

      console.log('handleConfirmOrder: Requesting createOrder with data:', {
        user_id: user.id,
        items: orderItems,
        total_price: totalAmount,
      });

      // Create order via API
      const response = await createOrder({
        user_id: user.id,
        items: orderItems,
        total_price: totalAmount,
      });

      console.log('handleConfirmOrder: Server response:', response);

      // Clear cart after successful order
      clearCart();

      // Show success message
      showFeedback(
        '✅ Order Confirmed!',
        `Order #${response.order_id}\n\nPayment Method: Cash on Delivery\nTotal: ${totalAmount.toFixed(2)} EGP\n\nYour order has been placed successfully.`,
        () => {
          console.log('Order confirmed alert dismissed, navigating to HomePage');
          router.replace('/HomePage');
        }
      );
    } catch (error) {
      console.error('handleConfirmOrder: Detailed Error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      showFeedback(
        'Order Failed',
        `Could not complete your order. \n\nError: ${errorMessage}\n\nPlease check your connection or try again later.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Secure Checkout</Text>

      {/* Order Summary Section */}
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Review Your Items</Text>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name} (x{item.quantity})</Text>
            <Text style={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} EGP</Text>
          </View>
        ))}
        {cartItems.length === 0 && <Text style={styles.emptyText}>No items in cart</Text>}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalPrice}>{totalAmount.toFixed(2)} EGP</Text>
        </View>
      </View>

      <View style={styles.methodContainer}>
        <Text style={styles.methodTitle}>Payment Method</Text>
        <Text style={styles.methodValue}>💵 Cash on Delivery (COD)</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 01234567890"
          keyboardType="numeric"
          value={phone}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, '');
            if (numericValue.length <= 11) {
              setPhone(numericValue);
            }
          }}
          maxLength={11}
        />

        <Text style={styles.inputLabel}>Delivery Address *</Text>
        <TextInput
          style={[styles.input, styles.addressInput]}
          placeholder="Street Name, Building No., Floor, Apartment, City"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, (isLoading || cartItems.length === 0) && styles.buttonDisabled]}
        onPress={handleConfirmOrder}
        disabled={isLoading || cartItems.length === 0}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>Place Order Now</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/2View_Cart')} disabled={isLoading}>
        <Text style={styles.cancelText}>Back to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    marginTop: 10,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8BC0',
  },
  methodContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  methodTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  methodValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  confirmButton: {
    backgroundColor: '#2E8BC0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2E8BC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cancelText: {
    textAlign: 'center',
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16,
    paddingVertical: 10,
  },
});
