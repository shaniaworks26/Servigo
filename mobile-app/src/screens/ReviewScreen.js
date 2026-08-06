import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function ReviewScreen() {
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Review</Text>
      <Text style={styles.subtitle}>Share your experience with this provider.</Text>

      <Text style={styles.label}>Rating (1-5)</Text>
      <TextInput value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />

      <Text style={styles.label}>Comment</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        multiline
        style={[styles.input, styles.commentInput]}
        placeholder="Tell other customers about the service quality"
      />

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryText}>Submit Review</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 4, marginBottom: 14, color: '#64748b' },
  label: { color: '#334155', fontWeight: '600', marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#dbe4f0', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  commentInput: { minHeight: 120, textAlignVertical: 'top' },
  primaryButton: { marginTop: 16, backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 13 },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
