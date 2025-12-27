import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL, getImageUrl } from '@/constants/api';

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
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'You need to allow media access.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        console.log('Selected image URI:', selectedUri);
        setFormData((prev) => ({ ...prev, image: selectedUri }));
      }
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Save or update product
  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsSaving(true);
    console.log('--- Start Product Save ---');
    console.log('FormData State:', { name: formData.name, category: formData.category, hasImage: !!formData.image });

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('description', formData.description || '');
      data.append('is_available', 'true');

      if (formData.image) {
        const uri = formData.image;
        console.log('Processing image for upload:', uri);

        if (uri.startsWith('file://') || uri.startsWith('content://')) {
          // Mobile native file
          const uriParts = uri.split('.');
          const extension = uriParts.length > 1 ? uriParts[uriParts.length - 1].toLowerCase() : 'jpg';
          const type = `image/${extension === 'png' ? 'png' : extension === 'gif' ? 'gif' : 'jpeg'}`;

          // @ts-ignore
          data.append('image', {
            uri: uri,
            name: `upload_${Date.now()}.${extension}`,
            type: type,
          });
          console.log('Native image appended to FormData');
        } else if (uri.startsWith('blob:')) {
          // Web blob URIs (common on Expo Web)
          try {
            const response = await fetch(uri);
            const blob = await response.blob();
            data.append('image', blob, `upload_${Date.now()}.jpg`);
            console.log('Blob image appended to FormData');
          } catch (blobError) {
            console.error('Failed to process blob URI:', blobError);
          }
        } else if (uri.startsWith('data:')) {
          // Data URI (base64) - optionally handle if needed, but picker usually gives uri
          console.log('Data URI detected - not currently handled for upload');
        } else if (uri.startsWith('http')) {
          // It's already a hosted URL (e.g. from the backend)
          console.log('Existing URL detected, not re-uploading');
        }
      }

      const url = editingProduct
        ? `${API_BASE_URL}/api/medicines/${editingProduct.id}/`
        : `${API_BASE_URL}/api/medicines/`;
      const method = editingProduct ? 'PUT' : 'POST';

      console.log(`Sending ${method} request to ${url}`);

      const response = await fetch(url, {
        method: method,
        body: data,
        headers: {
          'Accept': 'application/json',
          // NO Content-Type header - fetch will set it with boundary for FormData
        },
      });

      console.log('Server response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMsg = `Server error: ${response.status}`;
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Server error JSON:', errorData);
          errorMsg = JSON.stringify(errorData);
        } else {
          const text = await response.text();
          console.error('Server error text:', text.substring(0, 200));
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      console.log('Save successful:', result);

      Alert.alert('Success', editingProduct ? 'Product updated!' : 'Product added!');
      setModalVisible(false);
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred while saving');
    } finally {
      setIsSaving(false);
      console.log('--- End Product Save ---');
    }
  };

  // Delete product
  const handleDelete = async (productId: number) => {
    const performDelete = async () => {
      try {
        console.log(`Attempting to delete product ID: ${productId}`);
        const response = await fetch(`${API_BASE_URL}/api/medicines/${productId}/`, {
          method: 'DELETE',
        });

        console.log('Delete response status:', response.status);

        if (response.ok || response.status === 204) {
          Alert.alert('Success', 'Product deleted successfully');
          fetchProducts(); // Refresh list from backend
        } else {
          const contentType = response.headers.get('content-type');
          let errorMsg = `Failed to delete (Status: ${response.status})`;
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMsg = JSON.stringify(errorData);
          }
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error('Delete error:', error);
        Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete product');
      }
    };

    if (Platform.OS === 'web') {
      // Use window.confirm for web as Alert.alert might not show confirmation buttons correctly on all browsers
      if (window.confirm('Are you sure you want to delete this product?')) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Product',
        'Are you sure you want to delete this product?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: performDelete },
        ]
      );
    }
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
              <Image
                source={{ uri: getImageUrl(item.image) }}
                style={styles.productImage}
                contentFit="cover"
              />
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
                <Image
                  source={{ uri: getImageUrl(formData.image) }}
                  style={styles.previewImage}
                  contentFit="contain"
                />
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
    width: '100%',
    height: 180,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
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
