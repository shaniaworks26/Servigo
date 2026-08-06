import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const RESULTS = [
  {
    id: 'r1',
    providerId: 'p1',
    providerName: "John's Plumbing Services",
    title: 'Pipe leak repair',
    category: 'Plumbing',
    price: 5500,
    rating: 4.8,
  },
  {
    id: 'r2',
    providerId: 'p2',
    providerName: 'Sparkle Clean Home Services',
    title: 'Deep home cleaning',
    category: 'Cleaning',
    price: 7200,
    rating: 4.7,
  },
  {
    id: 'r3',
    providerId: 'p3',
    providerName: 'ElectriFix Jamaica',
    title: 'Outlet replacement',
    category: 'Electrical',
    price: 4800,
    rating: 4.9,
  },
];

export default function SearchResultsScreen({ navigation, route }) {
  const category = route?.params?.category;
  const query = route?.params?.query;

  const filteredResults = RESULTS.filter((item) => {
    const byCategory = category ? item.category.toLowerCase() === String(category).toLowerCase() : true;
    const byQuery = query
      ? `${item.title} ${item.providerName} ${item.category}`.toLowerCase().includes(String(query).toLowerCase())
      : true;
    return byCategory && byQuery;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Search Results</Text>
      <Text style={styles.subtitle}>{filteredResults.length} services found</Text>
      {filteredResults.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => navigation.navigate('ProviderDetails', { providerId: item.providerId, serviceTitle: item.title })}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.providerName}</Text>
          <Text style={styles.muted}>{item.category} • JMD {item.price.toLocaleString()} • ⭐ {item.rating}</Text>
        </TouchableOpacity>
      ))}
      {filteredResults.length === 0 ? <Text style={styles.empty}>No matching results yet.</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 4, marginBottom: 14, color: '#64748b' },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  cardText: { marginTop: 4, color: '#334155' },
  muted: { marginTop: 6, color: '#64748b' },
  empty: { color: '#64748b', marginTop: 8 },
});
