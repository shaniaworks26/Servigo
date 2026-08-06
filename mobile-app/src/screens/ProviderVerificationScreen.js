import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ITEMS = [
  { id: 'v1', label: 'Government ID', status: 'Approved' },
  { id: 'v2', label: 'Business License', status: 'Pending' },
  { id: 'v3', label: 'Proof of Address', status: 'Approved' },
];

export default function ProviderVerificationScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.subtitle}>Manage verification documents and status.</Text>

      {ITEMS.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.label}</Text>
          <Text style={[styles.status, item.status === 'Approved' ? styles.ok : styles.pending]}>{item.status}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Upload Document</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  status: { fontWeight: '700' },
  ok: { color: '#16a34a' },
  pending: { color: '#f59e0b' },
  button: { marginTop: 10, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
