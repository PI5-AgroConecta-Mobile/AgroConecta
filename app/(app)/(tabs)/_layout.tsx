import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        
        // --- Estilos e Cores Padrão e Seguros ---
        tabBarStyle: {
          backgroundColor: '#283618',
          borderTopWidth: 0,
          height: 60 + insets.bottom, 
        },
        tabBarActiveTintColor: '#FEFAE0', 
        tabBarInactiveTintColor: '#A9B388', 
      }}
    >
      {/* --- ABAS VISÍVEIS --- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'search' : 'search-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="agendamentos"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'map' : 'map-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={28} color={color} />,
        }}
      />

         {/* --- TELAS ESCONDIDAS DA BARRA --- */}
      <Tabs.Screen name="sobre" options={{ href: null }} />
      <Tabs.Screen name="configuracoes" options={{ href: null }} />

      
      <Tabs.Screen
        name="detalhesProdutos" 
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}
