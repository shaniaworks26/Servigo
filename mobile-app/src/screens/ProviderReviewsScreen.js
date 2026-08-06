import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const REVIEWS = [
  { id: 'r1', name: 'Shania Chin', rating: 5, body: 'Excellent service and very punctual.' },
  { id: 'r2', name: 'Kevin James', rating: 4, body: 'Good work. Communication was clear.' },
];

export default function ProviderReviewsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <Text style={styles.subtitle}>See customer feedback and ratings.</Text>

      {REVIEWS.map((review) => (
        <View key={review.id} style={styles.card}>
          <Text style={styles.cardTitle}>{review.name}</Text>
          <Text style={styles.rating}>⭐ {review.rating}.0</Text>
          <Text style={styles.cardBody}>{review.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', padding: 14, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  rating: { color: '#1d4ed8', marginTop: 4, fontWeight: '700' },
  cardBody: { color: '#475569', marginTop: 8 },
});
