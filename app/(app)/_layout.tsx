import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// Componente da Logo com tamanho ajustado
function HeaderTitleLogo() {
  return (
    <Image
      style={{ width: 160, height: 45, resizeMode: 'contain' }} // Logo um pouco maior
      source={require('../../assets/images/logo-escura.png')}
    />
  );
}

// Componente do Botão de Menu (continua igual)
function HeaderMenuButton() {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={{ marginRight: 15 }} 
        >
            <Ionicons name="menu" size={32} color="#283618" />
        </TouchableOpacity>
    );
}

export default function AppDrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        drawerActiveTintColor: '#283618',
        
        // --- MUDANÇAS NO HEADER ---
        headerTitleAlign: 'left', // Logo para a esquerda
        headerLeft: () => null, // Carrinho removido
        headerTitle: () => <HeaderTitleLogo />,
        headerRight: () => <HeaderMenuButton />,
        headerStyle: {
          backgroundColor: '#FEFAE0',
          elevation: 0, // Remove sombra (divisória) no Android
          shadowOpacity: 0, // Remove sombra (divisória) no iOS
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Início',
          title: 'AgroConecta',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="configuracoes"
        options={{
          drawerLabel: 'Configurações',
          title: 'Configurações',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="sobre"
        options={{
          drawerLabel: 'Sobre',
          title: 'Sobre o App',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}