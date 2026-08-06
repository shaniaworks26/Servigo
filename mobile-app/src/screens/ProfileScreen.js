import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, updateProfile } from '../api';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getProfile();
        const user = result?.user || result;
        setProfile(user);
        setForm({ first_name: user?.first_name || '', last_name: user?.last_name || '', phone: user?.phone || '' });
      } catch (error) {
        Alert.alert('Unable to load profile', error.message);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      const updated = await updateProfile(form);
      Alert.alert('Saved', 'Profile updated');
      setProfile(updated?.user || updated || profile);
    } catch (error) {
      Alert.alert('Update failed', error.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('servigo-auth');
    navigation.replace('Welcome');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>{profile?.email || 'Your account'}</Text>
      <TextInput style={styles.input} placeholder="First name" value={form.first_name} onChangeText={(value) => setForm({ ...form, first_name: value })} />
      <TextInput style={styles.input} placeholder="Last name" value={form.last_name} onChangeText={(value) => setForm({ ...form, last_name: value })} />
      <TextInput style={styles.input} placeholder="Phone" value={form.phone} onChangeText={(value) => setForm({ ...form, phone: value })} />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
        <Text style={styles.secondaryText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#64748b', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#dbe4f0', borderRadius: 12, padding: 12, backgroundColor: '#fff', marginBottom: 12 },
  button: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, marginTop: 8 },
  secondaryButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingVertical: 14, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  secondaryText: { color: '#0f172a', textAlign: 'center', fontWeight: '600' },
});
