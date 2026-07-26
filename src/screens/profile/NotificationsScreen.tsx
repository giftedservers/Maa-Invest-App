import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import Card from '../../components/Card';
import IconChip from '../../components/IconChip';
import { colors } from '../../theme/colors';
import { listNotifications, markNotificationsRead } from '../../api/notifications';
import { formatDateTime } from '../../utils/format';

export default function NotificationsScreen() {
  const [items, setItems] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      listNotifications()
        .then((res) => {
          setItems(res.notifications);
          if (res.unread_count > 0) markNotificationsRead().catch(() => {});
        })
        .catch(() => {});
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenHeader title="Notifications" />
        {items.length === 0 ? (
          <Card>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>You're all caught up.</Text>
          </Card>
        ) : (
          items.map((n) => (
            <Card key={n.id} style={{ marginBottom: 10 }}>
              <View style={styles.row}>
                <IconChip bg={colors.primaryLight}>
                  <Ionicons name="notifications" size={18} color={colors.primary} />
                </IconChip>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{n.title}</Text>
                  <Text style={styles.message}>{n.message}</Text>
                  <Text style={styles.date}>{formatDateTime(n.created_at)}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  row: { flexDirection: 'row', gap: 12 },
  title: { fontSize: 14, fontWeight: '700', color: colors.text },
  message: { fontSize: 12.5, color: colors.textMuted, marginTop: 3, lineHeight: 18 },
  date: { fontSize: 11, color: colors.textFaint, marginTop: 6 },
});
