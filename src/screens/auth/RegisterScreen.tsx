import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';
import { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !identity || !password) {
      Alert.alert('Missing details', 'Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms required', 'Please agree to the Terms & Conditions to continue.');
      return;
    }
    const isEmail = identity.includes('@');
    setLoading(true);
    try {
      await signUp({
        full_name: fullName,
        email: isEmail ? identity : `${identity.replace(/\D/g, '')}@maainvest.africa`,
        phone: isEmail ? '' : identity,
        password,
      });
      // RootNavigator automatically swaps to the PIN screen / Main app once authenticated.
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not create account. Try again.';
      Alert.alert('Registration failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Create Account" subtitle="Let's get started" />

        <InputField label="Full Name" placeholder="Enter your full name" value={fullName} onChangeText={setFullName} />
        <InputField
          label="Email or Phone Number"
          placeholder="Enter email or phone number"
          autoCapitalize="none"
          value={identity}
          onChangeText={setIdentity}
        />
        <InputField label="Password" placeholder="Create a password" secure value={password} onChangeText={setPassword} />
        <InputField
          label="Confirm Password"
          placeholder="Confirm your password"
          secure
          value={confirm}
          onChangeText={setConfirm}
        />

        <Pressable style={styles.checkRow} onPress={() => setAgreed((a) => !a)}>
          <View style={[styles.checkbox, agreed && { backgroundColor: colors.primary }]}>
            {agreed && <Ionicons name="checkmark" size={14} color={colors.white} />}
          </View>
          <Text style={styles.checkText}>I agree to the Terms &amp; Conditions and Privacy Policy</Text>
        </Pressable>

        <PrimaryButton title="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: 8 }} />

        <View style={{ flex: 1 }} />

        <View style={styles.bottomRow}>
          <Text style={styles.muted}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  link: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  muted: { color: colors.textMuted, fontSize: 13 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkText: { flex: 1, fontSize: 12.5, color: colors.textMuted, lineHeight: 18 },
});
