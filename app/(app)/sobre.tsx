import { Redirect } from 'expo-router';

export default function RedirectToAbout() {
  // Esta função de componente redireciona para a tela "sobre" dentro das abas.
  return <Redirect href="/(app)/(tabs)/sobre" />;
}