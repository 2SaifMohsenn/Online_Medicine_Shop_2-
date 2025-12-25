import React, { useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '@/constants/api';

// Types
type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image?: string;
};

export default function LowStockPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [restockValues, setRestockValues] = useState<{ [key: number]: string }>({});

    // Fetch products when page is focused
    useFocusEffect(
        useCallback(() => {
            fetchLowStockProducts();
        }, [])
    );

    const fetchLowStockProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/medicines/`);
            const data: Product[] = await response.json();

            // Filter for products with stock < 10
            const lowStock = data.filter((p) => p.stock < 10);
            setProducts(lowStock);

            // Initialize restock inputs with 10 (as a default suggestion)
            const initialInputs: { [key: number]: string } = {};
            lowStock.forEach(p => initialInputs[p.id] = '50');
            setRestockValues(initialInputs);

        } catch (error) {
            console.error('Failed to fetch products:', error);
            Alert.alert('Error', 'Failed to fetch low stock products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestock = async (productId: number) => {
        const amount = parseInt(restockValues[productId], 10);

        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
            return;
        }

        const product = products.find(p => p.id === productId);
        if (!product) return;

        try {
            const updatedStock = product.stock + amount;

            const response = await fetch(`${API_BASE_URL}/api/medicines/${productId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: updatedStock }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stock');
            }

            Alert.alert('Success', `Restocked ${product.name}. New total: ${updatedStock}`);
            fetchLowStockProducts(); // Refresh list
        } catch (error) {
            Alert.alert('Error', 'Failed to update stock. Please try again.');
        }
    };

    const handleInputChange = (id: number, val: string) => {
        setRestockValues(prev => ({ ...prev, [id]: val }));
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#2E8BC0" />
                <Text style={{ marginTop: 10, color: '#6B7280' }}>Checking inventory...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inventory Alert: Low Stock</Text>
            <Text style={styles.subtitle}>Below 10 units available</Text>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {item.image && (
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                        )}
                        <View style={styles.details}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.categoryBadge}>{item.category}</Text>
                            <Text style={styles.stockLabel}>
                                Stock: <Text style={styles.stockValue}>{item.stock}</Text>
                            </Text>
                        </View>

                        <View style={styles.restockContainer}>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={restockValues[item.id]}
                                onChangeText={(val) => handleInputChange(item.id, val)}
                                placeholder="Qty"
                            />
                            <TouchableOpacity
                                style={styles.restockButton}
                                onPress={() => handleRestock(item.id)}
                            >
                                <Text style={styles.restockText}>Restock</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🎉</Text>
                        <Text style={styles.emptyText}>All products are well stocked!</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
    centered: { justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#EF4444', fontWeight: '600', marginBottom: 16 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    productImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
    details: { flex: 1 },
    productName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    categoryBadge: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        fontSize: 10,
        color: '#4B5563',
        alignSelf: 'flex-start',
        marginVertical: 4,
    },
    stockLabel: { fontSize: 13, color: '#6B7280' },
    stockValue: { fontWeight: 'bold', color: '#EF4444' },

    restockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    input: {
        width: 60,
        height: 40,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginRight: 8,
        textAlign: 'center',
        backgroundColor: '#F9FAFB',
    },
    restockButton: {
        backgroundColor: '#2E8BC0',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    restockText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyIcon: { fontSize: 50, marginBottom: 16 },
    emptyText: { fontSize: 16, color: '#4B5563', fontWeight: '500' },
});
