import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const COMPLETED = [
  { id: 'c1', title: 'Water heater check', customer: 'Dana Smith', doneAt: 'Aug 03, 2026' },
  { id: 'c2', title: 'Faucet replacement', customer: 'Michael Reid', doneAt: 'Aug 01, 2026' },
];

export default function ProviderCompletedJobsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Completed Jobs</Text>
      <Text style={styles.subtitle}>Your recently finished jobs.</Text>

      {COMPLETED.map((job) => (
        <View key={job.id} style={styles.card}>
          <Text style={styles.cardTitle}>{job.title}</Text>
          <Text style={styles.cardMeta}>{job.customer}</Text>
          <Text style={styles.done}>Completed: {job.doneAt}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardMeta: { color: '#64748b', marginTop: 3 },
  done: { color: '#16a34a', fontWeight: '700', marginTop: 8 },
});
