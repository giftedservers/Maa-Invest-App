import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ROWS: { icon: any; label: string; sub: string }[] = [
  { icon: 'ribbon-outline', label: 'Become a Treasurer', sub: 'For your chama' },
  { icon: 'people-outline', label: 'Refer & Earn', sub: 'Invite friends and earn' },
  { icon: 'help-buoy-outline', label: 'Help Center', sub: 'Get support' },
  { icon: 'star-outline', label: 'Rate Our App', sub: 'We value your feedback' },
  { icon: 'information-circle-outline', label: 'About MAA INVEST', sub: 'Learn more about us' },
];

export default function MoreScreen() {
  const navigation = useNavigation<Nav>();
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={styles.title}>More</Text>

        <View style={styles.list}>
          <Pressable style={[styles.row, styles.rowBorder]} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={20} color={colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>My Profile</Text>
              <Text style={styles.rowSub}>Account details & settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
          </Pressable>

          {ROWS.map((row, i) => (
            <Pressable
              key={row.label}
              style={[styles.row, i !== ROWS.length - 1 && styles.rowBorder]}
              onPress={() => Alert.alert(row.label, 'Coming soon.')}
            >
              <Ionicons name={row.icon} size={20} color={colors.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowSub}>{row.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 20 },
  list: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  rowSub: { fontSize: 11.5, color: colors.textMuted, marginTop: 1 },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.lg,
  },
  logoutText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
});
