import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius } from '../../theme/colors';
import { createGoal } from '../../api/goals';
import { ApiError } from '../../api/client';

const ICONS: { key: string; icon: any; bg: string; color: string }[] = [
  { key: 'emergency', icon: 'medkit', bg: colors.pinkSoft, color: colors.pink },
  { key: 'home', icon: 'home', bg: colors.tealSoft, color: colors.teal },
  { key: 'school', icon: 'school', bg: colors.goldSoft, color: colors.gold },
  { key: 'travel', icon: 'airplane', bg: colors.purpleSoft, color: colors.purple },
  { key: 'family', icon: 'people', bg: colors.primaryLight, color: colors.primary },
];

export default function CreateGoalScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState(ICONS[0].key);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const amt = parseFloat(target);
    if (!name || !amt || amt <= 0) {
      Alert.alert('Missing details', 'Give your goal a name and a target amount.');
      return;
    }
    setLoading(true);
    try {
      await createGoal({ name, target_amount: amt, deadline: deadline || undefined });
      Alert.alert('Goal created 🎉', `"${name}" is ready — fund it any time from your Save tab.`);
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not create the goal. Try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <ScreenHeader title="Create Goal" subtitle="Let's achieve your target" />

        <Text style={styles.label}>Goal Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Emergency Fund"
          placeholderTextColor={colors.textFaint}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Target Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="KES 0.00"
          placeholderTextColor={colors.textFaint}
          keyboardType="numeric"
          value={target}
          onChangeText={(t) => setTarget(t.replace(/[^0-9.]/g, ''))}
        />

        <Text style={styles.label}>Target Date</Text>
        <View style={styles.dateRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textFaint}
            value={deadline}
            onChangeText={setDeadline}
          />
          <Ionicons name="calendar-outline" size={20} color={colors.textMuted} style={{ marginLeft: -36 }} />
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>Icon</Text>
        <View style={styles.iconRow}>
          {ICONS.map((i) => (
            <Pressable
              key={i.key}
              style={[styles.iconOption, { backgroundColor: i.bg }, icon === i.key && styles.iconOptionActive]}
              onPress={() => setIcon(i.key)}
            >
              <Ionicons name={i.icon} size={20} color={i.color} />
            </Pressable>
          ))}
        </View>

        <PrimaryButton title="Create Goal" onPress={handleCreate} loading={loading} style={{ marginTop: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: colors.text,
    marginBottom: 18,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  iconRow: { flexDirection: 'row', gap: 12 },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionActive: { borderColor: colors.primary },
});
