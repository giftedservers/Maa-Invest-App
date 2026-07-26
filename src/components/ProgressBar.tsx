import React from 'react';
import { View } from 'react-native';
import { colors, radius } from '../theme/colors';

export default function ProgressBar({
  progress,
  color = colors.primary,
  trackColor = colors.border,
  height = 8,
}: {
  progress: number; // 0..1
  color?: string;
  trackColor?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ height, backgroundColor: trackColor, borderRadius: radius.pill, overflow: 'hidden' }}>
      <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: color, borderRadius: radius.pill }} />
    </View>
  );
}
