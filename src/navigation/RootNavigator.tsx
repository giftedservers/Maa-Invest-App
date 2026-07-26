import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import PinSetupScreen from '../screens/auth/PinSetupScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import AddMoneyScreen from '../screens/wallet/AddMoneyScreen';
import WithdrawScreen from '../screens/wallet/WithdrawScreen';
import CreateGoalScreen from '../screens/save/CreateGoalScreen';
import GroupDetailScreen from '../screens/groups/GroupDetailScreen';
import JoinGroupScreen from '../screens/groups/JoinGroupScreen';
import TransactionHistoryScreen from '../screens/history/TransactionHistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Wallet" component={WalletScreen} options={{ presentation: 'card' }} />
      <Stack.Screen name="AddMoney" component={AddMoneyScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Withdraw" component={WithdrawScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="CreateGoal" component={CreateGoalScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="JoinGroup" component={JoinGroupScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { isLoading, isAuthenticated, pinSet } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthStack /> : !pinSet ? <PinSetupScreen /> : <MainStack />}
    </NavigationContainer>
  );
}
