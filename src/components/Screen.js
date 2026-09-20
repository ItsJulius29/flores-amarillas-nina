import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Petals from './Petals';
import { colors, fonts } from '../theme';

// Fondo degradado negro→morado + pétalos + barra superior con botón volver
export default function Screen({ title, onBack, petals = true, children }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={[colors.black, colors.night, colors.purple]} style={styles.fill}>
      {petals && <Petals />}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.back} />
      </View>
      <View style={[styles.body, { paddingBottom: insets.bottom }]}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(200,162,240,0.15)' },
  backText: { color: colors.lavender, fontSize: 28, lineHeight: 32, marginTop: -3 },
  title: { color: colors.yellow, fontFamily: fonts.script, fontSize: 30 },
  body: { flex: 1 },
});
