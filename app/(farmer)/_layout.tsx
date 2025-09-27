import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation, router, useSegments } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

// --- Componente Inteligente para o Cabeçalho ---
function CustomHeaderTitle() {
  const segments = useSegments();
  const currentPage = segments[segments.length - 1];
  const pagesWithBackArrow = ['gerenciar-produto']; 

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

// --- Componente do Botão de Menu ---
function HeaderMenuButton() {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={{ marginRight: 15 }} 
        >
            <Ionicons name="menu" size={32} color="#1B5E20" />
        </TouchableOpacity>
    );
}

// --- Layout Principal com Drawer para o Agricultor ---
export default function FarmerDrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        drawerActiveTintColor: '#1B5E20', 
        
        headerTitleAlign: 'left',
        headerStyle: { 
          backgroundColor: '#E8F5E9', 
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
          drawerLabel: 'Painel Principal',
          title: 'Painel do Agricultor',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
       <Drawer.Screen
        name="gerenciar-produto"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}

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