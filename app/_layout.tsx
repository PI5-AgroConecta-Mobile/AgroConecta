import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext'; // <-- Importe useAuth

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; 

    const inAuthGroup = segments[0] === '(auth)';

   if (!token && !inAuthGroup) {
      router.replace('/(auth)' as any); 
    } else if (token && user) {
      
      const inAppGroup = segments[0] === '(app)';
      const inFarmerGroup = segments[0] === '(farmer)';

      if (inAuthGroup) {
        // Linha 32
        router.replace(user.userType === 1 ? '/(farmer)' : '/(app)' as any); 
      } else if (user.userType === 0 && inFarmerGroup) {
        // Linha 35
        router.replace('/(app)' as any); 
      } else if (user.userType === 1 && inAppGroup) {
        // Linha 38
        router.replace('/(farmer)' as any); 
      }
    }
  }, [token, user, segments, isLoading, router]);
 
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(farmer)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1000); 
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}