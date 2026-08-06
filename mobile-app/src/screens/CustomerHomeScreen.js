import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { StarIcon } from '../shared/config/uiIcons';
import { getServices, getProviders } from '../api';

export default function CustomerHomeScreen({ navigation }) {
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
      <Text style={styles.title}>Client Dashboard</Text>
      <Text style={styles.subtitle}>Access all client pages from one place.</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Categories')}>
          <Text style={styles.quickActionText}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Home' })}>
          <Text style={styles.quickActionText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Bookings' })}>
          <Text style={styles.quickActionText}>Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Favorites' })}>
          <Text style={styles.quickActionText}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Chat' })}>
          <Text style={styles.quickActionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Notifications' })}>
          <Text style={styles.quickActionText}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('ClientAlert')}>
          <Text style={styles.quickActionText}>Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('CustomerTabs', { screen: 'Profile' })}>
          <Text style={styles.quickActionText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('ClientSettings')}>
          <Text style={styles.quickActionText}>Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('ClientHelpSupport')}>
          <Text style={styles.quickActionText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
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
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  quickAction: {
    backgroundColor: '#e0e7ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  quickActionText: { color: '#1d4ed8', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontWeight: '700', marginBottom: 4 },
  cardText: { color: '#475569', marginBottom: 4 },
  muted: { color: '#64748b' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 6 },
});
