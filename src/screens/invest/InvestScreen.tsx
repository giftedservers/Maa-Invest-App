import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius } from '../../theme/colors';
import { listProducts, buyInvestment } from '../../api/investments';
import { InvestmentProduct } from '../../api/types';
import { formatMoney } from '../../utils/format';
import { ApiError } from '../../api/client';

const RISK_META: Record<string, { color: string; bg: string; icon: any }> = {
  low: { color: colors.primary, bg: colors.primaryLight, icon: 'shield-checkmark' },
  medium: { color: colors.gold, bg: colors.goldSoft, icon: 'trending-up' },
  high: { color: colors.pink, bg: colors.pinkSoft, icon: 'flash' },
};

export default function InvestScreen() {
  const [products, setProducts] = useState<InvestmentProduct[]>([]);
  const [selected, setSelected] = useState<InvestmentProduct | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      listProducts()
        .then((res) => setProducts(res.products))
        .catch(() => {});
    }, [])
  );

  const handleInvest = async () => {
    if (!selected) return;
    const value = parseFloat(amount);
    const min = parseFloat(String(selected.min_investment));
    if (!value || value < min) {
      Alert.alert('Enter an amount', `Minimum investment is ${formatMoney(min)}.`);
      return;
    }
    setLoading(true);
    try {
      await buyInvestment(selected.id, value);
      Alert.alert('Investment successful', `You've invested ${formatMoney(value)} in ${selected.name}.`);
      setSelected(null);
      setAmount('');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not complete the investment.';
      if (e instanceof ApiError && e.upgradeRequired) {
        Alert.alert('Upgrade required', msg);
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={styles.title}>Invest</Text>
        <Text style={styles.subtitle}>Explore investment products</Text>

        {products.length === 0 ? (
          <Card style={{ marginTop: 20 }}>
            <Text style={styles.emptyText}>No products available right now.</Text>
          </Card>
        ) : (
          products.map((p) => {
            const risk = RISK_META[p.risk_level] ?? RISK_META.low;
            return (
              <Card key={p.id} style={{ marginTop: 12 }}>
                <Pressable
                  onPress={() => (p.locked ? Alert.alert('Premium product', 'Upgrade your plan to unlock this.') : setSelected(p))}
                  style={{ opacity: p.locked ? 0.55 : 1 }}
                >
                  <View style={styles.topRow}>
                    <View style={[styles.iconChip, { backgroundColor: risk.bg }]}>
                      <Ionicons name={risk.icon} size={20} color={risk.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>{p.name}</Text>
                      <Text style={styles.productMeta}>
                        {p.risk_level.charAt(0).toUpperCase() + p.risk_level.slice(1)} Risk · From{' '}
                        {formatMoney(p.min_investment)}
                      </Text>
                    </View>
                    {p.locked && <Ionicons name="lock-closed" size={16} color={colors.textFaint} />}
                  </View>
                  <Text style={[styles.rate, { color: risk.color }]}>{p.annual_return_rate}% p.a.</Text>
                </Pressable>
              </Card>
            );
          })
        )}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Invest in {selected?.name}</Text>
            <Text style={styles.modalSub}>
              Minimum {selected ? formatMoney(selected.min_investment) : ''} · {selected?.annual_return_rate}% p.a.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="KES 0.00"
              placeholderTextColor={colors.textFaint}
              keyboardType="numeric"
              value={amount}
              onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
            />
            <PrimaryButton title="Invest Now" onPress={handleInvest} loading={loading} />
            <PrimaryButton title="Cancel" variant="ghost" onPress={() => setSelected(null)} style={{ marginTop: 8 }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  emptyText: { color: colors.textMuted, fontSize: 13 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconChip: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  productMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  rate: { fontSize: 20, fontWeight: '800', marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  modalSub: { fontSize: 12.5, color: colors.textMuted, marginTop: 4, marginBottom: 16 },
  modalInput: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
  },
});
