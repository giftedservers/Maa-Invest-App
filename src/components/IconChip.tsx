import React from 'react';
import { View } from 'react-native';
import { radius } from '../theme/colors';

export default function IconChip({
  children,
  bg,
  size = 40,
}: {
  children: React.ReactNode;
  bg: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.md,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}
