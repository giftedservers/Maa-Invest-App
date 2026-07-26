import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../theme/colors';

export default function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
        },
        shadow.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}
