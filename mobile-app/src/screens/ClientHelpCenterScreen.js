import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const FAQ = [
  { q: 'How do I book a provider?', a: 'Use Categories or Search, open Provider Details, then Book Service.' },
  { q: 'How can I track my booking?', a: 'Go to My Booking to view current status and schedule.' },
  { q: 'How do I message a provider?', a: 'Open Message tab and select your active conversation.' },
];

export default function ClientHelpCenterScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <Text style={styles.subtitle}>Common answers for client workflows.</Text>

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
  question: { color: '#0f172a', fontWeight: '700' },
  answer: { color: '#475569', marginTop: 6 },
});
