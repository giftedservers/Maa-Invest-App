import { TextStyle } from 'react-native';

export const type: Record<string, TextStyle> = {
  h1: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  h2: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyMedium: { fontSize: 15, fontWeight: '600' },
  small: { fontSize: 13, fontWeight: '400' },
  smallMedium: { fontSize: 13, fontWeight: '600' },
  caption: { fontSize: 11, fontWeight: '500' },
  money: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
};
