import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation, router, useSegments } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- SEUS COMPONENTES  ---
function HeaderTitleLogo() {
  return (
    <Image
      style={{ width: 160, height: 45, resizeMode: 'contain' }}
      source={require('../../assets/images/logo-escura.png')}
    />
  );
}

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

// --- Componente Inteligente para o Cabeçalho ---
function CustomHeaderTitle() {
  const segments = useSegments();
  const currentPage = segments[segments.length - 1];
  const pagesWithBackArrow = ['sobre', 'configuracoes', 'detalhesProdutos', '[id]'];
  const shouldShowBackArrow = pagesWithBackArrow.includes(currentPage);

  return (
    <View>
      <HeaderTitleLogo />
      {shouldShowBackArrow && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#606C38" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// --- Layout Principal com Drawer ---
export default function AppDrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        drawerActiveTintColor: '#283618',
        headerTitleAlign: 'left',
        headerStyle: { 
          backgroundColor: '#FFFFFF', 
          elevation: 0, 
          shadowOpacity: 0,
          height: 110,
        },
        headerTitle: () => <CustomHeaderTitle />,
        headerRight: () => <HeaderMenuButton />,
        headerLeft: () => null,
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
        name="(tabs)/configuracoes"
        options={{
          drawerLabel: 'Configurações',
          title: 'Configurações',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)/sobre"
        options={{
          drawerLabel: 'Sobre',
          title: 'Sobre o App',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />
       <Drawer.Screen
        name="fazenda/[id]"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

// --- Estilos para o botão de voltar ---
const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    backButtonText: {
        marginLeft: 4,
        fontSize: 16,
        color: '#606C38',
    }
});