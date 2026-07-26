import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/colors';

const DEFAULT_QUICK = [1000, 5000, 10000];

export default function AmountInput({
  value,
  onChange,
  currency = 'KES',
  quickAmounts = DEFAULT_QUICK,
}: {
  value: string;
  onChange: (v: string) => void;
  currency?: string;
  quickAmounts?: number[];
}) {
  return (
    <View>
      <Text style={styles.label}>Enter Amount</Text>
      <View style={styles.amountRow}>
        <Text style={styles.currency}>{currency}</Text>
        <TextInput
          style={styles.amountInput}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={colors.textFaint}
          value={value}
          onChangeText={(t) => onChange(t.replace(/[^0-9.]/g, ''))}
        />
      </View>
      <View style={styles.chipsRow}>
        {quickAmounts.map((amt) => (
          <Pressable key={amt} style={styles.chip} onPress={() => onChange(String(amt))}>
            <Text style={styles.chipText}>KES {amt.toLocaleString()}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.chip} onPress={() => onChange('')}>
          <Text style={styles.chipText}>Other</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginBottom: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 18 },
  currency: { fontSize: 22, fontWeight: '700', color: colors.textFaint, marginRight: 8 },
  amountInput: { fontSize: 36, fontWeight: '800', color: colors.text, flex: 1, padding: 0 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
});
