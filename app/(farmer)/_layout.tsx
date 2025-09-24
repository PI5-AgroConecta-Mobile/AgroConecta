import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- Componentes do Cabeçalho (reutilizados do outro layout) ---
function HeaderTitleLogo() {
  return <Image style={{ width: 160, height: 45, resizeMode: 'contain' }} source={require('../../assets/images/logo-escura.png')} />;
}

function HeaderMenuButton() {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={{ marginRight: 15 }} >
            <Ionicons name="menu" size={32} color="#28318" />
        </TouchableOpacity>
    );
}

export default function FarmerDrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        drawerActiveTintColor: '#2E7D32', // Verde do agricultor
        headerTitleAlign: 'left',
        headerStyle: { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0 },
        headerTitle: () => <HeaderTitleLogo />,
        headerRight: () => <HeaderMenuButton />,
        headerLeft: () => null,
      }}
    >
      <Drawer.Screen
        name="(tabs)" // A tela principal do menu são as abas
        options={{
          drawerLabel: 'Painel Principal',
          title: 'Painel do Agricultor',
          drawerIcon: ({ size, color }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      {/* Futuramente, podemos adicionar outras telas só de menu aqui */}
    </Drawer>
  );
}