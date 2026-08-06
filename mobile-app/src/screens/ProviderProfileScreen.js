import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../api';

export default function ProviderProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getProfile();
        setProfile(result?.user || result);
      } catch (error) {
        Alert.alert('Unable to load profile', error.message);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('servigo-auth');
    navigation.replace('Welcome');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Provider profile</Text>
      <Text style={styles.subtitle}>{profile?.email || 'Your account'}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{profile?.first_name} {profile?.last_name}</Text>
        <Text style={styles.cardText}>{profile?.role || 'provider'}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#64748b', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#475569' },
  button: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, marginTop: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
