import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function BookServiceScreen({ navigation, route }) {
  const providerId = route?.params?.providerId || 'p1';
  const serviceTitle = route?.params?.serviceTitle || 'Home Service';
  const [date, setDate] = useState('2026-08-20');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book Service</Text>
      <Text style={styles.subtitle}>{serviceTitle} with provider #{providerId.toUpperCase()}</Text>

      <Text style={styles.label}>Preferred date</Text>
      <TextInput value={date} onChangeText={setDate} style={styles.input} placeholder="YYYY-MM-DD" />

      <Text style={styles.label}>Preferred time</Text>
      <TextInput value={time} onChangeText={setTime} style={styles.input} placeholder="10:00 AM" />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, styles.notesInput]}
        multiline
        placeholder="Add service details"
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Payment', { providerId, serviceTitle, date, time })}
      >
        <Text style={styles.primaryText}>Continue to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 4, marginBottom: 14, color: '#64748b' },
  label: { color: '#334155', fontWeight: '600', marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#dbe4f0', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  notesInput: { minHeight: 100, textAlignVertical: 'top' },
  primaryButton: { marginTop: 16, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
