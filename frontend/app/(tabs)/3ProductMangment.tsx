// AdminProducts.tsx
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// ✅ Define types
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

type FormData = {
  name: string;
  category: string;
  price: string;
  stock: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Paracetamol', category: 'Pain Relief', price: 25, stock: 50 },
    { id: '2', name: 'Amoxicillin', category: 'Antibiotic', price: 45, stock: 20 },
    { id: '3', name: 'Vitamin C', category: 'Supplements', price: 15, stock: 100 },
  ]);

  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
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
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', stock: '' });
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      Alert.alert('Error', 'Please fill all fields');
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
              }
            : p
        )
      );
      Alert.alert('Success', 'Product updated successfully!');
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      };
      setProducts((prev) => [...prev, newProduct]);
      Alert.alert('Success', 'New product added!');
    }

    setModalVisible(false);
    setFormData({ name: '', category: '', price: '', stock: '' });
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        },
      },
    ]);
  };

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Management</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or category..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>+ Add New Product</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productInfo}>Category: {item.category}</Text>
              <Text style={styles.productInfo}>Price: ${item.price}</Text>
              <Text style={styles.productInfo}>Stock: {item.stock}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Product Name"
              placeholderTextColor="#888"
              value={formData.name}
              onChangeText={(text) => setFormData((s) => ({ ...s, name: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Category"
              placeholderTextColor="#888"
              value={formData.category}
              onChangeText={(text) => setFormData((s) => ({ ...s, category: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Price"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => setFormData((s) => ({ ...s, price: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Stock Quantity"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={formData.stock}
              onChangeText={(text) => setFormData((s) => ({ ...s, stock: text }))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>{editingProduct ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setEditingProduct(null);
                }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8BC0',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 12,
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#2E8BC0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8BC0',
  },
  productInfo: {
    color: '#333333',
    marginTop: 2,
  },
  actionButtons: {
    justifyContent: 'space-between',
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  editButton: {
    backgroundColor: '#A1D9A6',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  deleteButton: {
    backgroundColor: '#E57373',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8BC0',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#2E8BC0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#E57373',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
