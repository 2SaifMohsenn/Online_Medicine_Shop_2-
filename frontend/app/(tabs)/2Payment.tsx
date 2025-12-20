// 3Payment.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PaymentPage() {
  const router = useRouter();

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Example total amount
  const totalAmount = 145; // You can pass this as a prop

  const handlePayNow = () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    Alert.alert('Payment Success', `You have paid ${totalAmount} EGP`);
    router.replace('/Login'); // Redirect after payment (optional)
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💳 Payment</Text>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Bill Amount</Text>
        <Text style={styles.totalPrice}>{totalAmount} EGP</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />

        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={cardName}
          onChangeText={setCardName}
        />

        <View style={styles.rowInputs}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expiry}
              onChangeText={setExpiry}
            />
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              keyboardType="numeric"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
        <Text style={styles.payText}>Pay Now</Text>
      </TouchableOpacity>

      

      <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => router.push('/2View_Cart')} 
            >
              <Text style={styles.cancelButton}>Cancel / Go Back</Text>
      </TouchableOpacity>



    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333333', marginBottom: 20 },
  totalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  totalLabel: { fontSize: 16, color: '#666666', marginBottom: 5 },
  totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#2E8BC0' },
  formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  inputLabel: { fontSize: 14, color: '#333333', marginBottom: 5, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, marginBottom: 15, fontSize: 16, color: '#333333', backgroundColor: '#F8F9FA' },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  halfInput: { flex: 1 },
  payButton: { backgroundColor: '#2E8BC0', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  payText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { color: '#268ecbff', alignItems: 'center', fontWeight: 'bold', paddingVertical: 10 },
  cancelText: { color: '#2E8BC0', fontWeight: 'bold', fontSize: 16 },
});
