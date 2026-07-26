import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import AmountInput from '../../components/AmountInput';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius } from '../../theme/colors';
import { withdraw, fetchWalletBalance } from '../../api/wallet';
import { ApiError } from '../../api/client';
import { formatMoney } from '../../utils/format';

const METHODS = [
  { key: 'mpesa', icon: 'phone-portrait-outline', label: 'M-Pesa', tag: 'Instant withdrawal' },
  { key: 'bank', icon: 'business-outline', label: 'Bank Transfer', tag: '1-3 business days' },
] as const;

export default function WithdrawScreen() {
  const navigation = useNavigation();
  const [method, setMethod] = useState<'mpesa' | 'bank'>('mpesa');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchWalletBalance()
        .then((w) => setBalance(parseFloat(String(w.balance))))
        .catch(() => {});
    }, [])
  );

  const handleContinue = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      Alert.alert('Enter an amount', 'Please enter a valid amount to withdraw.');
      return;
    }
    if (value > balance) {
      Alert.alert('Insufficient balance', 'That amount is more than your available wallet balance.');
      return;
    }
    setLoading(true);
    try {
      const res = await withdraw(value, method);
      Alert.alert('Withdrawal initiated', `Your withdrawal (ref ${res.reference}) is being processed.`);
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not process the withdrawal. Try again.';
      Alert.alert('Withdrawal failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenHeader title="Withdraw" subtitle="Choose withdrawal method" />

        {METHODS.map((m) => (
          <Pressable key={m.key} style={styles.methodRow} onPress={() => setMethod(m.key)}>
            <View style={styles.methodIcon}>
              <Ionicons name={m.icon as any} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodTag}>{m.tag}</Text>
            </View>
            {method === m.key ? (
              <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
            ) : (
              <View style={styles.radio} />
            )}
          </Pressable>
        ))}

        <View style={{ marginTop: 20 }}>
          <AmountInput value={amount} onChange={setAmount} />
        </View>

        <Text style={styles.balanceNote}>Available Balance: {formatMoney(balance)}</Text>

        <PrimaryButton title="Continue" onPress={handleContinue} loading={loading} style={{ marginTop: 20 }} />
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
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  methodTag: { fontSize: 11.5, color: colors.textMuted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.border },
  balanceNote: { fontSize: 12.5, color: colors.textMuted, marginTop: 8 },
});
