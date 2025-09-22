import { Redirect } from 'expo-router';

// Apenas redireciona para a primeira tela do fluxo de autenticação
export default function StartPage() {
  return <Redirect href="/(auth)" />;
}