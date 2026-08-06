import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SECTIONS = [
  {
    label: 'Today',
    items: [
      { id: 'n1', icon: 'event-available', title: 'Booking Confirmed', body: 'John\'s Plumbing Services has confirmed your booking for July 2 at 10:00 AM.', time: '10:30 AM' },
      { id: 'n2', icon: 'chat-bubble-outline', title: 'New Message', body: 'John\'s Plumbing Services sent you a message regarding your booking.', time: '10:28 AM' },
      { id: 'n3', icon: 'star-outline', title: 'Review Reminder', body: 'How was your experience with CleanHome Services? Leave a review.', time: '9:15 AM' },
    ],
  },
  {
    label: 'Yesterday',
    items: [
      { id: 'n4', icon: 'schedule', title: 'Upcoming Booking', body: 'You have a booking with ElectriFix Ltd tomorrow at 2:00 PM.', time: '7:45 PM' },
      { id: 'n5', icon: 'local-offer', title: 'Special Offer', body: 'Get 15% off on your next booking. Valid till July 10, 2025.', time: '12:30 PM' },
    ],
  },
  {
    label: 'Earlier',
    items: [
      { id: 'n6', icon: 'shield', title: 'Security Alert', body: 'Your password was changed successfully. If this was not you, contact support.', time: 'Jun 30, 2025' },
    ],
  },
];

export default function NotificationsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
        <Text style={styles.headerTitle}>Notifications</Text>
        <MaterialIcons name="settings" size={24} color="#0f172a" />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}><Text style={[styles.filterText, styles.filterTextActive]}>All</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}><Text style={styles.filterText}>Bookings</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}><Text style={styles.filterText}>Messages</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}><Text style={styles.filterText}>Promotions</Text></TouchableOpacity>
      </View>

      {SECTIONS.map((section) => (
        <View key={section.label} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.label}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconWrap}>
                <MaterialIcons name={item.icon} size={20} color="#2563eb" />
              </View>
              <View style={styles.mainBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardText}>{item.body}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.time}>{item.time}</Text>
                <View style={styles.dot} />
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 14, paddingTop: 16, paddingBottom: 28 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerTitle: { fontSize: 30, fontWeight: '700', color: '#0f172a' },
  filterRow: { flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap', rowGap: 8 },
  filterChip: { borderWidth: 1, borderColor: '#dbe3f0', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, marginRight: 8, backgroundColor: '#fff' },
  filterChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  filterText: { color: '#1f2937', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  section: { marginTop: 8 },
  sectionTitle: { color: '#334155', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, flexDirection: 'row', marginBottom: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  mainBody: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  cardText: { color: '#475569', fontSize: 15, lineHeight: 21 },
  metaCol: { alignItems: 'flex-end', justifyContent: 'space-between', paddingLeft: 10 },
  time: { color: '#64748b', fontSize: 13 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb', marginTop: 14 },
});
