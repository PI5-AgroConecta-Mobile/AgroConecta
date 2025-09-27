import React, { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';

// Previne que a splash screen nativa se esconda automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Simulação de carregamento de fontes ou dados
  const [fontsLoaded] = useFonts({
    // Se você tiver fontes customizadas, coloque-as aqui
    // 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // A lógica para esconder a splash screen
    // Ela só será escondida depois de as fontes carregarem E passar um tempo.
    if (fontsLoaded) {
        // Você pode ajustar o tempo aqui (em milissegundos)
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 2000); // 2 segundos, por exemplo
    }
  }, [fontsLoaded]);

  // Se as fontes ainda não carregaram, não renderiza nada (splash continua visível)
  if (!fontsLoaded) {
    return null;
  }

  // Quando a splash screen for escondida, este Stack será revelado.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(farmer)" />
    </Stack>
  );
}