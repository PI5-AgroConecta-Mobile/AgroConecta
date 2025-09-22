import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  // Este layout é ativado APÓS o login e define o menu lateral.
  return (
    <Drawer screenOptions={{
      drawerActiveTintColor: '#283618',
      headerTintColor: '#283618'
    }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Início',
          title: 'AgroConecta',
          // CORREÇÃO AQUI: Adicionamos os tipos para size e color
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="produtos"
        options={{
          drawerLabel: 'Todos os Produtos',
          title: 'Produtos',
          // CORREÇÃO AQUI: Adicionamos os tipos para size e color
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="basket-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="sobre"
        options={{
          drawerLabel: 'Sobre',
          title: 'Sobre o App',
          // CORREÇÃO AQUI: Adicionamos os tipos para size e color
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}