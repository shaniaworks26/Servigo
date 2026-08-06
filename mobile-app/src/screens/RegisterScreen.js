import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser } from '../api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', role: 'client' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const result = await registerUser(form);
      await AsyncStorage.setItem('servigo-auth', JSON.stringify(result));
      navigation.replace(result.user?.role === 'provider' ? 'ProviderTabs' : 'CustomerTabs');
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <TextInput style={styles.input} placeholder="First name" value={form.first_name} onChangeText={(value) => setForm({ ...form, first_name: value })} />
      <TextInput style={styles.input} placeholder="Last name" value={form.last_name} onChangeText={(value) => setForm({ ...form, last_name: value })} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={form.email} onChangeText={(value) => setForm({ ...form, email: value })} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={(value) => setForm({ ...form, password: value })} />
      <TextInput style={styles.input} placeholder="Role (client/provider)" value={form.role} onChangeText={(value) => setForm({ ...form, role: value })} />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Sign up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(form.role === 'provider' ? 'ProviderTabs' : 'CustomerTabs')}>
        <Text style={styles.link}>Skip and explore app</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#dbe4f0', borderRadius: 12, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  link: { color: '#2563eb', marginTop: 12, textAlign: 'center' },
});
