import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getBookings } from '../api';

export default function ProviderBookingsScreen({ navigation }) {
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
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionChip} onPress={() => navigation.navigate('ProviderCurrentJobs')}>
          <Text style={styles.actionText}>Current Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionChip} onPress={() => navigation.navigate('ProviderCompletedJobs')}>
          <Text style={styles.actionText}>Complete Job</Text>
        </TouchableOpacity>
      </View>
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
  actionsRow: { flexDirection: 'row', marginBottom: 12 },
  actionChip: { backgroundColor: '#e0e7ff', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  actionText: { color: '#1d4ed8', fontWeight: '700', fontSize: 12 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#475569' },
});
