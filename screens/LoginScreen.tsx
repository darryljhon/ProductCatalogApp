import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '../utils/supabase';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const LoginScreen = ({ navigation }: { navigation: NavigationProp<ParamListBase> }) => {
  const [email, setEmail] = useState('ibaledarryljhon@gmail.com');
  const [password, setPassword] = useState('Admin@143');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      if (error.message === 'Invalid login credentials') {
        Alert.alert(
          'Login Failed',
          'Invalid email or password. If you recently signed up, please make sure your email is confirmed.'
        );
      } else {
        Alert.alert('Login Failed', error.message);
      }
    }
    // The onAuthStateChange listener in AuthContext will handle navigation
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Sign in to your account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={() => { /* Handle forgot password */ }}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Log In</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.switchText}>Don't have an account? <Text style={styles.link}>Sign Up</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: scale(12),
  },
  header: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: verticalScale(4),
  },
  subHeader: {
    fontSize: moderateScale(12),
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(8),
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    fontSize: moderateScale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#2563eb',
    fontWeight: '600',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(24),
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
    fontSize: moderateScale(16),
  },
  footer: {
    marginTop: verticalScale(24),
    alignItems: 'center',
  },
  switchText: {
    color: '#6b7280',
    fontSize: moderateScale(14),
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default LoginScreen;
