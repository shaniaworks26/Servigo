import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const THREAD = [
  { id: 'm1', incoming: true, text: 'Hi, I wanted to confirm my booking for tomorrow.', time: '10:30 AM' },
  { id: 'm2', incoming: false, text: 'Hello Shania! Yes, your booking is confirmed for tomorrow at 10:00 AM.', time: '10:31 AM' },
  { id: 'm3', incoming: true, text: 'Great! Will the provider bring all the necessary tools and equipment?', time: '10:32 AM' },
  { id: 'm4', incoming: false, text: 'Yes, the provider will bring everything needed for the service.', time: '10:33 AM' },
  { id: 'm5', incoming: true, text: 'Perfect, thank you!', time: '10:34 AM' },
  { id: 'm6', incoming: false, text: "You're welcome! If you need anything else, feel free to let us know.", time: '10:35 AM' },
];

export default function MessagesScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
        <Text style={styles.headerTitle}>Chat</Text>
        <MaterialIcons name="more-vert" size={22} color="#0f172a" />
      </View>

      <View style={styles.roleTabs}>
        <TouchableOpacity style={[styles.rolePill, styles.rolePillActive]}><Text style={[styles.roleText, styles.roleTextActive]}>Customer</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rolePill}><Text style={styles.roleText}>Provider</Text></TouchableOpacity>
        <TouchableOpacity style={styles.rolePill}><Text style={styles.roleText}>AI Assistant</Text></TouchableOpacity>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>SC</Text></View>
        <View style={styles.userMeta}>
          <Text style={styles.userName}>Shania Chin</Text>
          <Text style={styles.userStatus}>Online</Text>
        </View>
        <TouchableOpacity style={styles.circleAction}><MaterialIcons name="call" size={18} color="#2563eb" /></TouchableOpacity>
        <TouchableOpacity style={styles.circleAction}><MaterialIcons name="videocam" size={18} color="#2563eb" /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.threadWrap}>
        <Text style={styles.todayBadge}>Today</Text>
        {THREAD.map((item) => (
          <View key={item.id} style={[styles.bubble, item.incoming ? styles.incomingBubble : styles.outgoingBubble]}>
            <Text style={[styles.bubbleText, item.incoming ? styles.incomingText : styles.outgoingText]}>{item.text}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.composer}>
        <TouchableOpacity style={styles.attach}><MaterialIcons name="attachment" size={22} color="#2563eb" /></TouchableOpacity>
        <TextInput placeholder="Type a message..." placeholderTextColor="#94a3b8" style={styles.input} />
        <TouchableOpacity style={styles.send}><MaterialIcons name="send" size={20} color="#fff" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10 },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#0f172a' },
  roleTabs: { flexDirection: 'row', marginHorizontal: 14, borderWidth: 1, borderColor: '#dbe7ff', borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff' },
  rolePill: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#edf2fa' },
  rolePillActive: { backgroundColor: '#eef4ff' },
  roleText: { color: '#1f2937', fontWeight: '600' },
  roleTextActive: { color: '#2563eb' },
  userCard: { marginTop: 12, marginHorizontal: 14, backgroundColor: '#fff', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5eaf3' },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  userMeta: { flex: 1, marginLeft: 10 },
  userName: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  userStatus: { color: '#16a34a', marginTop: 2 },
  circleAction: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#dbe7ff', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  threadWrap: { paddingHorizontal: 14, paddingVertical: 12, paddingBottom: 20 },
  todayBadge: { alignSelf: 'center', backgroundColor: '#e2e8f0', color: '#64748b', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginBottom: 10 },
  bubble: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10 },
  incomingBubble: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9' },
  outgoingBubble: { alignSelf: 'flex-end', backgroundColor: '#dbeafe' },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  incomingText: { color: '#0f172a' },
  outgoingText: { color: '#1e3a8a' },
  time: { marginTop: 6, fontSize: 12, color: '#64748b' },
  composer: { margin: 12, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#dbe3f0', padding: 8, flexDirection: 'row', alignItems: 'center' },
  attach: { paddingHorizontal: 8 },
  input: { flex: 1, fontSize: 15, color: '#0f172a', paddingVertical: 8 },
  send: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
});
