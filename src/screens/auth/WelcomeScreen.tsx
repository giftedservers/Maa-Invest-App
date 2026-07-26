import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.logoMark}>
          <Ionicons name="trending-up" size={30} color={colors.white} />
        </View>
        <Text style={styles.brand}>
          MAA <Text style={{ color: colors.primary }}>INVEST</Text>
        </Text>
        <Text style={styles.tagline}>Together. Grow. Prosper.</Text>

        <Text style={styles.headline}>Smart Investing.{'\n'}Secure Future.</Text>
        <Text style={styles.sub}>Save, invest and grow your wealth with MAA INVEST.</Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton title="Create Account" onPress={() => navigation.navigate('Register')} />
        <PrimaryButton
          title="Log In"
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 12 }}
        />
        <View style={styles.licensedRow}>
          <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
          <Text style={styles.licensedText}>Licensed &amp; Regulated by CMA</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 28 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoMark: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  brand: { fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: 0.5 },
  tagline: { fontSize: 12, color: colors.textMuted, marginTop: 2, marginBottom: 40 },
  headline: { fontSize: 28, fontWeight: '800', color: colors.text, textAlign: 'center', lineHeight: 34 },
  sub: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  footer: { paddingBottom: 24 },
  licensedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 18, gap: 6 },
  licensedText: { fontSize: 12, color: colors.textMuted },
});
