import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { StarIcon } from '../shared/config/uiIcons';
import { getServices, getProviders } from '../api';

export default function CustomerHomeScreen() {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [serviceData, providerData] = await Promise.all([getServices(), getProviders()]);
        setServices(serviceData?.services || []);
        setProviders(providerData?.providers || []);
      } catch (error) {
        Alert.alert('Unable to load services', error.message);
      }
    };
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Find trusted help</Text>
      <Text style={styles.subtitle}>Browse your nearby services and professionals.</Text>
      <Text style={styles.sectionTitle}>Popular services</Text>
      {services.slice(0, 3).map((service) => (
        <View key={service.id} style={styles.card}>
          <Text style={styles.cardTitle}>{service.name}</Text>
          <Text style={styles.cardText}>{service.description}</Text>
          <Text style={styles.muted}>From JMD {Number(service.price || 0).toLocaleString()}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Top providers</Text>
      {providers.slice(0, 3).map((provider) => (
        <View key={provider.id} style={styles.card}>
          <Text style={styles.cardTitle}>{provider.business_name || provider.name}</Text>
          <Text style={styles.cardText}>{provider.bio || 'Verified provider'}</Text>
          <View style={styles.ratingRow}>
            <StarIcon size={14} />
            <Text style={[styles.muted, styles.ratingText]}> {provider.average_rating || 0} · {provider.review_count || 0} reviews</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#475569', marginBottom: 4 },
  muted: { color: '#64748b' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 6 },
});
