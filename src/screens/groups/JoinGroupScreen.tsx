import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, radius } from '../../theme/colors';
import { joinGroup } from '../../api/groups';
import { ApiError } from '../../api/client';

export default function JoinGroupScreen() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      Alert.alert('Enter a code', 'Please enter the group invite code.');
      return;
    }
    setLoading(true);
    try {
      const res = await joinGroup(code.trim());
      Alert.alert('Joined!', `You're now a member of "${res.group.name}".`);
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not join that group. Check the code and try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={{ padding: 20 }}>
        <ScreenHeader title="Join a Group" subtitle="Enter the invite code shared with you" />
        <TextInput
          style={styles.input}
          placeholder="e.g. CHAMA-7F2K"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
        />
        <PrimaryButton title="Join Group" onPress={handleJoin} loading={loading} style={{ marginTop: 20 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: colors.text,
  },
});
