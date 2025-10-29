import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { View, Text, FlatList, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Product, useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react-native";
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const categories = ["All", "Mobiles", "Laptops", "Computers", "Accessories"];

export default function HomeScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  const { products, loadProducts, loading } = useProducts();
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCat === "All" || p.category === selectedCat;
      const matchQuery = p.title.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, query, selectedCat]);

  const goToDetails = (product: Product) => {
    navigation.navigate("Details", { product });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>GadgetsMo2025</Text>
        {isAdmin && (
          <TouchableOpacity onPress={() => navigation.navigate("Admin")}>
            <Text style={styles.adminButtonText}>Admin</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Search color="#6b7280" size={moderateScale(20)} />
        <TextInput
          placeholder="Search for gadgets..."
          placeholderTextColor="#6b7280"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      </View>

      <View style={{ height: verticalScale(50) }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} onPress={() => setSelectedCat(cat)} style={[styles.chip, selectedCat === cat && styles.chipActive]}>
              <Text style={selectedCat === cat ? styles.chipTextActive : styles.chipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <ProductCard product={item} onPress={() => goToDetails(item)} />}
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found</Text>}
        onRefresh={loadProducts}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
    backgroundColor: '#f9fafb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  header: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#111827',
  },
  adminButtonText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(8),
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  search: {
    flex: 1,
    fontSize: moderateScale(16),
    paddingVertical: verticalScale(10),
    marginLeft: scale(8),
    color: '#111827',
  },
  chipContainer: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    marginRight: scale(10),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    color: '#111827',
    fontSize: moderateScale(14),
  },
  chipTextActive: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: "center",
    marginTop: verticalScale(40),
    color: '#6b7280',
    fontSize: moderateScale(16),
  },
});