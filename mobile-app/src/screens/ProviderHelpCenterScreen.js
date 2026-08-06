import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const FAQ = [
  { q: 'How do I update service pricing?', a: 'Go to My Service Pricing and edit each service amount.' },
  { q: 'How do I change availability?', a: 'Open Availability and update your working hours.' },
  { q: 'How do I get verified faster?', a: 'Upload clear, valid documents in Verification.' },
];

export default function ProviderHelpCenterScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <Text style={styles.subtitle}>Answers to common provider questions.</Text>

      {FAQ.map((item) => (
        <View key={item.q} style={styles.card}>
          <Text style={styles.question}>{item.q}</Text>
          <Text style={styles.answer}>{item.a}</Text>
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
  question: { fontWeight: '700', color: '#0f172a' },
  answer: { marginTop: 7, color: '#475569' },
});
