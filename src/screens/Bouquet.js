import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import Flower from '../components/Flower';
import { colors, fonts } from '../theme';

const TYPES = ['yellow', 'yellow', 'lilac', 'rose'];
const SIZE = 80;
let nextId = 0;

function Pop({ x, y, type, size, rotation }) {
  const s = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(s, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }).start();
  }, [s]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, transform: [{ scale: s }, { rotate: `${rotation}deg` }] }}
    >
      <Flower type={type} size={size} />
    </Animated.View>
  );
}

const makeFlower = (x, y) => ({
  id: nextId++,
  x,
  y,
  type: TYPES[Math.floor(Math.random() * TYPES.length)],
  size: SIZE * (0.7 + Math.random() * 0.7),
  rotation: Math.floor(Math.random() * 360),
});

export default function Bouquet({ onBack }) {
  const [flowers, setFlowers] = useState([]);
  const [area, setArea] = useState({ w: 300, h: 500 });

  const plant = (e) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlowers((f) => [...f, makeFlower(e.nativeEvent.locationX, e.nativeEvent.locationY)]);
  };

  const surprise = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const burst = Array.from({ length: 12 }, () => makeFlower(30 + Math.random() * (area.w - 60), 30 + Math.random() * (area.h - 60)));
    setFlowers((f) => [...f, ...burst]);
  };

  return (
    <Screen title="Nuestro ramo" onBack={onBack}>
      <Text style={styles.hint}>
        {flowers.length === 0 ? 'Toca en cualquier lugar para sembrar flores 🌼' : `${flowers.length} flores para ti 💛`}
      </Text>
      <Pressable style={styles.canvas} onPress={plant} onLayout={(e) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
        {flowers.map((f) => (
          <Pop key={f.id} {...f} />
        ))}
      </Pressable>
      <View style={styles.row}>
        <Pressable style={[styles.btn, styles.btnFill]} onPress={surprise}>
          <Text style={styles.btnFillText}>Ramo sorpresa ✨</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => setFlowers([])}>
          <Text style={styles.btnText}>Limpiar</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { color: colors.lavender, fontFamily: fonts.bodyMedium, fontSize: 15, textAlign: 'center', marginVertical: 8 },
  canvas: { flex: 1, marginHorizontal: 16, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(200,162,240,0.35)', backgroundColor: 'rgba(11,7,16,0.45)', overflow: 'hidden' },
  row: { flexDirection: 'row', gap: 12, padding: 16 },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 28, borderWidth: 1, borderColor: colors.lilac },
  btnFill: { backgroundColor: colors.yellow, borderColor: colors.yellow },
  btnFillText: { color: colors.black, fontFamily: fonts.bodyBold, fontSize: 15 },
  btnText: { color: colors.lavender, fontFamily: fonts.bodyMedium, fontSize: 15 },
});
