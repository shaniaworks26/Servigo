import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'electricians', name: 'Electricians', icon: 'electrical-services' },
  { id: 'plumbing', name: 'Plumbing', icon: 'plumbing' },
  { id: 'ac-refrigeration-technicians', name: 'AC & Refrigeration Technicians', icon: 'ac-unit' },
  { id: 'appliance-repair-specialists', name: 'Appliance Repair Specialists', icon: 'kitchen' },
  { id: 'housekeepers-deep-cleaners', name: 'Housekeepers & Deep Cleaners', icon: 'cleaning-services' },
  { id: 'carpet-upholstery-cleaners', name: 'Carpet & Upholstery Cleaners', icon: 'cleaning-services' },
  { id: 'pest-control-specialists', name: 'Pest Control Specialists', icon: 'pest-control' },
];

export default function CategoriesScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>Pick a service category to view results.</Text>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.card}
          onPress={() => navigation.navigate('SearchResults', { category: category.name })}
        >
          <View style={styles.iconWrap}>
            <MaterialIcons name={category.icon} size={24} color="#2563eb" />
          </View>
          <View style={styles.content}>
            <Text style={styles.name}>{category.name}</Text>
            <Text style={styles.muted}>Browse providers and services</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 4, marginBottom: 14, color: '#64748b' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, marginLeft: 12 },
  name: { fontWeight: '700', fontSize: 16, color: '#0f172a' },
  muted: { color: '#64748b', marginTop: 3 },
});
