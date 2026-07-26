import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenHeader from '../../components/ScreenHeader';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';
import { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn } = useAuth();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identity || !password) {
      Alert.alert('Missing details', 'Enter your email/phone and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(identity, password);
      // RootNavigator automatically swaps to the PIN screen / Main app once authenticated.
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not log in. Try again.';
      Alert.alert('Login failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Welcome Back 👋" subtitle="Log in to your account" />

        <InputField
          label="Email or Phone Number"
          placeholder="Enter email or phone number"
          autoCapitalize="none"
          value={identity}
          onChangeText={setIdentity}
        />
        <InputField
          label="Password"
          placeholder="Enter password"
          secure
          value={password}
          onChangeText={setPassword}
        />
        <Pressable style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
          <Text style={styles.link}>Forgot Password?</Text>
        </Pressable>

        <PrimaryButton title="Log In" onPress={handleLogin} loading={loading} />

        <View style={{ flex: 1 }} />

        <View style={styles.bottomRow}>
          <Text style={styles.muted}>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Sign Up</Text>
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
});
