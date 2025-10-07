import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation, router, useSegments } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- Componente do Cabeçalho (Não precisa mudar nada aqui) ---
function CustomHeaderTitle() {
  const segments = useSegments();
  const currentPage = segments[segments.length - 1];
  const pagesWithBackArrow = ['sobre', 'configuracoes', 'detalhesProdutos', '[id]', 'editarPerfil', 'historico'];
  const shouldShowBackArrow = pagesWithBackArrow.includes(currentPage);

  return (
    <View>
      <Image
        style={{ width: 160, height: 45, resizeMode: 'contain' }}
        source={require('../../assets/images/logo-escura.png')}
      />
      {shouldShowBackArrow && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#606C38" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}
    </View>
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
      {/* --- ITENS VISÍVEIS NO MENU --- */}
      <Drawer.Screen
        name="(tabs)" // Linka para o conjunto de abas
        options={{
          drawerLabel: 'Início',
          title: 'AgroConecta', // Título do Header
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      {/* AGORA VAI FUNCIONAR: Aponta para os arquivos de redirecionamento que criamos */}
      <Drawer.Screen
        name="configuracoes" // <- MUDANÇA AQUI
        options={{
          drawerLabel: 'Configurações',
          title: 'Configurações',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="sobre" // <- MUDANÇA AQUI
        options={{
          drawerLabel: 'Sobre',
          title: 'Sobre o App',
          drawerIcon: ({ size, color }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* --- TELAS OCULTAS DO MENU --- */}
       <Drawer.Screen
        name="fazenda/[id]"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

// --- Estilos para o botão de voltar (sem alterações) ---
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