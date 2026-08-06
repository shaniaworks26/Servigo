import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getBookings } from '../api';

const LINKS = [
  { label: 'My Service Pricing', route: 'ProviderServicePricing' },
  { label: 'Availability', route: 'ProviderAvailability' },
  { label: 'Requests', route: 'ProviderTabs', params: { screen: 'Requests' } },
  { label: 'Current Jobs', route: 'ProviderTabs', params: { screen: 'CurrentJobs' } },
  { label: 'Complete Job', route: 'ProviderCompletedJobs' },
  { label: 'Review', route: 'ProviderReviews' },
  { label: 'Earning', route: 'ProviderEarnings' },
  { label: 'Message', route: 'ProviderTabs', params: { screen: 'Messages' } },
  { label: 'Verification', route: 'ProviderVerification' },
  { label: 'Profile', route: 'ProviderTabs', params: { screen: 'Profile' } },
  { label: 'Settings', route: 'ProviderSettings' },
  { label: 'Help Center', route: 'ProviderHelpCenter' },
  { label: 'Help Support', route: 'ProviderHelpSupport' },
];

export default function ProviderHomeScreen({ navigation }) {
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
      <Text style={styles.title}>Provider dashboard</Text>
      <Text style={styles.subtitle}>Manage services, jobs, messages, and account settings.</Text>

      <View style={styles.linksWrap}>
        {LINKS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.linkChip}
            onPress={() => navigation.navigate(item.route, item.params)}
          >
            <Text style={styles.linkText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recent requests</Text>
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
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#64748b', marginBottom: 16 },
  linksWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  linkChip: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#dbeafe', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  linkText: { color: '#1d4ed8', fontWeight: '700', fontSize: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8, color: '#0f172a' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#475569' },
});
