import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets(); // Usamos para o espaçamento inferior

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // O cabeçalho é controlado pelo Drawer

        // --- ESTILO DA BARRA DE ABAS ---
        tabBarStyle: {
          backgroundColor: '#283618', // Fundo verde
          borderTopWidth: 0,
          height: 60 + insets.bottom, // Altura dinâmica para a área segura
        },
        // --- CORES DOS ÍCONES E TEXTOS ---
        tabBarActiveTintColor: '#FEFAE0', // Cor quando a aba está ativa (creme)
        tabBarInactiveTintColor: '#A9B388', // Cor quando está inativa (cinza-esverdeado)
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início', // O texto que aparece em baixo do ícone
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="agendamentos"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}