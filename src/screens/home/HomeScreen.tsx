import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Card from '../../components/Card';
import LineChart from '../../components/LineChart';
import IconChip from '../../components/IconChip';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { fetchDashboard } from '../../api/dashboard';
import { listHoldings } from '../../api/investments';
import { DashboardData, Holding } from '../../api/types';
import { formatMoney, initials } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [dash, hold] = await Promise.all([fetchDashboard(), listHoldings().catch(() => null)]);
      setData(dash);
      if (hold) setHoldings(hold.holdings);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? 'Could not load your dashboard.');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const portfolioTotal = (data?.total_saved ?? 0) + (data?.investment_balance ?? 0);
  // synthetic trend so the chart always has something to show
  const trend = [0.7, 0.75, 0.82, 0.78, 0.9, 1].map((f) => Math.max(portfolioTotal * f, 1));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{user?.full_name?.split(' ')[0] ?? 'there'} 👋</Text>
          </View>
          <View style={styles.headerIcons}>
            <Pressable style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </Pressable>
            <Pressable style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.avatarText}>{initials(user?.full_name ?? 'U')}</Text>
            </Pressable>
          </View>
        </View>

        {error && (
          <Card style={{ marginTop: 16, backgroundColor: colors.pinkSoft, borderColor: colors.pink }}>
            <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>
          </Card>
        )}

        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
          <Text style={styles.portfolioValue}>{formatMoney(portfolioTotal)}</Text>
          <View style={styles.trendRow}>
            <Ionicons name="trending-up" size={14} color={colors.leaf} />
            <Text style={styles.trendText}>+18.6% vs last month</Text>
          </View>
        </View>

        <Card style={{ marginTop: 16 }}>
          <LineChart data={trend} labels={MONTH_LABELS} width={310} height={120} />
        </Card>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>My Investments</Text>
          <Text style={styles.seeAll}>See all</Text>
        </View>

        {holdings.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No investments yet. Explore products in the Invest tab.</Text>
          </Card>
        ) : (
          holdings.slice(0, 4).map((h) => (
            <Card key={h.id} style={{ marginBottom: 10 }}>
              <View style={styles.holdingRow}>
                <View>
                  <Text style={styles.holdingName}>{h.product_name}</Text>
                  <Text style={styles.holdingValue}>{formatMoney(h.current_value)}</Text>
                </View>
                <View style={styles.returnChip}>
                  <Text style={styles.returnChipText}>+{h.annual_return_rate}%</Text>
                </View>
              </View>
            </Card>
          ))
        )}

        <View style={styles.quickActions}>
          {[
            { icon: 'add-circle', label: 'Add Money', action: () => navigation.navigate('AddMoney') },
            { icon: 'bookmark', label: 'Save', action: () => navigation.navigate('CreateGoal') },
            { icon: 'swap-vertical', label: 'Withdraw', action: () => navigation.navigate('Withdraw') },
            { icon: 'grid', label: 'More', action: () => navigation.navigate('Profile') },
          ].map((a) => (
            <Pressable key={a.label} style={styles.quickAction} onPress={a.action}>
              <IconChip bg={colors.primaryLight} size={48}>
                <Ionicons name={a.icon as any} size={22} color={colors.primary} />
              </IconChip>
              <Text style={styles.quickActionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 13, color: colors.textMuted },
  name: { fontSize: 19, fontWeight: '800', color: colors.text, marginTop: 2 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  portfolioCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginTop: 18,
  },
  portfolioLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  portfolioValue: { color: colors.white, fontSize: 30, fontWeight: '800', marginTop: 8 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  trendText: { color: colors.leaf, fontSize: 12, fontWeight: '700' },
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
  holdingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  holdingName: { fontSize: 14, fontWeight: '700', color: colors.text },
  holdingValue: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 4 },
  returnChip: { backgroundColor: colors.primaryLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  returnChipText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  quickAction: { alignItems: 'center', gap: 8, width: '23%' },
  quickActionLabel: { fontSize: 11, fontWeight: '600', color: colors.text, textAlign: 'center' },
});
