import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BookingConfirmedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed</Text>
      <Text style={styles.subtitle}>Your booking is confirmed and the provider has been notified.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Bookings' })}>
        <Text style={styles.primaryText}>Go To My Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Home' })}>
        <Text style={styles.secondaryText}>Back To Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 30, fontWeight: '700', color: '#0f172a', textAlign: 'center' },
  subtitle: { marginTop: 8, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  primaryButton: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13, marginBottom: 10 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingVertical: 13, backgroundColor: '#fff' },
  secondaryText: { color: '#0f172a', textAlign: 'center', fontWeight: '600' },
});
