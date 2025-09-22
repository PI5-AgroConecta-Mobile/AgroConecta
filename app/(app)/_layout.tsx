import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: '#283618',
        headerTintColor: '#283618',
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Início',
          title: 'AgroConecta',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="produtos" // Corresponde a produtos.tsx
        options={{
          drawerLabel: 'Todos os Produtos',
          title: 'Produtos',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="basket-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="sobre" // Corresponde a sobre.tsx
        options={{
          drawerLabel: 'Sobre',
          title: 'Sobre o App',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="configuracoes" // Corresponde a configuracoes.tsx
        options={{
          drawerLabel: 'Configurações',
          title: 'Configurações',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}