import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { User, Heart, LogOut, ChevronRight, ShoppingBag, Edit } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

export default function ProfileScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // AuthProvider will handle navigation
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Profile</Text>
        <TouchableOpacity onPress={() => { /* Navigate to Edit Profile Screen */ }}>
          <Edit size={moderateScale(24)} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: 'https://www.gravatar.com/avatar/?d=mp' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{profile?.full_name || user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.username}>{profile?.username ? `@${profile.username}` : ''}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Favorites')}>
          <Heart size={moderateScale(22)} color="#111827" />
          <Text style={styles.menuItemText}>My Favorites</Text>
          <ChevronRight size={moderateScale(22)} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={moderateScale(22)} color="#ef4444" />
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#111827',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(24),
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(12),
  },
  name: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#111827',
  },
  username: {
    fontSize: moderateScale(16),
    color: '#2563eb',
    marginTop: verticalScale(4),
  },
  email: {
    fontSize: moderateScale(16),
    color: '#6b7280',
    marginTop: verticalScale(4),
  },
  menuContainer: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(12),
    backgroundColor: '#fff',
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItemText: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#111827',
    marginLeft: scale(16),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(20),
    marginTop: verticalScale(32),
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
    marginLeft: scale(8),
  },
});