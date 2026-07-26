import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { colors, radius } from '../../theme/colors';
import { listGoals } from '../../api/goals';
import { Goal } from '../../api/types';
import { formatMoney } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const GOAL_ICONS: { icon: any; bg: string; color: string }[] = [
  { icon: 'medkit', bg: colors.pinkSoft, color: colors.pink },
  { icon: 'home', bg: colors.tealSoft, color: colors.teal },
  { icon: 'school', bg: colors.goldSoft, color: colors.gold },
  { icon: 'airplane', bg: colors.purpleSoft, color: colors.purple },
  { icon: 'car', bg: colors.primaryLight, color: colors.primary },
];

export default function SaveScreen() {
  const navigation = useNavigation<Nav>();
  const [goals, setGoals] = useState<Goal[]>([]);

  useFocusEffect(
    useCallback(() => {
      listGoals()
        .then(setGoals)
        .catch(() => {});
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Save</Text>
            <Text style={styles.subtitle}>My Savings Goals</Text>
          </View>
          <Pressable style={styles.newGoalBtn} onPress={() => navigation.navigate('CreateGoal')}>
            <Ionicons name="add" size={16} color={colors.primary} />
            <Text style={styles.newGoalText}>New Goal</Text>
          </Pressable>
        </View>

        {goals.length === 0 ? (
          <Card style={{ marginTop: 20 }}>
            <Text style={styles.emptyText}>You haven't created a savings goal yet.</Text>
          </Card>
        ) : (
          goals.map((g, i) => {
            const meta = GOAL_ICONS[i % GOAL_ICONS.length];
            const saved = parseFloat(String(g.saved_amount)) || 0;
            const target = parseFloat(String(g.target_amount)) || 1;
            return (
              <Card key={g.id} style={{ marginTop: 12 }}>
                <View style={styles.goalTop}>
                  <View style={[styles.goalIcon, { backgroundColor: meta.bg }]}>
                    <Ionicons name={meta.icon} size={20} color={meta.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.goalRow}>
                      <Text style={styles.goalName}>{g.name}</Text>
                      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
                    </View>
                    <Text style={styles.goalAmounts}>
                      {formatMoney(saved).replace('KES ', '')} / {formatMoney(target)}
                    </Text>
                  </View>
                </View>
                <ProgressBar progress={saved / target} color={meta.color} />
                {g.deadline && <Text style={styles.goalDeadline}>Target: {g.deadline}</Text>}
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  newGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  newGoalText: { color: colors.primary, fontWeight: '700', fontSize: 12.5 },
  emptyText: { color: colors.textMuted, fontSize: 13 },
  goalTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  goalIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalName: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  goalAmounts: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  goalDeadline: { fontSize: 11.5, color: colors.textFaint, marginTop: 8 },
});
