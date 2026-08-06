import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { getBookings } from '../api';

export default function ProviderBookingsScreen() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getBookings();
        setBookings(result?.bookings || result || []);
      } catch (error) {
        Alert.alert('Unable to load bookings', error.message);
      }
    };
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Service requests</Text>
      {bookings.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <Text style={styles.cardTitle}>Booking #{booking.id}</Text>
          <Text style={styles.cardText}>{booking.status || 'Pending'}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#475569' },
});
