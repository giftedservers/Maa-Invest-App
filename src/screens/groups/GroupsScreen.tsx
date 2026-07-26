import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Card from '../../components/Card';
import { colors, radius } from '../../theme/colors';
import { listGroups } from '../../api/groups';
import { Group } from '../../api/types';
import { formatMoney, initials } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS = ['All', 'Chamas', 'Investment', 'Community'] as const;

export default function GroupsScreen() {
  const navigation = useNavigation<Nav>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]>('All');
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      listGroups()
        .then(setGroups)
        .catch(() => {});
    }, [])
  );

  const filtered = groups.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Join a Group</Text>
            <Text style={styles.subtitle}>Discover &amp; join savings groups</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={colors.textFaint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor={colors.textFaint}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.tabsRow}>
          {TABS.map((t) => (
            <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.joinByCodeRow} onPress={() => navigation.navigate('JoinGroup')}>
          <Ionicons name="key-outline" size={16} color={colors.primary} />
          <Text style={styles.joinByCodeText}>Have an invite code? Join directly</Text>
        </Pressable>

        {filtered.length === 0 ? (
          <Card style={{ marginTop: 16 }}>
            <Text style={styles.emptyText}>No groups yet. Join one with an invite code or create your own.</Text>
          </Card>
        ) : (
          filtered.map((g) => (
            <Card key={g.id} style={{ marginTop: 12 }}>
              <Pressable style={styles.groupRow} onPress={() => navigation.navigate('GroupDetail', { groupId: g.id })}>
                <View style={styles.groupAvatar}>
                  <Text style={styles.groupAvatarText}>{initials(g.name)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.groupName}>{g.name}</Text>
                  <Text style={styles.groupMeta}>
                    {g.member_count} members · {g.my_role}
                  </Text>
                  <Text style={styles.groupSaved}>Saved {formatMoney(g.saved_amount)}</Text>
                </View>
                <View style={styles.openBtn}>
                  <Text style={styles.openBtnText}>Open</Text>
                </View>
              </Pressable>
            </Card>
          ))
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 44,
    marginTop: 16,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  tabsRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 12.5, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.white },
  joinByCodeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  joinByCodeText: { fontSize: 12.5, fontWeight: '600', color: colors.primary },
  emptyText: { color: colors.textMuted, fontSize: 13 },
  groupRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  groupAvatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupAvatarText: { color: colors.primary, fontWeight: '800', fontSize: 14 },
  groupName: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  groupMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  groupSaved: { fontSize: 12.5, color: colors.primary, fontWeight: '700', marginTop: 2 },
  openBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill },
  openBtnText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
});
