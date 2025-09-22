import { Stack } from 'expo-router';

export default function AuthLayout() {
  // Este Stack gerencia as telas DENTRO do grupo (auth), como login, cadastro, etc.
  return <Stack screenOptions={{ headerShown: false }} />;
}