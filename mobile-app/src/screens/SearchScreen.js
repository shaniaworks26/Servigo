import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { getServices } from '../api';

export default function SearchScreen() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getServices();
        setServices(result?.services || []);
      } catch (error) {
        Alert.alert('Unable to load services', error.message);
      }
    };
    load();
  }, []);

  const filtered = services.filter((service) => `${service.name} ${service.description}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Search services</Text>
      <TextInput style={styles.input} placeholder="Search for a service" value={query} onChangeText={setQuery} />
      {filtered.map((service) => (
        <View key={service.id} style={styles.card}>
          <Text style={styles.cardTitle}>{service.name}</Text>
          <Text style={styles.cardText}>{service.description}</Text>
          <Text style={styles.muted}>{service.categoryName} · {service.providerName}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#dbe4f0', borderRadius: 12, padding: 12, backgroundColor: '#fff', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#475569', marginBottom: 4 },
  muted: { color: '#64748b' },
});
