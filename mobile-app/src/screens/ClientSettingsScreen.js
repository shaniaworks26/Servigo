import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';

const OPTIONS = [
  'Notification Preferences',
  'Privacy',
  'Security',
  'Language',
  'Payment Methods',
];

export default function ClientSettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your client account preferences.</Text>

      {OPTIONS.map((item) => (
        <TouchableOpacity key={item} style={styles.optionCard}>
          <Text style={styles.optionText}>{item}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 14 },
  optionCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionText: { color: '#0f172a', fontWeight: '600' },
  chevron: { color: '#94a3b8', fontSize: 22, fontWeight: '700' },
});
