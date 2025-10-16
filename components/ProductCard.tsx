import React, { useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { formatPeso } from "../utils/formatCurrency";
import { Product, useProducts } from "../context/ProductsContext";
import { Heart } from "lucide-react-native";
import { scale, verticalScale, moderateScale } from '../utils/responsive';

type ProductCardProps = {
  product: Product;
  onPress: (product: Product) => void;
};

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useProducts();
  const isFav = isFavorite(String(product.id));

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFavPress = () => {
    toggleFavorite(String(product.id));
    scaleAnim.setValue(0.8);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity onPress={handleFavPress} style={styles.favButton}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Heart color={isFav ? '#ef4444' : '#111827'} fill={isFav ? '#ef4444' : 'none'} size={moderateScale(22)} />
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatPeso(product.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    backgroundColor: "#ffffff",
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(12),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: verticalScale(140),
  },
  body: {
    padding: scale(12),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: '#111827',
  },
  price: {
    marginTop: verticalScale(4),
    fontSize: moderateScale(15),
    fontWeight: "bold",
    color: '#2563eb',
  },
  favButton: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: scale(6),
    borderRadius: moderateScale(20),
  },
});