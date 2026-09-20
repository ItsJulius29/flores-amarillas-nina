import React, { useRef, useState } from 'react';
import { Animated, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import { colors, fonts } from '../theme';
import { FAVORITES } from '../content';

function FlipCard({ item }) {
  const flip = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);

  const toggle = () => {
    Haptics.selectionAsync();
    Animated.spring(flip, { toValue: open ? 0 : 1, friction: 8, tension: 10, useNativeDriver: true }).start();
    setOpen(!open);
  };

  const front = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const back = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <Pressable onPress={toggle} style={styles.cardWrap}>
      <Animated.View style={[styles.card, styles.front, { transform: [{ perspective: 800 }, { rotateY: front }] }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.backFace, { transform: [{ perspective: 800 }, { rotateY: back }] }]}>
        <Text style={styles.backText}>{item.back}</Text>
        {item.link && (
          <Pressable onPress={() => Linking.openURL(item.link)} hitSlop={8}>
            <Text style={styles.link}>▶ Escuchar</Text>
          </Pressable>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function Favorites({ onBack }) {
  return (
    <Screen title="Lo que te gusta" onBack={onBack}>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>Toca una tarjeta para voltearla 💜</Text>
        <View style={styles.wrap}>
          {FAVORITES.map((f) => (
            <FlipCard key={f.title} item={f} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { padding: 16, paddingBottom: 40 },
  hint: { color: colors.lavender, fontFamily: fonts.bodyMedium, textAlign: 'center', marginBottom: 14 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrap: { width: '48%', height: 170, marginBottom: 14 },
  card: { ...StyleSheet.absoluteFillObject, borderRadius: 20, padding: 14, alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' },
  front: { backgroundColor: 'rgba(233,219,251,0.12)', borderWidth: 1, borderColor: 'rgba(200,162,240,0.4)' },
  backFace: { backgroundColor: colors.yellow },
  emoji: { fontSize: 44 },
  title: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 15, marginTop: 8, textAlign: 'center' },
  backText: { color: colors.black, fontFamily: fonts.bodyMedium, fontSize: 12.5, textAlign: 'center', lineHeight: 18 },
  link: { color: colors.purple, fontFamily: fonts.bodyBold, fontSize: 13, marginTop: 8 },
});
