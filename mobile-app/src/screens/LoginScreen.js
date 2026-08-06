import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { loginUser } from '../api';

const logoAsset = require('../../assets/servi img.jpeg');

function ServiGoLogo() {
  const logoUri = logoAsset?.uri || logoAsset?.default || logoAsset;

  if (Platform.OS === 'web') {
    return <img alt="ServiGo logo" src={typeof logoUri === 'string' ? logoUri : ''} style={{ width: 150, height: 150, objectFit: 'contain', alignSelf: 'center', marginBottom: 14 }} />;
  }

  return <Image source={logoAsset} style={styles.logo} resizeMode="contain" />;
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('admin@servigo.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await loginUser({ email, password });
      await AsyncStorage.setItem('servigo-auth', JSON.stringify(result));
      const role = result.user?.role || 'client';
      navigation.replace(role === 'provider' ? 'ProviderTabs' : 'CustomerTabs');
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ServiGoLogo />
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordWrap}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={22} color="#93a3b8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.errorHint}>Google sign-in was cancelled.</Text>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>or</Text>

          <TouchableOpacity style={styles.googleButton}>
            <MaterialIcons name="g-translate" size={20} color="#1f2937" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f7ff' },
  container: { flex: 1, justifyContent: 'center', padding: 22 },
  logo: { width: 150, height: 150, alignSelf: 'center', marginBottom: 14 },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: '#e5eaf5' },
  title: { fontSize: 46, fontWeight: '800', color: '#4c5e78', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 32, color: '#6f7f96', textAlign: 'center', marginBottom: 18 },
  label: { fontSize: 26, fontWeight: '700', color: '#586b84', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d5dfec', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 24, color: '#2f3e53', marginBottom: 14 },
  passwordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgotText: { color: '#7d8db0', fontSize: 22, textDecorationLine: 'underline' },
  passwordWrap: { borderWidth: 1, borderColor: '#d5dfec', borderRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: 24, color: '#2f3e53' },
  errorHint: { textAlign: 'center', color: '#8f97a6', fontSize: 22, marginBottom: 14 },
  button: { backgroundColor: '#2f6fff', borderRadius: 20, paddingVertical: 16 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 26 },
  orText: { textAlign: 'center', color: '#7b889e', marginVertical: 10, fontSize: 24 },
  googleButton: { borderWidth: 1, borderColor: '#d5dfec', borderRadius: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', columnGap: 10 },
  googleButtonText: { fontSize: 24, fontWeight: '600', color: '#1f2937' },
  link: { color: '#2f6fff', marginTop: 10, textAlign: 'center', fontSize: 22 },
});
