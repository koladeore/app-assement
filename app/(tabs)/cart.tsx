import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, CartItem } from '@/contexts/CartContext';
import { router } from 'expo-router';

export default function CartScreen() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${productName} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(productId) },
      ]
    );
  };

  const handleClearCart = () => {
    if (state.items.length === 0) return;
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      const item = state.items.find(item => item.product.id === productId);
      if (item) {
        handleRemoveItem(productId, item.product.name);
      }
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View className="bg-white mx-4 mb-4 rounded-xl shadow-sm overflow-hidden">
      <View className="flex-row p-4">
        <Image
          source={{ uri: item.product.image }}
          className="w-20 h-20 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={2}>
            {item.product.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            {item.product.category}
          </Text>
          <Text className="text-xl font-bold text-primary-600 mb-3">
            ${item.product.price.toFixed(2)}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-gray-100 rounded-lg p-1">
              <TouchableOpacity
                className="p-2"
                onPress={() => updateItemQuantity(item.product.id, item.quantity - 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={16} color="#6b7280" />
              </TouchableOpacity>
              <Text className="mx-3 text-lg font-semibold text-gray-900 min-w-[30px] text-center">
                {item.quantity}
              </Text>
              <TouchableOpacity
                className="p-2"
                onPress={() => updateItemQuantity(item.product.id, item.quantity + 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              className="p-2"
              onPress={() => handleRemoveItem(item.product.id, item.product.name)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const CartSummary = () => (
    <View className="bg-white mx-4 mb-4 rounded-xl shadow-sm p-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          Total Items: {state.itemCount}
        </Text>
        <Text className="text-2xl font-bold text-primary-600">
          ${state.total.toFixed(2)}
        </Text>
      </View>
      
      <TouchableOpacity
        className="bg-success-500 py-4 rounded-lg mb-3 active:bg-success-600"
        activeOpacity={0.9}
      >
        <Text className="text-white text-center text-lg font-bold">
          Proceed to Checkout
        </Text>
      </TouchableOpacity>
      
      {state.items.length > 0 && (
        <TouchableOpacity
          className="border border-gray-300 py-3 rounded-lg active:bg-gray-50"
          onPress={handleClearCart}
          activeOpacity={0.7}
        >
          <Text className="text-gray-700 text-center font-semibold">
            Clear Cart
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const EmptyCart = () => (
    <View className="flex-1 justify-center items-center px-8">
      <Ionicons name="bag-outline" size={80} color="#d1d5db" />
      <Text className="text-2xl font-bold text-gray-900 mt-6 mb-2">
        Your cart is empty
      </Text>
      <Text className="text-gray-600 text-center mb-8">
        Add some products to get started with your shopping.
      </Text>
      <TouchableOpacity
        className="bg-primary-500 py-3 px-8 rounded-lg active:bg-primary-600"
        onPress={() => router.push('/')}
        activeOpacity={0.9}
      >
        <Text className="text-white font-bold text-lg">
          Start Shopping
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-primary-500 pt-12 pb-6 px-4">
        <Text className="text-2xl font-bold text-white">
          Shopping Cart
        </Text>
        {state.items.length > 0 && (
          <Text className="text-primary-100 mt-1">
            {state.itemCount} item{state.itemCount !== 1 ? 's' : ''} in your cart
          </Text>
        )}
      </View>

      {state.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <FlatList
          data={state.items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.product.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          ListFooterComponent={<CartSummary />}
        />
      )}
    </View>
  );
}