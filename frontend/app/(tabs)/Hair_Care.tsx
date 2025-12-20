import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const products = [
  {
    id: '1',
    name: 'Anti Hair Loss Shampoo',
    price: '75 EGP',
    img: require('@/assets/images/shampoo.jpg'),
  },
  {
    id: '2',
    name: 'Hair Serum',
    price: '90 EGP',
    img: require('@/assets/images/shampoo.jpg'),
  },
  {
    id: '3',
    name: 'Hair Vitamins',
    price: '65 EGP',
    img: require('@/assets/images/V.jpg'),
  },
  {
    id: '4',
    name: 'Scalp Treatment',
    price: '80 EGP',
    img: require('@/assets/images/pain_Reliever.png'),
  },
];

export default function HairCarePage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hair Care</Text>

      <View style={styles.grid}>
        {products.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={item.img} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 12, marginBottom: 15 },
  image: { width: '100%', height: 100, resizeMode: 'contain', marginBottom: 10 },
  name: { fontWeight: 'bold', marginBottom: 5 },
  price: { fontWeight: '600', marginBottom: 10 },
  button: { backgroundColor: '#2E8BC0', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
