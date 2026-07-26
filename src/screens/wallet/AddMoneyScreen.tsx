import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import AmountInput from '../../components/AmountInput';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius } from '../../theme/colors';
import { deposit } from '../../api/wallet';
import { ApiError } from '../../api/client';

const METHODS = [
  { key: 'mpesa', icon: 'phone-portrait-outline', label: 'M-Pesa', tag: 'Recommended', color: colors.leaf },
  { key: 'bank', icon: 'business-outline', label: 'Bank Transfer', tag: null, color: colors.teal },
  { key: 'card', icon: 'card-outline', label: 'Debit / Credit Card', tag: null, color: colors.purple },
] as const;

export default function AddMoneyScreen() {
  const navigation = useNavigation();
  const [method, setMethod] = useState<'mpesa' | 'bank' | 'card'>('mpesa');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      Alert.alert('Enter an amount', 'Please enter a valid amount to add.');
      return;
    }
    setLoading(true);
    try {
      const res = await deposit(value, method);
      Alert.alert(
        'Payment initiated',
        method === 'mpesa'
          ? 'Check your phone and enter your M-Pesa PIN to complete the deposit.'
          : `Your ${method} payment (ref ${res.reference}) is being processed.`
      );
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not start the deposit. Try again.';
      Alert.alert('Deposit failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenHeader title="Add Money" subtitle="Choose deposit method" />

        {METHODS.map((m) => (
          <Pressable key={m.key} style={styles.methodRow} onPress={() => setMethod(m.key)}>
            <View style={[styles.methodIcon, { backgroundColor: m.color + '22' }]}>
              <Ionicons name={m.icon as any} size={20} color={m.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              {m.tag && <Text style={styles.methodTag}>{m.tag}</Text>}
            </View>
            <View style={[styles.radio, method === m.key && styles.radioActive]}>
              {method === m.key && <View style={styles.radioDot} />}
            </View>
          </Pressable>
        ))}

        <View style={{ marginTop: 20 }}>
          <AmountInput value={amount} onChange={setAmount} />
        </View>

        <PrimaryButton title="Continue" onPress={handleContinue} loading={loading} style={{ marginTop: 28 }} />

        <Text style={styles.footerNote}>Secure payment powered by M-Pesa</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  methodIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  methodTag: { fontSize: 11, color: colors.primary, fontWeight: '700', marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  footerNote: { textAlign: 'center', color: colors.textFaint, fontSize: 12, marginTop: 16 },
});
