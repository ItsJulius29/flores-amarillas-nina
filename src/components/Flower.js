import React from 'react';
import Svg, { Ellipse, Circle, G } from 'react-native-svg';
import { colors } from '../theme';

// Tipos: 'yellow' (girasol/margarita amarilla), 'lilac' (flor pequeña morada), 'rose' (rosa blanca)
const CONFIG = {
  yellow: { petals: 12, petal: colors.yellow, edge: colors.gold, center: '#7A4A00', rx: 8, ry: 26, cy: 30 },
  lilac: { petals: 5, petal: colors.lilac, edge: colors.violet, center: colors.yellow, rx: 14, ry: 22, cy: 30 },
  rose: { petals: 0 },
};

export default function Flower({ type = 'yellow', size = 80 }) {
  const c = CONFIG[type];

  if (type === 'rose') {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="44" fill="#F1E9F7" />
        <Circle cx="50" cy="50" r="36" fill="#FFFFFF" stroke="#E4D7F0" strokeWidth="1.5" />
        <Circle cx="50" cy="50" r="27" fill="#FBF7FF" stroke="#DCCBEB" strokeWidth="1.5" />
        <Circle cx="50" cy="50" r="18" fill="#FFFFFF" stroke="#D5C2E8" strokeWidth="1.5" />
        <Circle cx="50" cy="50" r="10" fill="#F6EEFB" stroke="#CDB8E3" strokeWidth="1.5" />
        <Circle cx="50" cy="50" r="4" fill="#E5D3F3" />
      </Svg>
    );
  }

  const angles = Array.from({ length: c.petals }, (_, i) => (360 / c.petals) * i);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {angles.map((a) => (
        <G key={a} rotation={a} origin="50, 50">
          <Ellipse cx="50" cy={c.cy} rx={c.rx} ry={c.ry / 2 + 4} fill={c.petal} stroke={c.edge} strokeWidth="1" />
        </G>
      ))}
      <Circle cx="50" cy="50" r={type === 'yellow' ? 13 : 9} fill={c.center} />
      <Circle cx="50" cy="50" r={type === 'yellow' ? 7 : 4} fill={type === 'yellow' ? '#A86A00' : colors.gold} opacity="0.7" />
    </Svg>
  );
}
