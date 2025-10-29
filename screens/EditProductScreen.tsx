import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { Product, useProducts } from '../context/ProductsContext';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

type EditProductScreenRouteParams = {
  EditProduct: { product?: Product };
};

type EditProductScreenProps = {
  route: RouteProp<EditProductScreenRouteParams, 'EditProduct'>;
  navigation: NavigationProp<ParamListBase>;
};

const categories = ["Mobiles", "Laptops", "Computers", "Accessories"];

export default function EditProductScreen({ route, navigation }: EditProductScreenProps) {
  const { product } = route.params || {};
  const isEditing = !!product;

  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price.toString() || '');
  const [category, setCategory] = useState(product?.category || '');
  const [image, setImage] = useState(product?.image || '');
  const [description, setDescription] = useState(product?.description || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { addProduct, updateProduct, deleteProduct } = useProducts();

  const handleSave = async () => {
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a product title.';
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Please enter a valid positive price.';
    }
    if (!category) {
      newErrors.category = 'Please select a category.';
    }
    const urlRegex = /^(ftp|http|https):\/\/[^ \"]+$/;
    if (!urlRegex.test(image)) {
      newErrors.image = 'Please enter a valid image URL.';
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a product description.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const productData: Omit<Product, 'id'> = {
      title,
      price: parseFloat(price),
      category,
      image,
      description,
    };

    try {
      if (isEditing) {
        await updateProduct({ ...productData, id: product!.id });
      } else {
        await addProduct(productData as Product);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'add'} product.`);
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!product) return;

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
              await deleteProduct(product.id!);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product.');
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={moderateScale(28)} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.header}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
        {isEditing && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 size={moderateScale(24)} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g., Wireless Headphones" />

        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="e.g., 2599.00" keyboardType="numeric" />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipContainer}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={category === cat ? styles.chipTextActive : styles.chipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Image URL</Text>
        <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="https://..." />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDescription} placeholder="Product description..." multiline />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Save Product</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: scale(4),
  },
  deleteButton: {
    padding: scale(4),
  },
  header: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollContainer: {
    padding: scale(20),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    fontSize: moderateScale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },
  multiline: {
    height: verticalScale(100),
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: verticalScale(16),
  },
  chip: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    marginRight: scale(8),
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    color: '#111827',
    fontWeight: '500',
    fontSize: moderateScale(14),
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  footer: {
    padding: scale(20),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: moderateScale(18),
  },
});
