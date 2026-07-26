import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import IconChip from '../../components/IconChip';
import { colors } from '../../theme/colors';
import { fetchWalletBalance, fetchTransactions } from '../../api/wallet';
import { Transaction } from '../../api/types';
import { formatMoney, formatDateTime } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TX_META: Record<string, { icon: any; bg: string; color: string }> = {
  deposit: { icon: 'arrow-down', bg: colors.primaryLight, color: colors.primary },
  withdrawal: { icon: 'arrow-up', bg: colors.pinkSoft, color: colors.pink },
  goal_allocation: { icon: 'flag', bg: colors.tealSoft, color: colors.teal },
  investment: { icon: 'trending-up', bg: colors.purpleSoft, color: colors.purple },
};

export default function WalletScreen() {
  const navigation = useNavigation<Nav>();
  const [balance, setBalance] = useState<number>(0);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [hidden, setHidden] = useState(false);

  const load = useCallback(async () => {
    try {
      const [w, t] = await Promise.all([fetchWalletBalance(), fetchTransactions(1)]);
      setBalance(parseFloat(String(w.balance)));
      setTxs(t.transactions);
    } catch {
      // handled inline via empty states
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenHeader title="Wallet" showBack={false} />

        <View style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Pressable onPress={() => setHidden((h) => !h)}>
              <Ionicons name={hidden ? 'eye-off' : 'eye'} size={18} color="rgba(255,255,255,0.85)" />
            </Pressable>
          </View>
          <Text style={styles.balanceValue}>{hidden ? 'KES ••••••' : formatMoney(balance)}</Text>

          <View style={styles.actionsRow}>
            <WalletAction icon="add" label="Add Money" onPress={() => navigation.navigate('AddMoney')} />
            <WalletAction icon="arrow-up-circle-outline" label="Withdraw" onPress={() => navigation.navigate('Withdraw')} />
            <WalletAction icon="time-outline" label="History" onPress={() => navigation.navigate('TransactionHistory')} />
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable onPress={() => navigation.navigate('TransactionHistory')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {txs.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No transactions yet.</Text>
          </Card>
        ) : (
          txs.slice(0, 8).map((tx) => {
            const meta = TX_META[tx.type] ?? { icon: 'swap-horizontal', bg: colors.bg, color: colors.textMuted };
            const isCredit = tx.type === 'deposit';
            return (
              <Card key={tx.id} style={{ marginBottom: 10 }}>
                <View style={styles.txRow}>
                  <View style={styles.txLeft}>
                    <IconChip bg={meta.bg}>
                      <Ionicons name={meta.icon} size={18} color={meta.color} />
                    </IconChip>
                    <View>
                      <Text style={styles.txDesc} numberOfLines={1}>
                        {tx.description || tx.type}
                      </Text>
                      <Text style={styles.txDate}>{formatDateTime(tx.created_at)}</Text>
                    </View>
                  </View>
                  <Text style={[styles.txAmount, { color: isCredit ? colors.primary : colors.danger }]}>
                    {isCredit ? '+' : '-'}
                    {formatMoney(tx.amount).replace('KES ', '')}
                  </Text>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function WalletAction({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable style={waStyles.wrap} onPress={onPress}>
      <View style={waStyles.circle}>
        <Ionicons name={icon} size={20} color={colors.white} />
      </View>
      <Text style={waStyles.label}>{label}</Text>
    </Pressable>
  );
}

const waStyles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 6 },
  circle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: colors.white, fontSize: 11, fontWeight: '600' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  balanceCard: { backgroundColor: colors.purple, borderRadius: 20, padding: 20, marginTop: 4 },
  balanceTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  balanceValue: { color: colors.white, fontSize: 28, fontWeight: '800', marginTop: 8 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, paddingHorizontal: 10 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  seeAll: { fontSize: 13, fontWeight: '600', color: colors.primary },
  emptyText: { color: colors.textMuted, fontSize: 13 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  txDesc: { fontSize: 13.5, fontWeight: '700', color: colors.text, maxWidth: 180 },
  txDate: { fontSize: 11.5, color: colors.textFaint, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '800' },
});
