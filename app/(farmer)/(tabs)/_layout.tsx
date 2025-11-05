import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FarmerTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        
        // --- Estilos da TabBar (iguais aos do cliente) ---
        tabBarStyle: {
          backgroundColor: '#283618',
          borderTopWidth: 0,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: '#FEFAE0',
        tabBarInactiveTintColor: '#A9B388',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meus-produtos"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'basket' : 'basket-outline'} size={28} color={color} />,
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
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil-fazenda"
        options={{
          title: 'Minha Fazenda',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'storefront' : 'storefront-outline'} size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}