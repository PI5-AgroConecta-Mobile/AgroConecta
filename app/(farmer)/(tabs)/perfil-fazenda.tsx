import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuItem } from '@/components/MenuItem';
import { useAuth } from '../../../context/AuthContext';

const BASE_URL = 'http://192.168.1.102:3333'; 

export default function FarmerProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: () => {
            signOut();
            router.replace('/');
        }}
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Cabeçalho do Perfil */}
        <View style={styles.profileHeader}>
          <Image
            source={user?.imgUrl ? { uri: `${BASE_URL}/uploads/${user.imgUrl}` } : require('../../../assets/images/icon.png')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.name || 'Agricultor'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.tagContainer}>
             <Text style={styles.tagText}>Conta Agricultor</Text>
          </View>
        </View>

        {/* Menu de Opções */}
        <View style={styles.menuContainer}>
          <MenuItem href="/(farmer)/gerenciar-produto" icon="nutrition-outline" label="Meus Produtos" />
          <MenuItem href="/(farmer)/(tabs)/agendamentos" icon="calendar-outline" label="Minha Agenda" />
        </View>

        <View style={styles.menuContainer}>
          <MenuItem href="/configuracoes" icon="settings-outline" label="Configurações da Fazenda" />
          
          <MenuItem 
            href="/(farmer)/editar-perfil" 
            icon="person-outline" 
            label="Editar Dados Pessoais" 
          />
          <MenuItem 
            href="/(farmer)/dados-fazenda" 
            icon="map-outline" 
            label="Dados da Fazenda & Localização" 
          />
          
          <MenuItem href="/sobre" icon="help-circle-outline" label="Ajuda & Suporte" />
        </View>

        {/* Botão de Sair */}
        <View style={styles.menuContainer}>
             <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="log-out-outline" size={24} color={'#C70039'} />
                    <Text style={[styles.menuItemText, { color: '#C70039' }]}>Sair</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
    container: { flex: 1 },
    profileHeader: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#283618', backgroundColor: '#eee' },
    profileName: { fontSize: 22, fontWeight: 'bold', color: '#283618', marginTop: 15 },
    profileEmail: { fontSize: 14, color: '#606C38', marginTop: 4 },
    tagContainer: { marginTop: 10, backgroundColor: '#E9C46A', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    tagText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
    menuContainer: { marginTop: 20, marginHorizontal: 15, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2 },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    menuItemText: { fontSize: 16, marginLeft: 15, color: '#333' },
});