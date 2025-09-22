import { Stack } from 'expo-router';

export default function RootLayout() {
  // A função deste layout é apenas declarar os grupos de rotas principais.
  // Ele não tem interface visível, apenas gerencia a navegação.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Informa ao router que o grupo (auth) existe e é uma rota válida */}
      <Stack.Screen name="(auth)" />

      {/* Informa ao router que o grupo (app) também existe */}
      <Stack.Screen name="(app)" />
    </Stack>
  );
}