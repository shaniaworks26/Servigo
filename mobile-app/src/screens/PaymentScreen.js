import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function PaymentScreen({ navigation, route }) {
  const serviceTitle = route?.params?.serviceTitle || 'Home Service';
  const [method, setMethod] = useState('card');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.subtitle}>Complete payment for {serviceTitle}</Text>

      <TouchableOpacity
        style={[styles.methodCard, method === 'card' && styles.methodCardActive]}
        onPress={() => setMethod('card')}
      >
        <Text style={[styles.methodTitle, method === 'card' && styles.methodTitleActive]}>Card</Text>
        <Text style={styles.methodText}>Pay securely using your debit or credit card.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.methodCard, method === 'cash' && styles.methodCardActive]}
        onPress={() => setMethod('cash')}
      >
        <Text style={[styles.methodTitle, method === 'cash' && styles.methodTitleActive]}>Cash</Text>
        <Text style={styles.methodText}>Pay the provider when service is complete.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('BookingConfirmed')}>
        <Text style={styles.primaryText}>Pay and Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 4, marginBottom: 14, color: '#64748b' },
  methodCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10 },
  methodCardActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  methodTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  methodTitleActive: { color: '#1d4ed8' },
  methodText: { marginTop: 6, color: '#475569' },
  primaryButton: { marginTop: 12, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
