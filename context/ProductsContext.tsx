import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

// Assumes a 'products' table exists in Supabase with the following columns:
// id (number, primary key), title (text), price (number), category (text), image (text), description (text)

export interface Product {
  id?: number; // id is optional for new products
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface ProductsContextType {
  products: Product[];
  favorites: number[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  loadProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
  const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) {
      setError(error.message);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites !== null) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (e) {
        console.error("Failed to load favorites.", e);
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (productId: number) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (e) {
      console.error("Failed to save favorites.", e);
    }
  };

  const isFavorite = (productId: number) => favorites.includes(productId);

  const addProduct = async (product: Product) => {
  const { error } = await supabase.from('products').insert([product]);
    if (error) throw error;
    await fetchProducts(); // Refetch to get the new product with its ID
  };

  const updateProduct = async (product: Product) => {
    if (product.id == null) {
      throw new Error('Product id is required to update a product');
    }
  const { error } = await supabase.from('products').update(product).eq('id', product.id);
    if (error) throw error;
    await fetchProducts(); // Refetch to update the list
  };

  const deleteProduct = async (productId: number) => {
  const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    await fetchProducts(); // Refetch to update the list
  };

  const contextValue = useMemo(() => ({
    products,
    favorites,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    addProduct,
    updateProduct,
    deleteProduct,
    loadProducts: fetchProducts,
  }), [products, favorites, loading, error]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};