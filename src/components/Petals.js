import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

const { width, height } = Dimensions.get('window');
const PALETTE = [colors.yellow, colors.yellow, colors.gold, colors.lilac];

function Petal({ delay, x, size, duration, color, sway }) {
  const fall = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(fall, { toValue: 1, duration, delay, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [fall, duration, delay]);

  const translateY = fall.interpolate({ inputRange: [0, 1], outputRange: [-40, height + 40] });
  const translateX = fall.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, sway, -sway] });
  const rotate = fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        width: size,
        height: size * 1.5,
        borderRadius: size,
        backgroundColor: color,
        opacity: 0.85,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    />
  );
}

export default function Petals({ count = 14 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * width,
        size: 8 + Math.random() * 10,
        duration: 7000 + Math.random() * 6000,
        delay: Math.random() * 6000,
        sway: 20 + Math.random() * 40,
        color: PALETTE[i % PALETTE.length],
      })),
    [count]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {petals.map((p) => (
        <Petal key={p.id} {...p} />
      ))}
    </View>
  );
}
