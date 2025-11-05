import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
export default function LoginClienteScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Por favor, preencha email e senha.');
      return;
    }

    setLoading(true);
    try {
      const user = await signIn(email, password);
      
      if (user.userType === 1) { 
        router.replace('/(farmer)' as any); 
      } else { 
        router.replace('/(app)' as any); 
      }

    } catch (e: any) {
      setLoading(false);
      setError(e.message || 'Usuário ou senha inválidos.');
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#283618" />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../../assets/images/SimboloClienteEscuro.png')} // Ajuste o caminho se necessário
          style={styles.logo}
        />
        <Text style={styles.title}>Login Cliente</Text>
        <Text style={styles.subtitle}>Bem-vindo de volta!</Text>

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
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* 7. Exibição de Erro */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FEFAE0" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/recuperarSenha" asChild>
          <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
        </Link>

        <Text style={styles.footerText}>
          Não tem uma conta?{' '}
          <Link href="/(auth)/cadastro" asChild>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </Link>
        </Text>
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
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#283618',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#606C38',
    textAlign: 'center',
    marginBottom: 30,
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
  forgotPassword: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  footerText: {
    marginTop: 30,
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