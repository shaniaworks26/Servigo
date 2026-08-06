import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ALERTS = [
  { id: 'a1', title: 'Urgent Booking Change', body: 'Your 2:00 PM booking was rescheduled to 3:00 PM.' },
  { id: 'a2', title: 'Payment Reminder', body: 'Complete payment for your recent booking to avoid cancellation.' },
  { id: 'a3', title: 'Security Notice', body: 'New login detected on your account. Review activity in settings.' },
];

export default function ClientAlertScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Alert</Text>
      <Text style={styles.subtitle}>Important client alerts and account notices.</Text>

      {ALERTS.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Mark All As Read</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: '700', color: '#0f172a' },
  cardBody: { color: '#475569', marginTop: 6 },
  button: { marginTop: 10, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
