import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import Flower from '../components/Flower';
import { colors, fonts } from '../theme';
import { HER_NAME } from '../content';

export default function Intro({ onOpen }) {
  const spin = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 1400, useNativeDriver: true }).start();
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 24000, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [spin, fade, pulse]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <Screen title="" petals>
      <Animated.View style={[styles.center, { opacity: fade }]}>
        <Animated.View style={{ transform: [{ rotate }, { scale }] }}>
          <Flower type="yellow" size={220} />
        </Animated.View>
        <Text style={styles.for}>Para {HER_NAME}</Text>
        <Text style={styles.title}>Feliz Día de las{'\n'}Flores Amarillas</Text>
        <Text style={styles.sub}>Hice esto solo para ti 💛</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onOpen();
          }}
          style={({ pressed }) => [styles.button, pressed && { transform: [{ scale: 0.96 }] }]}
        >
          <Text style={styles.buttonText}>Abrir mi regalo 🌼</Text>
        </Pressable>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  for: { color: colors.lilac, fontFamily: fonts.bodyMedium, fontSize: 16, marginTop: 28, letterSpacing: 2, textTransform: 'uppercase' },
  title: { color: colors.yellow, fontFamily: fonts.script, fontSize: 46, lineHeight: 54, textAlign: 'center', marginTop: 6 },
  sub: { color: colors.lavender, fontFamily: fonts.body, fontSize: 15, marginTop: 10 },
  button: { marginTop: 32, backgroundColor: colors.yellow, paddingVertical: 15, paddingHorizontal: 34, borderRadius: 32, shadowColor: colors.yellow, shadowOpacity: 0.6, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  buttonText: { color: colors.black, fontFamily: fonts.bodyBold, fontSize: 17 },
});
