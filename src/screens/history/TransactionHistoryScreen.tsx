import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import IconChip from '../../components/IconChip';
import { colors } from '../../theme/colors';
import { fetchTransactions } from '../../api/wallet';
import { Transaction } from '../../api/types';
import { formatMoney, formatDateTime } from '../../utils/format';

const TX_META: Record<string, { icon: any; bg: string; color: string }> = {
  deposit: { icon: 'arrow-down', bg: colors.primaryLight, color: colors.primary },
  withdrawal: { icon: 'arrow-up', bg: colors.pinkSoft, color: colors.pink },
  goal_allocation: { icon: 'flag', bg: colors.tealSoft, color: colors.teal },
  investment: { icon: 'trending-up', bg: colors.purpleSoft, color: colors.purple },
};

export default function TransactionHistoryScreen() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback((p: number) => {
    setLoading(true);
    fetchTransactions(p)
      .then((res) => {
        setTxs((prev) => (p === 1 ? res.transactions : [...prev, ...res.transactions]));
        setTotalPages(res.total_pages);
        setPage(p);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(1);
    }, [load])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <ScreenHeader title="Transaction History" showBack />
      </View>
      <FlatList
        data={txs}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40 }}
        onEndReached={() => {
          if (!loading && page < totalPages) load(page + 1);
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          !loading ? (
            <Card>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>No transactions yet.</Text>
            </Card>
          ) : null
        }
        ListFooterComponent={loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: 12 }} /> : null}
        renderItem={({ item: tx }) => {
          const meta = TX_META[tx.type] ?? { icon: 'swap-horizontal', bg: colors.bg, color: colors.textMuted };
          const isCredit = tx.type === 'deposit';
          return (
            <Card style={{ marginBottom: 10 }}>
              <View style={styles.txRow}>
                <View style={styles.txLeft}>
                  <IconChip bg={meta.bg}>
                    <Ionicons name={meta.icon} size={18} color={meta.color} />
                  </IconChip>
                  <View style={{ flex: 1 }}>
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
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
  txDesc: { fontSize: 13.5, fontWeight: '700', color: colors.text },
  txDate: { fontSize: 11.5, color: colors.textFaint, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '800' },
});
