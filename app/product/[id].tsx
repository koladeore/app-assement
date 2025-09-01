import { useCart } from "@/contexts/CartContext";
import { mockProducts } from "@/data/products";
import { Product } from "@/types/Product";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const foundProduct = mockProducts.find((p) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          Alert.alert("Error", "Product not found.");
          router.back();
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load product details.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!product.inStock) {
      Alert.alert("Out of Stock", "This item is currently unavailable.");
      return;
    }

    addToCart(product);
    Alert.alert(
      "Added to Cart",
      `${product.name} has been added to your cart.`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => router.push("/cart") },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Ionicons name="cube-outline" size={80} color="#d1d5db" />
        <Text className="text-xl font-bold text-gray-900 mt-4">
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        <Image
          source={{
            uri: imageLoading
              ? "https://via.placeholder.com/300"
              : product.image,
          }}
          className="w-full h-80"
          resizeMode="cover"
          onLoadEnd={() => setImageLoading(false)}
        />

        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm p-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </Text>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg text-gray-600">{product.category}</Text>
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text className="ml-1 text-gray-700 font-medium">
                {product.rating} / 5.0
              </Text>
            </View>
          </View>

          <Text className="text-3xl font-bold text-primary-600 mb-4">
            ${product.price.toFixed(2)}
          </Text>

          <View
            className={`py-2 px-3 rounded-lg mb-4 ${
              product.inStock ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                product.inStock ? "text-green-800" : "text-red-800"
              }`}
            >
              {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </Text>
          </View>
        </View>

        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm p-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Description
          </Text>
          <Text className="text-gray-700 leading-6">{product.description}</Text>
        </View>
      </ScrollView>

      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          className={`py-4 px-6 rounded-lg ${
            product.inStock ? "bg-blue-500 active:bg-blue-600" : "bg-gray-300"
          }`}
          onPress={handleAddToCart}
          disabled={!product.inStock}
          activeOpacity={0.9}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="add" size={20} color="#fff" />
            <Text className="text-white text-lg font-bold ml-2">
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
