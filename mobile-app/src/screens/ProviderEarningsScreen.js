import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const PAYOUTS = [
  { id: 'e1', period: 'This Week', amount: 'JMD 42,500' },
  { id: 'e2', period: 'Last Week', amount: 'JMD 37,800' },
  { id: 'e3', period: 'This Month', amount: 'JMD 155,300' },
];

export default function ProviderEarningsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Earnings</Text>
      <Text style={styles.subtitle}>Track revenue and payouts.</Text>

      {PAYOUTS.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.period}</Text>
          <Text style={styles.amount}>{item.amount}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  amount: { color: '#16a34a', fontWeight: '800' },
});
