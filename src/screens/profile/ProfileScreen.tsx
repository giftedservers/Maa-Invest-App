import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import { colors, radius } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/format';

const ROWS: { icon: any; label: string; badge?: string }[] = [
  { icon: 'person-outline', label: 'Personal Information' },
  { icon: 'shield-checkmark-outline', label: 'KYC Verification', badge: 'kyc_status' },
  { icon: 'lock-closed-outline', label: 'Security' },
  { icon: 'business-outline', label: 'Bank Accounts' },
  { icon: 'notifications-outline', label: 'Notification Settings' },
  { icon: 'help-circle-outline', label: 'Help & Support' },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenHeader title="Profile" />

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user?.full_name ?? 'U')}</Text>
          </View>
          <View>
            <Text style={styles.name}>{user?.full_name}</Text>
            <Text style={styles.contact}>
              {user?.phone} · {user?.email}
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          {ROWS.map((row, i) => (
            <Pressable key={row.label} style={[styles.row, i !== ROWS.length - 1 && styles.rowBorder]}>
              <Ionicons name={row.icon} size={19} color={colors.textMuted} />
              <Text style={styles.rowLabel}>{row.label}</Text>
              {row.badge === 'kyc_status' ? (
                <Text
                  style={[
                    styles.kycBadge,
                    { color: user?.kyc_status === 'verified' ? colors.primary : colors.gold },
                  ]}
                >
                  {user?.kyc_status ?? 'pending'}
                </Text>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 18 },
  name: { fontSize: 16, fontWeight: '800', color: colors.text },
  contact: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },
  list: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  kycBadge: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
});
