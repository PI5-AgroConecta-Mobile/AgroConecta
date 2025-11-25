import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


import api from '../../services/api';

import axios from 'axios';

export default function CadastroScreen() {
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'cliente' | 'agricultor'>('cliente');

  // Estados de controle da API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função de Cadastro
  const handleCadastro = async () => {
    setError(null);

    // 1. Validação no Front-end
    if (!nome || !email || !cpf || !senha || !confirmarSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    // 2. Mapear 'tipoUsuario' (string) para 'userType' (Int)
    // Assumindo 0 = cliente, 1 = agricultor
    const userType = tipoUsuario === 'cliente' ? 0 : 1;

    try {
      // 3. Chamar a API
      await api.post('/createUser', {
        name: nome,
        email: email,
        password: senha,
        cpfcnpj: cpf,
        userType: userType,
      });

      // 4. Sucesso
      setLoading(false);
      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso. Faça o login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => {
              const path = tipoUsuario === 'cliente' ? '/(auth)/loginCliente' : '/(auth)/loginAgricultor';
              router.push(path as any);
            },
          },
        ]
      );
    } catch (err) {
      // 5. Tratamento de Erro
      setLoading(false);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.err || 'Não foi possível criar a conta.');
      } else {
        setError('Não foi possível conectar ao servidor. Tente novamente.');
      }
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#283618" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Criar sua Conta</Text>
        <Text style={styles.subtitle}>
          Vamos começar! Escolha seu tipo de perfil.
        </Text>

        {/* Seletor de Tipo de Usuário */}
        <View style={styles.tipoUsuarioContainer}>
          <TouchableOpacity
            style={[
              styles.tipoButton,
              tipoUsuario === 'cliente' && styles.tipoButtonActive,
            ]}
            onPress={() => setTipoUsuario('cliente')}>
            <Ionicons
              name="person-outline"
              size={24}
              color={tipoUsuario === 'cliente' ? '#FEFAE0' : '#283618'}
            />
            <Text
              style={[
                styles.tipoButtonText,
                tipoUsuario === 'cliente' && styles.tipoButtonTextActive,
              ]}>
              Sou Cliente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tipoButton,
              tipoUsuario === 'agricultor' && styles.tipoButtonActive,
            ]}
            onPress={() => setTipoUsuario('agricultor')}>
            <Ionicons
              name="leaf-outline"
              size={24}
              color={tipoUsuario === 'agricultor' ? '#FEFAE0' : '#283618'}
            />
            <Text
              style={[
                styles.tipoButtonText,
                tipoUsuario === 'agricultor' && styles.tipoButtonTextActive,
              ]}>
              Sou Agricultor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs do Formulário */}
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        {/* Exibição de Erro */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Botão de Cadastro */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCadastro}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FEFAE0" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Já tem uma conta?{' '}
          <Link href="/(auth)" asChild>
            <Text style={styles.footerLink}>Faça Login</Text>
          </Link>
        </Text>
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
    flexGrow: 1,
    padding: 25,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#283618',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 60, // Espaço para o botão de voltar
  },
  subtitle: {
    fontSize: 16,
    color: '#606C38',
    textAlign: 'center',
    marginBottom: 20,
  },
  tipoUsuarioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tipoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
    marginHorizontal: 5,
  },
  tipoButtonActive: {
    backgroundColor: '#606C38',
    borderColor: '#606C38',
  },
  tipoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    marginLeft: 10,
  },
  tipoButtonTextActive: {
    color: '#FEFAE0',
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#283618',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FEFAE0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
  },
  footerLink: {
    color: '#283618',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D90429',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});