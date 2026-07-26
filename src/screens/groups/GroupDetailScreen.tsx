import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius } from '../../theme/colors';
import { listGroups, contributeToGroup } from '../../api/groups';
import { Group } from '../../api/types';
import { formatMoney, initials } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';
import { ApiError } from '../../api/client';

type Rt = RouteProp<RootStackParamList, 'GroupDetail'>;

export default function GroupDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<Rt>();
  const { groupId } = route.params;
  const [group, setGroup] = useState<Group | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    listGroups()
      .then((groups) => setGroup(groups.find((g) => g.id === groupId) ?? null))
      .catch(() => {});
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleContribute = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      Alert.alert('Enter an amount', 'Please enter a valid contribution amount.');
      return;
    }
    setLoading(true);
    try {
      await contributeToGroup(groupId, value);
      Alert.alert('Contribution successful', `You contributed ${formatMoney(value)} to ${group?.name}.`);
      setModalVisible(false);
      setAmount('');
      load();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not process the contribution.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const comingSoon = (feature: string) =>
    Alert.alert(feature, `${feature} is coming soon — it isn't wired to the backend yet.`);

  if (!group) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ padding: 20 }}>
          <Text style={{ color: colors.textMuted }}>Loading group…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const saved = parseFloat(String(group.saved_amount)) || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(group.name)}</Text>
              </View>
              <View>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.memberCount}>{group.member_count} Members</Text>
              </View>
            </View>
            <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Total Savings</Text>
              <Text style={styles.statValue}>{formatMoney(saved)}</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>My Share</Text>
              <Text style={styles.statValue}>
                {formatMoney(group.member_count ? saved / group.member_count : 0)}
              </Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <GroupAction icon="add-circle-outline" label="Contribute" onPress={() => setModalVisible(true)} />
            <GroupAction icon="arrow-up-circle-outline" label="Withdraw" onPress={() => comingSoon('Withdrawals')} />
            <GroupAction icon="cash-outline" label="Loan" onPress={() => comingSoon('Group loans')} />
            <GroupAction icon="people-outline" label="Members" onPress={() => comingSoon('Member management')} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card>
          <Text style={styles.emptyText}>
            Contribution history for this group isn't exposed by the API yet — add a `group_activity.php` endpoint
            to surface it here.
          </Text>
        </Card>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Contribute to {group.name}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="KES 0.00"
              placeholderTextColor={colors.textFaint}
              keyboardType="numeric"
              value={amount}
              onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
            />
            <PrimaryButton title="Contribute" onPress={handleContribute} loading={loading} />
            <PrimaryButton
              title="Cancel"
              variant="ghost"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function GroupAction({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable style={{ alignItems: 'center', gap: 6 }} onPress={onPress}>
      <View style={styles.actionCircle}>
        <Ionicons name={icon} size={18} color={colors.white} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerCard: { backgroundColor: colors.primary, borderRadius: 20, padding: 20 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  groupName: { color: colors.white, fontSize: 16, fontWeight: '800' },
  memberCount: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  statValue: { color: colors.white, fontSize: 18, fontWeight: '800', marginTop: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, paddingHorizontal: 6 },
  actionCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { color: colors.white, fontSize: 10.5, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 24, marginBottom: 12 },
  emptyText: { color: colors.textMuted, fontSize: 12.5, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 16 },
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
