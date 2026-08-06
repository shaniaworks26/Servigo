import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SLOTS = [
  { day: 'Monday', window: '8:00 AM - 4:00 PM', status: 'Available' },
  { day: 'Tuesday', window: '8:00 AM - 2:00 PM', status: 'Available' },
  { day: 'Wednesday', window: 'Off', status: 'Unavailable' },
  { day: 'Thursday', window: '10:00 AM - 6:00 PM', status: 'Available' },
  { day: 'Friday', window: '8:00 AM - 4:00 PM', status: 'Available' },
];

export default function ProviderAvailabilityScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Availability</Text>
      <Text style={styles.subtitle}>Set your working hours and days off.</Text>

      {SLOTS.map((slot) => (
        <View key={slot.day} style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>{slot.day}</Text>
            <Text style={styles.cardMeta}>{slot.window}</Text>
          </View>
          <Text style={[styles.status, slot.status === 'Available' ? styles.ok : styles.off]}>{slot.status}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Update Availability</Text>
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
  cardMeta: { color: '#64748b', marginTop: 3 },
  status: { fontWeight: '700' },
  ok: { color: '#16a34a' },
  off: { color: '#ef4444' },
  button: { marginTop: 10, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
