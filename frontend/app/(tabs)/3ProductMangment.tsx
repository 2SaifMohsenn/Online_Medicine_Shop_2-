import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
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

const API_BASE_URL = 'http://127.0.0.1:8000';

// Types
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
};

type FormData = {
  name: string;
  category: string;
  price: string;
  stock: string;
  image?: string;
  description?: string;
};

const CATEGORIES = ['Vitamins', 'Hair Care', 'Pain Relief', 'Cold & Flu'];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: CATEGORIES[0],
    price: '',
    stock: '',
    description: '',
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/medicines/`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal to add or edit product
  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image: product.image,
        description: product.description || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: CATEGORIES[0], price: '', stock: '', description: '' });
    }
    setModalVisible(true);
  };

  // Pick image from gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'You need to allow media access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets[0].uri) {
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  // Save or update product
  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsSaving(true);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        description: formData.description || '',
        is_available: true,
      };

      let response;
      if (editingProduct) {
        // Update existing product
        response = await fetch(`${API_BASE_URL}/api/medicines/${editingProduct.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        // Create new product
        response = await fetch(`${API_BASE_URL}/api/medicines/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      Alert.alert('Success', editingProduct ? 'Product updated!' : 'Product added!');
      setModalVisible(false);
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (productId: number) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/medicines/${productId}/`, {
                method: 'DELETE',
              });
              if (response.ok) {
                Alert.alert('Success', 'Product deleted');
                fetchProducts();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2E8BC0" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading products...</Text>
      </View>
    );
  }

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
        keyExtractor={(item) => item.id.toString()}
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
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => openModal(item)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found. Add your first product!</Text>
        }
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
                <Image source={{ uri: formData.image }} style={styles.previewImage} />
              ) : (
                <Text style={styles.imageText}>📷 Upload Image</Text>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={formData.name}
              onChangeText={(t) => setFormData((p) => ({ ...p, name: t }))}
            />

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setCategoryModal(true)}
            >
              <Text style={styles.dropdownText}>Category: {formData.category}</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Price (EGP)"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(t) => setFormData((p) => ({ ...p, price: t }))}
            />

            <TextInput
              style={styles.input}
              placeholder="Stock Count"
              keyboardType="numeric"
              value={formData.stock}
              onChangeText={(t) => setFormData((p) => ({ ...p, stock: t }))}
            />

            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Description (optional)"
              multiline
              value={formData.description}
              onChangeText={(t) => setFormData((p) => ({ ...p, description: t }))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, isSaving && styles.btnDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal visible={categoryModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.categoryModal}>
            <Text style={styles.categoryTitle}>Select Category</Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryItem,
                  formData.category === cat && styles.categorySelected,
                ]}
                onPress={() => {
                  setFormData((p) => ({ ...p, category: cat }));
                  setCategoryModal(false);
                }}
              >
                <Text style={[
                  styles.categoryText,
                  formData.category === cat && styles.categoryTextSelected,
                ]}>
                  {cat}
                </Text>
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
  centered: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#1F2937' },

  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    fontSize: 15,
  },

  addButton: {
    backgroundColor: '#2E8BC0',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  productImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
  productName: { fontWeight: 'bold', fontSize: 16, color: '#1F2937' },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 12,
    color: '#2E8BC0',
    alignSelf: 'flex-start',
    marginVertical: 4,
  },

  actionButtons: { gap: 6 },
  editButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 8 },
  deleteButton: { backgroundColor: '#E57373', padding: 8, borderRadius: 8 },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 15 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: { backgroundColor: '#fff', width: '90%', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#1F2937' },

  imagePicker: {
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
  },
  previewImage: { width: '100%', height: '100%', borderRadius: 10 },
  imageText: { color: '#6B7280', fontSize: 16 },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  dropdownText: { color: '#1F2937', fontSize: 15 },

  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelText: { color: '#6B7280', fontWeight: 'bold' },
  saveBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  categoryModal: { backgroundColor: '#fff', borderRadius: 14, width: '80%', padding: 8 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', padding: 14, color: '#1F2937' },
  categoryItem: { padding: 16, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  categorySelected: { backgroundColor: '#E3F2FD' },
  categoryText: { fontSize: 16, color: '#1F2937' },
  categoryTextSelected: { color: '#2E8BC0', fontWeight: 'bold' },
});
