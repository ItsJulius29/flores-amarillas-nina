import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import { colors, fonts } from '../theme';
import { WISHES } from '../content';

export default function Wish({ onBack }) {
  const pop = useRef(new Animated.Value(1)).current;
  const [wish, setWish] = useState(null);

  const makeWish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setWish((prev) => {
      let next;
      do {
        next = WISHES[Math.floor(Math.random() * WISHES.length)];
      } while (next === prev && WISHES.length > 1);
      return next;
    });
    Animated.sequence([
      Animated.timing(pop, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.spring(pop, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Screen title="Pide un deseo" onBack={onBack}>
      <View style={styles.center}>
        <Pressable onPress={makeWish}>
          <Animated.Text style={[styles.star, { transform: [{ scale: pop }] }]}>🌟</Animated.Text>
        </Pressable>
        <Text style={styles.wish}>{wish ?? 'Cierra los ojos, piensa en algo bonito y toca la estrella'}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  star: { fontSize: 120, textShadowColor: colors.yellow, textShadowRadius: 30 },
  wish: { color: colors.lavender, fontFamily: fonts.script, fontSize: 30, lineHeight: 38, textAlign: 'center', marginTop: 32 },
});
