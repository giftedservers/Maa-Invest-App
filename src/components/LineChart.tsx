import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';

export default function LineChart({
  data,
  labels,
  width = 320,
  height = 140,
  color = colors.primary,
}: {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const padY = 10;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = padY + (height - padY * 2) * (1 - (v - min) / span);
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.25} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#areaFill)" />
        <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      {labels && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          {labels.map((l, i) => (
            <Text key={i} style={{ fontSize: 11, color: colors.textFaint }}>
              {l}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
