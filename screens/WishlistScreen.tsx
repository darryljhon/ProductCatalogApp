import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Product, useProducts } from '../context/ProductsContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

export default function WishlistScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  const { products, favorites, loadProducts, loading } = useProducts();

  const favoriteProducts = products.filter(product => product.id && favorites.includes(product.id));

  const goToDetails = (product: Product) => {
    navigation.navigate("ProductDetailScreen", { product });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Favorites</Text>
      </View>
      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => <ProductCard product={item} onPress={() => goToDetails(item)} />}
        contentContainerStyle={{ paddingTop: verticalScale(16) }}
        onRefresh={loadProducts}
        refreshing={loading}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Heart size={moderateScale(48)} color="#6b7280" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>Tap the heart on a product to save it here.</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Browse')}>
              <Text style={styles.shopButtonText}>Explore Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(10),
    backgroundColor: '#f9fafb',
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  header: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#111827',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(150),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#111827',
    marginTop: verticalScale(16),
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: '#6b7280',
    marginTop: verticalScale(8),
    textAlign: 'center',
    paddingHorizontal: scale(40),
  },
  shopButton: {
    marginTop: verticalScale(24),
    backgroundColor: '#2563eb',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(32),
    borderRadius: moderateScale(12),
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});