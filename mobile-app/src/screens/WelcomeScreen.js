import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';

const logoAsset = require('../../assets/servi img.jpeg');

function ServiGoLogo() {
  const logoUri = logoAsset?.uri || logoAsset?.default || logoAsset;

  if (Platform.OS === 'web') {
    return <img alt="ServiGo logo" src={typeof logoUri === 'string' ? logoUri : ''} style={{ width: 180, height: 180, objectFit: 'contain', marginBottom: 10 }} />;
  }

  return <Image source={logoAsset} style={styles.logo} resizeMode="contain" />;
}

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ServiGoLogo />
      <Text style={styles.subtitle}>Book trusted services with ease.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.primaryText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.secondaryText}>Create account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f7f8fc' },
  logo: { width: 180, height: 180, marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 24, textAlign: 'center' },
  primaryButton: { backgroundColor: '#2563eb', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '100%', marginBottom: 12 },
  secondaryButton: { borderWidth: 1, borderColor: '#cbd5e1', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '100%' },
  primaryText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  secondaryText: { color: '#0f172a', textAlign: 'center', fontWeight: '600' },
});
