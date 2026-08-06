import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const JOBS = [
  { id: 'j1', title: 'Kitchen sink leak', customer: 'Shania Chin', when: 'Today, 2:00 PM' },
  { id: 'j2', title: 'Bathroom drain cleaning', customer: 'Joel Brown', when: 'Tomorrow, 10:00 AM' },
];

export default function ProviderCurrentJobsScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Current Jobs</Text>
      <Text style={styles.subtitle}>Track jobs currently in progress.</Text>

      {JOBS.map((job) => (
        <View key={job.id} style={styles.card}>
          <Text style={styles.cardTitle}>{job.title}</Text>
          <Text style={styles.cardMeta}>{job.customer} • {job.when}</Text>
          <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('ProviderCompletedJobs')}>
            <Text style={styles.smallButtonText}>Mark Complete</Text>
          </TouchableOpacity>
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
  cardMeta: { color: '#64748b', marginTop: 3, marginBottom: 8 },
  smallButton: { alignSelf: 'flex-start', backgroundColor: '#dbeafe', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  smallButtonText: { color: '#1d4ed8', fontWeight: '700' },
});
