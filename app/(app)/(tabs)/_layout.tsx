import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

// Componente para o ícone customizado da TabBar
const TabBarIcon = ({ name, label, focused }: { name: any; label: string; focused: boolean }) => {
  const iconColor = focused ? '#FFFFFF' : '#283618';
  const backgroundColor = focused ? '#606C38' : 'transparent';
  const labelColor = focused ? '#606C38' : '#283618';

  return (
    <View style={styles.tabContainer}>
      <View style={[styles.iconWrapper, { backgroundColor }]}>
        <Ionicons name={name} size={28} color={iconColor} />
      </View>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </View>
  );
};


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // O cabeçalho já é gerenciado pelo Drawer
        tabBarShowLabel: false, // Vamos usar nosso próprio label no componente customizado
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 70,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home-outline" label="Início" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="produtos" // <-- NOVA ABA ADICIONADA
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="search-outline" label="Produtos" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="map-outline" label="Mapa" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="person-outline" label="Perfil" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconWrapper: {
    width: 50,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
  },
});