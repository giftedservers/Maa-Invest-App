import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { colors, radius } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'fingerprint', '0', 'delete'];

export default function PinSetupScreen() {
  const { markPinSet } = useAuth();
  const [pin, setPin] = useState('');

  const handleKey = async (key: string) => {
    if (key === 'delete') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === 'fingerprint') return;
    if (pin.length >= 4) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 4) {
      await SecureStore.setItemAsync('maa_invest_pin', next);
      setTimeout(() => markPinSet(), 200);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set up your PIN</Text>
        <Text style={styles.subtitle}>Secure your account</Text>
      </View>

      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i < pin.length && { backgroundColor: colors.primary }]} />
        ))}
      </View>

      <View style={styles.keypad}>
        {KEYS.map((key) => (
          <Pressable key={key} style={styles.key} onPress={() => handleKey(key)}>
            {key === 'fingerprint' ? (
              <Ionicons name="finger-print" size={24} color={colors.textMuted} />
            ) : key === 'delete' ? (
              <Ionicons name="backspace-outline" size={22} color={colors.textMuted} />
            ) : (
              <Text style={styles.keyText}>{key}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 28, paddingTop: 20 },
  header: { marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 56 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: colors.border },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  key: {
    width: '30%',
    aspectRatio: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  keyText: { fontSize: 24, fontWeight: '600', color: colors.text },
});
