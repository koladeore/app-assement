import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/contexts/CartContext';
import { mockProducts } from '@/data/products';
import { Product } from '@/types/Product';

// Get screen width to calculate card dimensions for a two-column grid
const { width } = Dimensions.get('window');
const itemWidth = (width - 24) / 2; // Subtracting padding/margin to fit two items

export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToCart } = useCart();

  const loadProducts = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This item is currently unavailable.');
      return;
    }
    addToCart(product);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={{ width: itemWidth }} className="m-1 rounded-xl shadow-sm overflow-hidden">
      <TouchableOpacity
        className="bg-white flex-1"
        onPress={() => router.push(`/product/${item.id}`)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.image }}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            {item.category}
          </Text>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-primary-600">
              ${item.price.toFixed(2)}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-yellow-500 mr-1">★</Text>
              <Text className="text-sm text-gray-600">{item.rating}</Text>
            </View>
          </View>
          <TouchableOpacity
            className={`py-3 px-4 rounded-lg ${
              item.inStock
                ? 'bg-primary-500 active:bg-primary-600'
                : 'bg-gray-300'
            }`}
            onPress={() => handleAddToCart(item)}
            disabled={!item.inStock}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add" size={16} color="#ffffff" />
              <Text className="text-white font-semibold ml-2">
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading products...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary-500 pt-12 pb-6 px-4">
        <Text className="text-2xl font-bold text-white mb-4">
          Shop Products
        </Text>
        <View className="flex-row items-center bg-white rounded-lg px-4 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900"
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No products found</Text>
            <Text className="text-gray-400 mt-2">Try adjusting your search</Text>
          </View>
        }
      />
    </View>
  );
}