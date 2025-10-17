 import { RouteProp, NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking, Animated, SafeAreaView, Alert } from 'react-native';
import { formatPeso } from '../utils/formatCurrency';
import { Product, useProducts } from '../context/ProductsContext';
import { Heart, Mail, MessageCircle, ChevronLeft } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

type RootStackParamList = {
  Details: { product: Product };
};

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function ProductDetailScreen({ route, navigation }: { route: ProductDetailScreenRouteProp, navigation: NavigationProp<ParamListBase> }) {
  const { product } = route.params;
  const { isFavorite, toggleFavorite } = useProducts();
  const isFav = isFavorite(product.id!);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFavPress = () => {
    toggleFavorite(product.id!);
    scaleAnim.setValue(0.8);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const openWhatsApp = () => {
    const phone = '+63958679075';
    const message = `Hi, I'm interested in your product: ${product.title}`;
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${message}`);
  };

  const openEmail = () => {
    const email = 'ibaledarryljhon@gmail.com';
    const subject = `Inquiry about ${product.title}`;
    Linking.openURL(`mailto:${email}?subject=${subject}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft color="#111827" size={moderateScale(28)} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavPress} style={styles.favButton}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Heart color={isFav ? '#ef4444' : '#111827'} fill={isFav ? '#ef4444' : 'none'} size={moderateScale(24)} />
            </Animated.View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatPeso(product.price)}</Text>
          
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Specifications</Text>
          <Text style={styles.description}>Category: {product.category}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Contact Seller</Text>
          <View style={styles.contactButtonContainer}>
            <TouchableOpacity style={styles.contactButton} onPress={openWhatsApp}>
              <MessageCircle color="#FFFFFF" size={moderateScale(20)} />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactButton, styles.emailButton]} onPress={openEmail}>
              <Mail color="#FFFFFF" size={moderateScale(20)} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Cart feature removed - no footer actions */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: verticalScale(350),
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(40),
    left: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: scale(8),
    borderRadius: moderateScale(24),
  },
  favButton: {
    position: 'absolute',
    top: verticalScale(40),
    right: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: scale(8),
    borderRadius: moderateScale(24),
  },
  contentContainer: {
    padding: scale(20),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#111827',
  },
  price: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#2563eb',
    marginTop: verticalScale(8),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#111827',
    marginBottom: verticalScale(8),
  },
  description: {
    fontSize: moderateScale(16),
    color: '#6b7280',
    lineHeight: verticalScale(24),
  },
  contactButtonContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(8),
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
  },
  emailButton: {
    backgroundColor: '#2563eb',
    marginLeft: scale(12),
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    marginLeft: scale(8),
  },
  footer: {
    padding: scale(20),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  // Footer styles remain in case other actions are added later
});