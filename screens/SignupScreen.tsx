import { NavigationProp, ParamListBase } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '../utils/supabase';
import { scale, verticalScale, moderateScale } from '../utils/responsive';
import { CheckSquare, Square } from 'lucide-react-native';

const SignupScreen = ({ navigation }: { navigation: NavigationProp<ParamListBase> }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !username || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    if (!agree) {
      Alert.alert('Validation Error', 'You must agree to the terms and conditions.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: username,
        },
      },
    });

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else if (!data.session) {
      Alert.alert('Signup Successful', 'Please check your email to confirm your account.');
    }
    // The onAuthStateChange listener in AuthContext will handle navigation if session is created
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subHeader}>Let's get you started!</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#6b7280"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#6b7280"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6b7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.agreeRow} onPress={() => setAgree(!agree)}>
          {agree ? <CheckSquare color="#2563eb" size={moderateScale(20)} /> : <Square color="#6b7280" size={moderateScale(20)} />}
          <Text style={styles.agreeText}>I agree to the <Text style={styles.link}>Terms and Conditions</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Create Account</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.switchText}>Already have an account? <Text style={styles.link}>Log In</Text></Text>
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
    padding: scale(24),
  },
  header: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  subHeader: {
    fontSize: moderateScale(16),
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: verticalScale(40),
  },
  inputContainer: {
    marginBottom: verticalScale(16),
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
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  agreeText: {
    marginLeft: scale(12),
    fontSize: moderateScale(14),
    color: '#6b7280',
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
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
});

export default SignupScreen;
