import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import { colors, fonts } from '../theme';
import { HER_NAME } from '../content';

const ITEMS = [
  { key: 'bouquet', emoji: '💐', title: 'Nuestro ramo', text: 'Toca y siembra flores' },
  { key: 'favorites', emoji: '💜', title: 'Todo lo que te gusta', text: 'Voltea cada tarjeta' },
  { key: 'letter', emoji: '💌', title: 'Una carta para ti', text: 'Léela con calma' },
  { key: 'coupons', emoji: '🎟️', title: 'Vales de regalo', text: 'Canjéalos cuando quieras' },
  { key: 'wish', emoji: '🌟', title: 'Pide un deseo', text: 'Toca la estrella' },
];

export default function Home({ onGo, onBack }) {
  return (
    <Screen title="Flores Amarillas" onBack={onBack}>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.hello}>Hola, {HER_NAME} 💛</Text>
        <Text style={styles.sub}>Elige una sorpresa</Text>
        {ITEMS.map((it) => (
          <Pressable
            key={it.key}
            onPress={() => {
              Haptics.selectionAsync();
              onGo(it.key);
            }}
            style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }]}
          >
            <Text style={styles.emoji}>{it.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{it.title}</Text>
              <Text style={styles.cardText}>{it.text}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 40 },
  hello: { color: colors.yellow, fontFamily: fonts.script, fontSize: 38 },
  sub: { color: colors.lavender, fontFamily: fonts.body, fontSize: 15, marginBottom: 18 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(233,219,251,0.10)', borderColor: 'rgba(200,162,240,0.35)', borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 14 },
  emoji: { fontSize: 34 },
  cardTitle: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 17 },
  cardText: { color: colors.lilac, fontFamily: fonts.body, fontSize: 13, marginTop: 2 },
  arrow: { color: colors.yellow, fontSize: 30 },
});
