import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SERVICES = [
  { id: 's1', name: 'Electricians', price: 'From JMD 6,500' },
  { id: 's2', name: 'Plumbing', price: 'From JMD 5,500' },
  { id: 's3', name: 'AC & Refrigeration Technicians', price: 'From JMD 7,800' },
  { id: 's4', name: 'Appliance Repair Specialists', price: 'From JMD 6,900' },
  { id: 's5', name: 'Housekeepers & Deep Cleaners', price: 'From JMD 4,600' },
  { id: 's6', name: 'Carpet & Upholstery Cleaners', price: 'From JMD 5,900' },
  { id: 's7', name: 'Pest Control Specialists', price: 'From JMD 5,200' },
];

export default function ProviderServicePricingScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Service Pricing</Text>
      <Text style={styles.subtitle}>Manage your service rates and offers.</Text>

      {SERVICES.map((item) => (
        <View key={item.id} style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>Base rate</Text>
          </View>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add New Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardMeta: { color: '#64748b', marginTop: 3 },
  price: { fontWeight: '700', color: '#1d4ed8' },
  button: { marginTop: 10, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
