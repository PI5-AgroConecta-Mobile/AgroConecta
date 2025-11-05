import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuItem } from '@/components/MenuItem';


// --- TELA DE PERFIL ---
export default function PerfilScreen() {
  const handleLogout = () => {
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Cabeçalho do Perfil */}
        <View style={styles.profileHeader}>
          <Image
            source={require('../../../assets/images/Perfil-Cliente.jpeg')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Samer Halat</Text>
          <Text style={styles.profileJoined}>Membro desde Setembro, 2025</Text>
        </View>

        {/* Menu de Opções */}
        <View style={styles.menuContainer}>
          <MenuItem href="/editarPerfil" icon="person-outline" label="Editar Perfil" />
          <MenuItem href="/historico" icon="receipt-outline" label="Histórico de Compras" />
          <MenuItem href="/index" icon="heart-outline" label="Meus Favoritos" />
        </View>

        <View style={styles.menuContainer}>
          <MenuItem href="/configuracoes" icon="cog-outline" label="Configurações" />
          <MenuItem href="/sobre" icon="help-circle-outline" label="Ajuda & Suporte" />
        </View>

        {/* Botão de Logout */}
        <View style={styles.menuContainer}>
             <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="log-out-outline" size={24} color={'#C70039'} />
                    <Text style={[styles.menuItemText, { color: '#C70039' }]}>Sair</Text>
                </View>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F7F2',
    },
    container: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#283618',
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#283618',
        marginTop: 15,
    },
    profileJoined: {
        fontSize: 14,
        color: '#606C38',
        marginTop: 5,
    },
    menuContainer: {
        marginTop: 20,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 15,
        color: '#333',
    },
});