// import React from 'react';
// import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const products = [
//   {
//     id: '1',
//     name: 'Paracetamol',
//     price: '25 EGP',
//     img: require('@/assets/images/pain_Reliever.png'),
//   },
//   {
//     id: '2',
//     name: 'Ibuprofen',
//     price: '30 EGP',
//     img: require('@/assets/images/pain_Reliever.png'),
//   },
//   {
//     id: '3',
//     name: 'Diclofenac',
//     price: '35 EGP',
//     img: require('@/assets/images/pain_Reliever.png'),
//   },
//   {
//     id: '4',
//     name: 'Aspirin',
//     price: '20 EGP',
//     img: require('@/assets/images/pain_Reliever.png'),
//   },
// ];

// export default function PainReliefPage() {
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Pain Relief</Text>

//       <View style={styles.grid}>
//         {products.map(item => (
//           <View key={item.id} style={styles.card}>
//             <Image source={item.img} style={styles.image} />
//             <Text style={styles.name}>{item.name}</Text>
//             <Text style={styles.price}>{item.price}</Text>

//             <TouchableOpacity style={styles.button}>
//               <Text style={styles.buttonText}>Add to Cart</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F7F8FA', padding: 16 },
//   title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
//   grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
//   card: { backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 12, marginBottom: 15 },
//   image: { width: '100%', height: 100, resizeMode: 'contain', marginBottom: 10 },
//   name: { fontWeight: 'bold', marginBottom: 5 },
//   price: { fontWeight: '600', marginBottom: 10 },
//   button: { backgroundColor: '#2E8BC0', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
//   buttonText: { color: '#fff', fontWeight: 'bold' },
// });




import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const products = [
  {
    id: '1',
    name: 'Paracetamol',
    price: '25 EGP',
    stock: 20,
    img: require('@/assets/images/pain_Reliever.png'),
  },
  {
    id: '2',
    name: 'Ibuprofen',
    price: '30 EGP',
    stock: 0,
    img: require('@/assets/images/pain_Reliever.png'),
  },
  {
    id: '3',
    name: 'Diclofenac',
    price: '35 EGP',
    stock: 12,
    img: require('@/assets/images/pain_Reliever.png'),
  },
  {
    id: '4',
    name: 'Aspirin',
    price: '20 EGP',
    stock: 8,
    img: require('@/assets/images/pain_Reliever.png'),
  },
];

export default function PainReliefPage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Pain Relief</Text>

      <View style={styles.grid}>
        {products.map((item) => (
          <Animated.View
            key={item.id}
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image source={item.img} style={styles.image} />

            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>

            <View
              style={[
                styles.stockBadge,
                item.stock === 0 && styles.outOfStock,
              ]}
            >
              <Text style={styles.stockText}>
                {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                item.stock === 0 && styles.buttonDisabled,
              ]}
              disabled={item.stock === 0}
            >
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF3F8',
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#1F2937',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },

  image: {
    width: '100%',
    height: 110,
    resizeMode: 'contain',
    marginBottom: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },

  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E8BC0',
    marginBottom: 8,
  },

  stockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },

  outOfStock: {
    backgroundColor: '#FDECEA',
  },

  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },

  button: {
    backgroundColor: '#2E8BC0',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
