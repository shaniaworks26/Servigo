import React from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function ProviderHelpSupportScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help Support</Text>
      <Text style={styles.subtitle}>Reach out to support for account and job issues.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Subject</Text>
        <TextInput style={styles.input} placeholder="Describe your issue" />
        <Text style={styles.label}>Message</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Type your message" multiline />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Support Request</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Support channels</Text>
        <Text style={styles.infoText}>Email: support@servigo.app</Text>
        <Text style={styles.infoText}>Phone: +1 (876) 000-0000</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14 },
  label: { color: '#334155', fontWeight: '600', marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#dbe4f0', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  button: { marginTop: 14, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  infoCard: { marginTop: 12, backgroundColor: '#eff6ff', borderRadius: 14, borderWidth: 1, borderColor: '#dbeafe', padding: 12 },
  infoTitle: { fontWeight: '700', color: '#1e3a8a', marginBottom: 6 },
  infoText: { color: '#334155', marginTop: 2 },
});
