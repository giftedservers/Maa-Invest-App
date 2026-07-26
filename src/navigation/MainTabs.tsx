import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { MainTabParamList } from './types';

import HomeScreen from '../screens/home/HomeScreen';
import InvestScreen from '../screens/invest/InvestScreen';
import SaveScreen from '../screens/save/SaveScreen';
import GroupsScreen from '../screens/groups/GroupsScreen';
import MoreScreen from '../screens/profile/MoreScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { active: any; inactive: any; label: string }> = {
  HomeTab: { active: 'home', inactive: 'home-outline', label: 'Home' },
  InvestTab: { active: 'trending-up', inactive: 'trending-up-outline', label: 'Invest' },
  SaveTab: { active: 'bookmark', inactive: 'bookmark-outline', label: 'Save' },
  GroupsTab: { active: 'people', inactive: 'people-outline', label: 'Groups' },
  MoreTab: { active: 'grid', inactive: 'grid-outline', label: 'More' },
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6, borderTopColor: colors.border },
        tabBarIcon: ({ focused, color, size }) => {
          const meta = ICONS[route.name as keyof MainTabParamList];
          return <Ionicons name={focused ? meta.active : meta.inactive} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="InvestTab" component={InvestScreen} options={{ title: 'Invest' }} />
      <Tab.Screen name="SaveTab" component={SaveScreen} options={{ title: 'Save' }} />
      <Tab.Screen name="GroupsTab" component={GroupsScreen} options={{ title: 'Groups' }} />
      <Tab.Screen name="MoreTab" component={MoreScreen} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
}
