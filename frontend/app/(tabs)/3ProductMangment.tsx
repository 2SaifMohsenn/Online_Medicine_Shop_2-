// // AdminProducts.tsx
// import React, { useState } from 'react';
// import {
//     Alert,
//     FlatList,
//     Modal,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// // ✅ Define types
// type Product = {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
// };

// type FormData = {
//   name: string;
//   category: string;
//   price: string;
//   stock: string;
// };

// export default function AdminProducts() {
//   const [products, setProducts] = useState<Product[]>([
//     { id: '1', name: 'Paracetamol', category: 'Pain Relief', price: 25, stock: 50 },
//     { id: '2', name: 'Amoxicillin', category: 'Antibiotic', price: 45, stock: 20 },
//     { id: '3', name: 'Vitamin C', category: 'Supplements', price: 15, stock: 100 },
//   ]);

//   const [search, setSearch] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     category: '',
//     price: '',
//     stock: '',
//   });

//   const openModal = (product: Product | null = null) => {
//     if (product) {
//       setEditingProduct(product);
//       setFormData({
//         name: product.name,
//         category: product.category,
//         price: product.price.toString(),
//         stock: product.stock.toString(),
//       });
//     } else {
//       setEditingProduct(null);
//       setFormData({ name: '', category: '', price: '', stock: '' });
//     }
//     setModalVisible(true);
//   };

//   const handleSave = () => {
//     if (!formData.name || !formData.category || !formData.price || !formData.stock) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }

//     if (editingProduct) {
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === editingProduct.id
//             ? {
//                 ...p,
//                 name: formData.name,
//                 category: formData.category,
//                 price: parseFloat(formData.price),
//                 stock: parseInt(formData.stock, 10),
//               }
//             : p
//         )
//       );
//       Alert.alert('Success', 'Product updated successfully!');
//     } else {
//       const newProduct: Product = {
//         id: Date.now().toString(),
//         name: formData.name,
//         category: formData.category,
//         price: parseFloat(formData.price),
//         stock: parseInt(formData.stock, 10),
//       };
//       setProducts((prev) => [...prev, newProduct]);
//       Alert.alert('Success', 'New product added!');
//     }

//     setModalVisible(false);
//     setFormData({ name: '', category: '', price: '', stock: '' });
//     setEditingProduct(null);
//   };

//   const handleDelete = (id: string) => {
//     Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: () => {
//           setProducts((prev) => prev.filter((p) => p.id !== id));
//         },
//       },
//     ]);
//   };

//   const filteredProducts = products.filter(
//     (item) =>
//       item.name.toLowerCase().includes(search.toLowerCase()) ||
//       item.category.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Product Management</Text>

//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search by name or category..."
//         placeholderTextColor="#888"
//         value={search}
//         onChangeText={setSearch}
//       />

//       <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
//         <Text style={styles.addButtonText}>+ Add New Product</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={filteredProducts}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.productInfo}>Category: {item.category}</Text>
//               <Text style={styles.productInfo}>Price: ${item.price}</Text>
//               <Text style={styles.productInfo}>Stock: {item.stock}</Text>
//             </View>

//             <View style={styles.actionButtons}>
//               <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
//                 <Text style={styles.actionText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => handleDelete(item.id)}>
//                 <Text style={styles.actionText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />

//       {/* Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>
//               {editingProduct ? 'Edit Product' : 'Add New Product'}
//             </Text>

//             <TextInput
//               style={styles.modalInput}
//               placeholder="Product Name"
//               placeholderTextColor="#888"
//               value={formData.name}
//               onChangeText={(text) => setFormData((s) => ({ ...s, name: text }))}
//             />
//             <TextInput
//               style={styles.modalInput}
//               placeholder="Category"
//               placeholderTextColor="#888"
//               value={formData.category}
//               onChangeText={(text) => setFormData((s) => ({ ...s, category: text }))}
//             />
//             <TextInput
//               style={styles.modalInput}
//               placeholder="Price"
//               placeholderTextColor="#888"
//               keyboardType="numeric"
//               value={formData.price}
//               onChangeText={(text) => setFormData((s) => ({ ...s, price: text }))}
//             />
//             <TextInput
//               style={styles.modalInput}
//               placeholder="Stock Quantity"
//               placeholderTextColor="#888"
//               keyboardType="numeric"
//               value={formData.stock}
//               onChangeText={(text) => setFormData((s) => ({ ...s, stock: text }))}
//             />

//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//                 <Text style={styles.saveText}>{editingProduct ? 'Update' : 'Save'}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => {
//                   setModalVisible(false);
//                   setEditingProduct(null);
//                 }}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//     padding: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#2E8BC0',
//     marginBottom: 16,
//   },
//   searchInput: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#CCC',
//     marginBottom: 12,
//     color: '#333333',
//   },
//   addButton: {
//     backgroundColor: '#2E8BC0',
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   addButtonText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   productName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2E8BC0',
//   },
//   productInfo: {
//     color: '#333333',
//     marginTop: 2,
//   },
//   actionButtons: {
//     justifyContent: 'space-between',
//     marginLeft: 12,
//     alignItems: 'flex-end',
//   },
//   editButton: {
//     backgroundColor: '#A1D9A6',
//     borderRadius: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     marginBottom: 6,
//   },
//   deleteButton: {
//     backgroundColor: '#E57373',
//     borderRadius: 6,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//   },
//   actionText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     width: '85%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2E8BC0',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#CCC',
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 10,
//     color: '#333333',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   saveButton: {
//     backgroundColor: '#2E8BC0',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   saveText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     backgroundColor: '#E57373',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   cancelText: {
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
// });













// import React, { useState } from 'react';
// import {
//   Alert,
//   FlatList,
//   Image,
//   Modal,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Picker } from '@react-native-picker/picker';

// // Types
// type Product = {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   image?: string;
// };

// type FormData = {
//   name: string;
//   category: string;
//   price: string;
//   stock: string;
//   image?: string;
// };

// const CATEGORIES = [
//   'Vitamins',
//   'Hair Care',
//   'Pain Relief',
//   'Cold & Flu',
// ];

// export default function AdminProducts() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [search, setSearch] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     category: CATEGORIES[0],
//     price: '',
//     stock: '',
//     image: undefined,
//   });

//   // Open modal
//   const openModal = (product: Product | null = null) => {
//     if (product) {
//       setEditingProduct(product);
//       setFormData({
//         name: product.name,
//         category: product.category,
//         price: product.price.toString(),
//         stock: product.stock.toString(),
//         image: product.image,
//       });
//     } else {
//       setEditingProduct(null);
//       setFormData({
//         name: '',
//         category: CATEGORIES[0],
//         price: '',
//         stock: '',
//         image: undefined,
//       });
//     }
//     setModalVisible(true);
//   };

//   // Image picker
//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert('Permission required', 'Please allow gallery access');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
//     }
//   };

//   // Save product
//   const handleSave = () => {
//     if (!formData.name || !formData.price || !formData.stock) {
//       Alert.alert('Error', 'Please fill all fields');
//       return;
//     }

//     if (editingProduct) {
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === editingProduct.id
//             ? {
//                 ...p,
//                 ...formData,
//                 price: parseFloat(formData.price),
//                 stock: parseInt(formData.stock, 10),
//               }
//             : p
//         )
//       );
//     } else {
//       setProducts((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           name: formData.name,
//           category: formData.category,
//           price: parseFloat(formData.price),
//           stock: parseInt(formData.stock, 10),
//           image: formData.image,
//         },
//       ]);
//     }

//     setModalVisible(false);
//   };

//   const handleDelete = (id: string) => {
//     Alert.alert('Delete Product', 'Are you sure?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: () =>
//           setProducts((prev) => prev.filter((p) => p.id !== id)),
//       },
//     ]);
//   };

//   const filteredProducts = products.filter(
//     (p) =>
//       p.name.toLowerCase().includes(search.toLowerCase()) ||
//       p.category.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Admin · Products</Text>

//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search products..."
//         value={search}
//         onChangeText={setSearch}
//       />

//       <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
//         <Text style={styles.addButtonText}>＋ Add Product</Text>
//       </TouchableOpacity>

//       <FlatList
//         data={filteredProducts}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             {item.image && (
//               <Image source={{ uri: item.image }} style={styles.productImage} />
//             )}

//             <View style={{ flex: 1 }}>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.categoryBadge}>{item.category}</Text>
//               <Text style={styles.info}>Price: {item.price} EGP</Text>
//               <Text style={styles.info}>Stock: {item.stock}</Text>
//             </View>

//             <View style={styles.actions}>
//               <TouchableOpacity
//                 style={styles.editButton}
//                 onPress={() => openModal(item)}>
//                 <Text style={styles.actionText}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => handleDelete(item.id)}>
//                 <Text style={styles.actionText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />

//       {/* Modal */}
//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modal}>
//             <Text style={styles.modalTitle}>
//               {editingProduct ? 'Edit Product' : 'Add Product'}
//             </Text>

//             <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
//               {formData.image ? (
//                 <Image
//                   source={{ uri: formData.image }}
//                   style={styles.previewImage}
//                 />
//               ) : (
//                 <Text style={styles.imageText}>Upload Product Image</Text>
//               )}
//             </TouchableOpacity>

//             <TextInput
//               style={styles.input}
//               placeholder="Product Name"
//               value={formData.name}
//               onChangeText={(t) =>
//                 setFormData((s) => ({ ...s, name: t }))
//               }
//             />

//             <View style={styles.pickerWrapper}>
//               <Picker
//                 selectedValue={formData.category}
//                 onValueChange={(v) =>
//                   setFormData((s) => ({ ...s, category: v }))
//                 }>
//                 {CATEGORIES.map((c) => (
//                   <Picker.Item key={c} label={c} value={c} />
//                 ))}
//               </Picker>
//             </View>

//             <TextInput
//               style={styles.input}
//               placeholder="Price"
//               keyboardType="numeric"
//               value={formData.price}
//               onChangeText={(t) =>
//                 setFormData((s) => ({ ...s, price: t }))
//               }
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Stock"
//               keyboardType="numeric"
//               value={formData.stock}
//               onChangeText={(t) =>
//                 setFormData((s) => ({ ...s, stock: t }))
//               }
//             />

//             <View style={styles.modalActions}>
//               <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
//                 <Text style={styles.btnText}>Save</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.cancelBtn}
//                 onPress={() => setModalVisible(false)}>
//                 <Text style={styles.btnText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#F8F9FA' },
//   title: { fontSize: 22, fontWeight: 'bold', color: '#2E8BC0', marginBottom: 12 },

//   searchInput: {
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#DDD',
//     marginBottom: 10,
//   },

//   addButton: {
//     backgroundColor: '#2E8BC0',
//     padding: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 12,
//     padding: 12,
//     flexDirection: 'row',
//     marginBottom: 12,
//     elevation: 2,
//   },

//   productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },

//   productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//   categoryBadge: {
//     backgroundColor: '#E3F2FD',
//     color: '#2E8BC0',
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8,
//     borderRadius: 6,
//     marginVertical: 4,
//     fontSize: 12,
//   },
//   info: { fontSize: 13, color: '#555' },

//   actions: { justifyContent: 'space-between' },
//   editButton: {
//     backgroundColor: '#81C784',
//     padding: 6,
//     borderRadius: 6,
//   },
//   deleteButton: {
//     backgroundColor: '#E57373',
//     padding: 6,
//     borderRadius: 6,
//   },
//   actionText: { color: '#FFF', fontWeight: 'bold' },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modal: {
//     backgroundColor: '#FFF',
//     width: '88%',
//     borderRadius: 14,
//     padding: 16,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2E8BC0',
//     marginBottom: 12,
//     textAlign: 'center',
//   },

//   imagePicker: {
//     height: 120,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#CCC',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   previewImage: { width: '100%', height: '100%', borderRadius: 10 },
//   imageText: { color: '#888' },

//   input: {
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },

//   pickerWrapper: {
//     borderWidth: 1,
//     borderColor: '#DDD',
//     borderRadius: 10,
//     marginBottom: 10,
//     overflow: 'hidden',
//   },

//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   saveBtn: {
//     backgroundColor: '#2E8BC0',
//     padding: 10,
//     borderRadius: 10,
//     width: '48%',
//     alignItems: 'center',
//   },
//   cancelBtn: {
//     backgroundColor: '#999',
//     padding: 10,
//     borderRadius: 10,
//     width: '48%',
//     alignItems: 'center',
//   },
//   btnText: { color: '#FFF', fontWeight: 'bold' },
// });

import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Types
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
};

type FormData = {
  name: string;
  category: string;
  price: string;
  stock: string;
  image?: string;
};

const CATEGORIES = ['Vitamins', 'Hair Care', 'Pain Relief', 'Cold & Flu'];

export default function AdminProducts() {
  // ✅ Dummy data kept
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Paracetamol',
      category: 'Pain Relief',
      price: 25,
      stock: 50,
    },
    {
      id: '2',
      name: 'Vitamin C',
      category: 'Vitamins',
      price: 40,
      stock: 100,
    },
    {
      id: '3',
      name: 'Hair Serum',
      category: 'Hair Care',
      price: 90,
      stock: 30,
    },
  ]);

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: CATEGORIES[0],
    price: '',
    stock: '',
  });

  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image: product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: CATEGORIES[0],
        price: '',
        stock: '',
      });
    }
    setModalVisible(true);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData((p) => ({ ...p, image: result.assets[0].uri }));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      Alert.alert('Fill all fields');
      return;
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10),
                image: formData.image,
              }
            : p
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          image: formData.image,
        },
      ]);
    }

    setModalVisible(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Management</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>＋ Add Product</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.productImage} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.categoryBadge}>{item.category}</Text>
              <Text>Price: {item.price} EGP</Text>
              <Text>Stock: {item.stock}</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openModal(item)}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Product Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </Text>

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {formData.image ? (
                <Image
                  source={{ uri: formData.image }}
                  style={styles.previewImage}
                />
              ) : (
                <Text style={styles.imageText}>Upload Image</Text>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={formData.name}
              onChangeText={(t) =>
                setFormData((p) => ({ ...p, name: t }))
              }
            />

            {/* ✅ Modern Dropdown */}
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setCategoryModal(true)}>
              <Text style={styles.dropdownText}>{formData.category}</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(t) =>
                setFormData((p) => ({ ...p, price: t }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Stock"
              keyboardType="numeric"
              value={formData.stock}
              onChangeText={(t) =>
                setFormData((p) => ({ ...p, stock: t }))
              }
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Category Selector */}
      <Modal visible={categoryModal} transparent>
        <View style={styles.overlay}>
          <View style={styles.categoryModal}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryItem}
                onPress={() => {
                  setFormData((p) => ({ ...p, category: cat }));
                  setCategoryModal(false);
                }}>
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F7F8FA' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: '#2E8BC0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  productName: { fontWeight: 'bold', fontSize: 16 },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },

  editButton: {
    backgroundColor: '#81C784',
    padding: 8,
    borderRadius: 6,
  },
  actionText: { color: '#fff', fontWeight: 'bold' },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: '88%',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },

  imagePicker: {
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  previewImage: { width: '100%', height: '100%', borderRadius: 10 },
  imageText: { color: '#888' },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dropdownText: { color: '#333' },

  saveBtn: {
    backgroundColor: '#2E8BC0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },

  categoryModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
  },
  categoryItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  categoryText: { fontSize: 16 },
});
