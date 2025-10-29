import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Alert, TextInput, Image } from 'react-native';
import { Product, useProducts } from '../context/ProductsContext';
import { formatPeso } from '../utils/formatCurrency';
import { Plus, Edit, Trash2, Search, ChevronLeft } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

export default function AdminScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  const { products, deleteProduct, loading, loadProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (product: Product) => {
    navigation.navigate('EditProduct', { product });
  };

  const handleDelete = (productId: number) => {
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
              await deleteProduct(productId);
              Alert.alert('Success', 'Product deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product.');
            }
          },
        },
      ]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productPrice}>{formatPeso(item.price)}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
          <Edit size={moderateScale(20)} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id!)} style={styles.actionButton}>
          <Trash2 size={moderateScale(20)} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={moderateScale(28)} color="#111827" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header}>Manage Products</Text>
          <Text style={{ fontSize: moderateScale(14), color: '#2563eb', fontWeight: 'bold' }}>@DarrylJhon</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('EditProduct')}>
          <Plus size={moderateScale(24)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={moderateScale(20)} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
        onRefresh={loadProducts}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: scale(4),
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(6),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    padding: scale(8),
    borderRadius: moderateScale(8),
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginHorizontal: scale(16),
    marginVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  productImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: moderateScale(8),
    marginRight: scale(16),
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111827',
  },
  productPrice: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginTop: verticalScale(4),
  },
  productActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: scale(16),
    padding: scale(4),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: verticalScale(40),
    color: '#6b7280',
    fontSize: moderateScale(16),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(12),
    margin: scale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    height: verticalScale(48),
    fontSize: moderateScale(16),
    color: '#111827',
  },
});