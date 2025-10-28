import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../../context/AuthContext';

export default function ConfiguracoesScreen() {
  
  const { signOut, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem a certeza de que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sim, Sair", 
          onPress: () => signOut(), 
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>
        
        {/* Mostra o nome do utilizador logado */}
        {user && (
          <Text style={styles.userInfo}>
            Sessão iniciada como: {user.name}
          </Text>
        )}

        {/* 4. O Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#D90429" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

      </View>
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
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#283618',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 16,
    color: '#606C38',
    textAlign: 'center',
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D90429',
  },
  logoutButtonText: {
    color: '#D90429',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});