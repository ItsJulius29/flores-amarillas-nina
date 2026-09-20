import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Screen from '../components/Screen';
import { colors, fonts } from '../theme';
import { COUPONS } from '../content';

export default function Coupons({ onBack }) {
  const [used, setUsed] = useState({});

  const redeem = (title) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUsed((u) => ({ ...u, [title]: true }));
  };

  return (
    <Screen title="Vales de regalo" onBack={onBack}>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>Toca “Canjear” para usar un vale 🎟️</Text>
        {COUPONS.map((c) => {
          const done = used[c.title];
          return (
            <View key={c.title} style={[styles.ticket, done && styles.ticketDone]}>
              <Text style={styles.emoji}>{c.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{c.title}</Text>
                <Text style={styles.text}>{c.text}</Text>
              </View>
              {done ? (
                <Text style={styles.stamp}>¡CANJEADO!</Text>
              ) : (
                <Pressable onPress={() => redeem(c.title)} style={styles.btn}>
                  <Text style={styles.btnText}>Canjear</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 40 },
  hint: { color: colors.lavender, fontFamily: fonts.bodyMedium, textAlign: 'center', marginBottom: 14 },
  ticket: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.yellow, borderRadius: 18, padding: 16, marginBottom: 14, borderStyle: 'dashed', borderWidth: 2, borderColor: colors.purple },
  ticketDone: { backgroundColor: 'rgba(255,217,59,0.35)' },
  emoji: { fontSize: 34 },
  title: { color: colors.black, fontFamily: fonts.bodyBold, fontSize: 16 },
  text: { color: '#3B1A66', fontFamily: fonts.body, fontSize: 12.5, marginTop: 2 },
  btn: { backgroundColor: colors.purple, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20 },
  btnText: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 13 },
  stamp: { color: colors.purple, fontFamily: fonts.bodyBold, fontSize: 12, borderWidth: 2, borderColor: colors.purple, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, transform: [{ rotate: '-8deg' }] },
});
