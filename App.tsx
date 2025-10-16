import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import { Home, Heart, User } from 'lucide-react-native';

import { Product, ProductsProvider } from './context/ProductsContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import WishlistScreen from './screens/WishlistScreen';
import AdminScreen from './screens/AdminScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import EditProductScreen from './screens/EditProductScreen';

export type RootStackParamList = {
  Main: undefined;
  Details: { product: Product };
  Admin: undefined;
  EditProduct: { product?: Product };
};

const MainStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Browse"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Browse') return <Home color={color} size={size} />;
          if (route.name === 'Favorites') return <Heart color={color} size={size} />;
          if (route.name === 'Profile') return <User color={color} size={size} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Browse" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <MainStack.Navigator initialRouteName="Main">
      <MainStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <MainStack.Screen name="Details" component={ProductDetailScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="EditProduct" component={EditProductScreen} options={{ headerShown: false }} />
    </MainStack.Navigator>
  );
}

function AuthFlow() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <AppStack /> : <AuthFlow />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </ProductsProvider>
    </AuthProvider>
  );
}