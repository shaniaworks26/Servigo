import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PROVIDERS = [
  {
    id: 'p1',
    initials: 'JP',
    name: "John's Plumbing Services",
    category: 'Plumbing',
    rating: 4.8,
    reviews: 128,
    description: 'Expert plumbing solutions for your home and business.',
    location: 'Kingston, Jamaica',
  },
  {
    id: 'p2',
    initials: 'SC',
    name: 'Sparkle Clean Home Services',
    category: 'Home Cleaning',
    rating: 4.7,
    reviews: 96,
    description: 'Reliable cleaning services for a spotless home.',
    location: 'Kingston, Jamaica',
  },
  {
    id: 'p3',
    initials: 'EJ',
    name: 'ElectriFix Jamaica',
    category: 'Electrical',
    rating: 4.9,
    reviews: 143,
    description: 'Professional electrical services. Safe. Fast. Reliable.',
    location: 'Kingston, Jamaica',
  },
  {
    id: 'p4',
    initials: 'FH',
    name: 'Fix & Go Handyman',
    category: 'Handyman',
    rating: 4.6,
    reviews: 75,
    description: 'General repairs and installations. We fix it all!',
    location: 'Kingston, Jamaica',
  },
];

export default function FavoritesScreen() {
  const [tab, setTab] = useState('providers');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Text style={styles.headerSubtitle}>Saved providers</Text>
        </View>
        <MaterialIcons name="search" size={24} color="#0f172a" />
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tabButton, tab === 'providers' && styles.tabActive]} onPress={() => setTab('providers')}>
          <Text style={[styles.tabText, tab === 'providers' && styles.tabTextActive]}>Providers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, tab === 'services' && styles.tabActive]} onPress={() => setTab('services')}>
          <Text style={[styles.tabText, tab === 'services' && styles.tabTextActive]}>Services</Text>
        </TouchableOpacity>
      </View>

      {tab === 'providers' ? (
        PROVIDERS.map((provider) => (
          <View key={provider.id} style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{provider.initials}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.mainBody}>
              <Text style={styles.name}>{provider.name}</Text>
              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>{provider.category}</Text>
              </View>
              <Text style={styles.desc}>{provider.description}</Text>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={16} color="#64748b" />
                <Text style={styles.location}>{provider.location}</Text>
              </View>
            </View>
            <View style={styles.sideCol}>
              <TouchableOpacity>
                <MaterialIcons name="favorite" size={24} color="#e11d48" />
              </TouchableOpacity>
              <Text style={styles.rating}>⭐ {provider.rating}</Text>
              <Text style={styles.reviewText}>({provider.reviews} reviews)</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No saved services yet</Text>
          <Text style={styles.emptySub}>Browse categories and tap the heart icon to save services.</Text>
        </View>
      )}

      <View style={styles.footerCard}>
        <MaterialIcons name="bookmark" size={22} color="#2563eb" />
        <View style={styles.footerBody}>
          <Text style={styles.footerTitle}>Keep your favorites handy</Text>
          <Text style={styles.footerSub}>Save providers you trust and book them anytime.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 14, paddingTop: 16, paddingBottom: 26 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  headerTextWrap: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 30, fontWeight: '700', color: '#0f172a' },
  headerSubtitle: { color: '#64748b', marginTop: 2 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#dbe3f0', marginBottom: 12 },
  tabButton: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#2563eb' },
  tabText: { color: '#64748b', fontWeight: '600', fontSize: 16 },
  tabTextActive: { color: '#2563eb' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, flexDirection: 'row', marginBottom: 10 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', marginRight: 12, position: 'relative' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 22 },
  onlineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#22c55e', position: 'absolute', right: 2, bottom: 2, borderWidth: 2, borderColor: '#fff' },
  mainBody: { flex: 1, paddingRight: 8 },
  name: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  categoryChip: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: '#e0e7ff', paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 },
  categoryText: { color: '#1d4ed8', fontSize: 12, fontWeight: '600' },
  desc: { marginTop: 6, color: '#475569', lineHeight: 19 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  location: { color: '#64748b', marginLeft: 4 },
  sideCol: { alignItems: 'flex-end', justifyContent: 'space-between' },
  rating: { marginTop: 4, fontWeight: '700', color: '#0f172a' },
  reviewText: { color: '#64748b', fontSize: 12 },
  bookButton: { marginTop: 8, backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14 },
  bookText: { color: '#fff', fontWeight: '700' },
  emptyState: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 20, marginBottom: 10 },
  emptyTitle: { fontWeight: '700', fontSize: 18, color: '#0f172a', marginBottom: 6 },
  emptySub: { color: '#64748b' },
  footerCard: { marginTop: 6, borderRadius: 14, borderWidth: 1, borderColor: '#dbeafe', backgroundColor: '#eff6ff', padding: 12, flexDirection: 'row', alignItems: 'center' },
  footerBody: { marginLeft: 10, flex: 1 },
  footerTitle: { fontWeight: '700', color: '#1e3a8a' },
  footerSub: { color: '#475569', marginTop: 2 },
});
