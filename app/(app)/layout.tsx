import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  // Este layout é ativado APÓS o login e define o menu lateral.
  return (
    <Drawer screenOptions={{ drawerActiveTintColor: '#283618' }}>
      <Drawer.Screen
        name="(tabs)" // A tela principal do menu são as abas
        options={{
          drawerLabel: 'Início',
          title: 'AgroConecta',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="produtos"
        options={{
          drawerLabel: 'Todos os Produtos',
          title: 'Produtos',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="basket-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Adicione outras telas do menu aqui conforme precisar */}
    </Drawer>
  );
}