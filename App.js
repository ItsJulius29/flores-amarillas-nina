import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { colors } from './src/theme';
import Intro from './src/screens/Intro';
import Home from './src/screens/Home';
import Bouquet from './src/screens/Bouquet';
import Favorites from './src/screens/Favorites';
import Letter from './src/screens/Letter';
import Coupons from './src/screens/Coupons';
import Wish from './src/screens/Wish';

const SCREENS = { bouquet: Bouquet, favorites: Favorites, letter: Letter, coupons: Coupons, wish: Wish };

export default function App() {
  const [fontsLoaded] = useFonts({ DancingScript_700Bold, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold });
  const [route, setRoute] = useState('intro');

  const goBack = useCallback(() => setRoute((r) => (r === 'home' ? 'intro' : 'home')), []);

  // Botón "atrás" de Android: vuelve a la pantalla anterior en vez de cerrar la app
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route === 'intro') return false;
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [route, goBack]);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.black }} />;

  const Current = SCREENS[route];
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {route === 'intro' && <Intro onOpen={() => setRoute('home')} />}
      {route === 'home' && <Home onGo={setRoute} onBack={goBack} />}
      {Current && <Current onBack={goBack} />}
    </SafeAreaProvider>
  );
}
