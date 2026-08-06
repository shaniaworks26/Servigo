import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ProviderDetailsScreen({ navigation, route }) {
  const providerId = route?.params?.providerId || 'p1';
  const serviceTitle = route?.params?.serviceTitle || 'Home Service';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Provider Details</Text>
      <View style={styles.card}>
        <Text style={styles.name}>Provider #{providerId.toUpperCase()}</Text>
        <Text style={styles.meta}>⭐ 4.8 • 128 reviews</Text>
        <Text style={styles.description}>
          Trusted professional with verified profile, fast response times, and quality customer feedback.
        </Text>
        <Text style={styles.serviceLabel}>Selected service: {serviceTitle}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('BookService', { providerId, serviceTitle })}>
          <Text style={styles.primaryText}>Book Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Chat' })}>
          <Text style={styles.secondaryText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Review', { providerId })}>
          <Text style={styles.secondaryText}>Write Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14 },
  name: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  meta: { marginTop: 6, color: '#475569' },
  description: { marginTop: 10, color: '#334155', lineHeight: 20 },
  serviceLabel: { marginTop: 12, color: '#0f172a', fontWeight: '600' },
  actions: { marginTop: 14 },
  primaryButton: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13, marginBottom: 10 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  secondaryButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingVertical: 13, marginBottom: 10, backgroundColor: '#fff' },
  secondaryText: { color: '#0f172a', textAlign: 'center', fontWeight: '600' },
});
