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

// 1. Importe o hook de autenticação (caminho também é 3 níveis acima)
import { useAuth } from '../../../context/AuthContext';

export default function PerfilFazendaScreen() {
  
  // 2. Pegue a função signOut e os dados do utilizador
  const { signOut, user } = useAuth();

  // 3. Crie a função de logout
  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem a certeza de que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, Sair", 
          onPress: () => signOut(), // <-- Chama a função do AuthContext
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil da Fazenda</Text>
        
        {user && (
          <Text style={styles.userInfo}>
            Sessão iniciada como: {user.name}
          </Text>
        )}

        {/* (Aqui entraria o resto do seu perfil de fazenda) */}

        {/* 4. O Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#D90429" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// --- Estilos (Idênticos ao do Cliente) ---
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
    marginTop: 'auto', // Coloca o botão no final
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#D90429',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});