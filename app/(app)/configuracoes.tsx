import { Redirect } from 'expo-router';

export default function RedirectToSettings() {
  // Esta função de componente redireciona para a tela de configurações dentro das abas.
  return <Redirect href="/(app)/(tabs)/configuracoes" />;
}