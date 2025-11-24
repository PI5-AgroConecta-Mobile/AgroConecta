import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inFarmerGroup = segments[0] === '(farmer)';
    const inAppGroup = segments[0] === '(app)';

    if (!token && !inAuthGroup) {
      router.replace('/(auth)');
    } 
    else if (token && user) {
      
      if (inAuthGroup) {
        if (user.userType === 1) {
          router.replace('/(farmer)/(tabs)'); 
        } else {
          router.replace('/(app)/(tabs)'); 
        }
      } 
      else if (user.userType === 0 && inFarmerGroup) {
        router.replace('/(app)/(tabs)');
      } 
      else if (user.userType === 1 && inAppGroup) {
        router.replace('/(farmer)/(tabs)');
      }
    }
  }, [token, user, segments, isLoading]); 

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
      SplashScreen.hideAsync();
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