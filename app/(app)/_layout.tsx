import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation, router, useSegments } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- NOVO COMPONENTE DE CABEÇALHO INTELIGENTE ---
function CustomHeaderTitle() {
  // O hook useSegments nos diz em qual URL estamos. Ex: ['(app)', '(tabs)', 'sobre']
  const segments = useSegments();
  // Pegamos a última parte da URL para saber a página atual.
  const currentPage = segments[segments.length - 1];

  // Lista de páginas que devem mostrar a seta de "voltar".
  const pagesWithBackArrow = ['sobre', 'configuracoes', 'detalhesProdutos'];

  // Verifica se a página atual está na nossa lista.
  const shouldShowBackArrow = pagesWithBackArrow.includes(currentPage);

  return (
    <View>
      <Image
        style={{ width: 160, height: 45, resizeMode: 'contain' }}
        source={require('../../assets/images/logo-escura.png')}
      />
      {/* Se a condição for verdadeira, o bloco de código abaixo é renderizado */}
      {shouldShowBackArrow && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#606C38" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// --- Componente do Botão de Menu (continua igual) ---
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
          height: 110, // Aumentamos a altura do header para caber a seta
        },
        headerTitle: () => <CustomHeaderTitle />, // Usamos o nosso novo componente
        headerRight: () => <HeaderMenuButton />,
        headerLeft: () => null,
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Início', title: 'AgroConecta', drawerIcon: ({ size, color }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="(tabs)/configuracoes" options={{ drawerLabel: 'Configurações', title: 'Configurações', drawerIcon: ({ size, color }) => <Ionicons name="cog-outline" size={size} color={color} /> }} />
      <Drawer.Screen name="(tabs)/sobre" options={{ drawerLabel: 'Sobre', title: 'Sobre o App', drawerIcon: ({ size, color }) => <Ionicons name="information-circle-outline" size={size} color={color} /> }} />
    </Drawer>
  );
}

// --- ESTILOS PARA O NOVO BOTÃO DE VOLTAR ---
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