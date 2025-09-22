import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// Componente para o Título com a Logo
function HeaderTitleLogo() {
  return (
    <Image
      style={{ width: 150, height: 40, resizeMode: 'contain' }}
      source={require('../../assets/images/logo-escura.png')}
    />
  );
}

// Componente para o Botão de Menu
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

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        // --- ADICIONE ESTA LINHA ---
        drawerPosition: 'right', 

        drawerActiveTintColor: '#283618',
        headerTintColor: '#283618',
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleAlign: 'center',
        headerTitle: () => <HeaderTitleLogo />,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => { /* Lógica para o carrinho */ }}
            style={{ marginLeft: 15 }} 
          >
            <Ionicons name="cart-outline" size={32} color="#283618" />
          </TouchableOpacity>
        ),
        headerRight: () => <HeaderMenuButton />,
      }}
    >
      {/* ... O restante do seu arquivo (Drawer.Screen) continua igual ... */}
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
        name="sobre"
        options={{
          drawerLabel: 'Sobre',
          title: 'Sobre o App',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="configurações"
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