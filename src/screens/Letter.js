import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import { colors, fonts } from '../theme';
import { HER_NAME, LETTER, MY_NAME, TOGETHER_SINCE } from '../content';

const daysTogether = () => Math.floor((Date.now() - new Date(TOGETHER_SINCE).getTime()) / 86400000);

function Line({ text, index }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 900, delay: 400 + index * 1100, useNativeDriver: true }).start();
  }, [a, index]);
  return (
    <Animated.Text style={[styles.line, { opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
      {text}
    </Animated.Text>
  );
}

export default function Letter({ onBack }) {
  return (
    <Screen title="Una carta" onBack={onBack}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.paper}>
          <Text style={styles.to}>Para {HER_NAME},</Text>
          {LETTER.map((t, i) => (
            <Line key={i} text={t} index={i} />
          ))}
          <Text style={styles.sign}>Con todo mi cariño,{'\n'}{MY_NAME} 💛</Text>
        </View>
        {TOGETHER_SINCE && (
          <View style={styles.counter}>
            <Text style={styles.days}>{daysTogether()}</Text>
            <Text style={styles.daysText}>días juntos y contando 💜</Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  paper: { backgroundColor: colors.rose, borderRadius: 22, padding: 24, borderTopWidth: 6, borderTopColor: colors.yellow },
  to: { color: colors.violet, fontFamily: fonts.script, fontSize: 32, marginBottom: 12 },
  line: { color: '#2A1245', fontFamily: fonts.body, fontSize: 15.5, lineHeight: 25, marginBottom: 14 },
  sign: { color: colors.violet, fontFamily: fonts.script, fontSize: 26, marginTop: 8, lineHeight: 34 },
  counter: { alignItems: 'center', marginTop: 24 },
  days: { color: colors.yellow, fontFamily: fonts.script, fontSize: 64 },
  daysText: { color: colors.lavender, fontFamily: fonts.bodyMedium, fontSize: 15 },
});
