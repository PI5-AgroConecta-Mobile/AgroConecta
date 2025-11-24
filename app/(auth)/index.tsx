import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';

export default function UnifiedLoginScreen() {
  const [isFarmer, setIsFarmer] = useState(false); // false = Cliente, true = Agricultor
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();

  // Cores baseadas no tipo de usuário
  const primaryColor = isFarmer ? '#1B5E20' : '#E76F51'; // Verde para Agricultor, Laranja para Cliente
  const secondaryColor = isFarmer ? '#E8F5E9' : '#FFF3E0';

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // O signIn é genérico, o backend decide quem é o usuário pelo email
      const user = await signIn(email, password);
      
      // Verificação opcional de UX: Se o usuário logou com o tipo "errado" selecionado
      if (isFarmer && user.userType !== 1) {
        Alert.alert('Aviso', 'Você entrou como Cliente, mas estava na aba Agricultor. Redirecionando para a área de Clientes...');
      } else if (!isFarmer && user.userType === 1) {
        Alert.alert('Aviso', 'Você entrou como Agricultor, mas estava na aba Cliente. Redirecionando para a área de Agricultores...');
      }

      // O AuthContext ou o _layout.tsx raiz deve lidar com o redirecionamento baseado no userType
      // Se precisar forçar aqui:
      // if (user.userType === 1) router.replace('/(farmer)/(tabs)');
      // else router.replace('/(app)/(tabs)');

    } catch (error: any) {
      console.log(error);
      Alert.alert('Falha no Login', error.message || 'Verifique suas credenciais e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Logo Dinâmica */}
        <View style={styles.header}>
          <Image 
            source={isFarmer 
              ? require('../../assets/images/simbolo-agricultor.png') // Certifique-se que esta imagem existe
              : require('../../assets/images/SimboloClienteEscuro.png')    // Certifique-se que esta imagem existe
            } 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: primaryColor }]}>
            AgroConecta
          </Text>
          <Text style={styles.subtitle}>
            {isFarmer ? 'Área do Produtor Rural' : 'Produtos frescos na sua mesa'}
          </Text>
        </View>

        {/* Toggle / Seletor Deslizante */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, !isFarmer && styles.activeToggle, !isFarmer && { borderColor: primaryColor }]} 
            onPress={() => setIsFarmer(false)}
          >
            <Ionicons name="basket-outline" size={20} color={!isFarmer ? primaryColor : '#888'} />
            <Text style={[styles.toggleText, !isFarmer ? { color: primaryColor, fontWeight: 'bold' } : { color: '#888' }]}>Sou Cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.toggleButton, isFarmer && styles.activeToggle, isFarmer && { borderColor: primaryColor }]} 
            onPress={() => setIsFarmer(true)}
          >
            <Ionicons name="leaf-outline" size={20} color={isFarmer ? primaryColor : '#888'} />
            <Text style={[styles.toggleText, isFarmer ? { color: primaryColor, fontWeight: 'bold' } : { color: '#888' }]}>Sou Agricultor</Text>
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputContainer, { borderColor: primaryColor }]}>
              <Ionicons name="mail-outline" size={20} color="#666" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputContainer, { borderColor: primaryColor }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <Link href="/recuperarSenha" style={styles.forgotPassword}>
              <Text style={{ color: '#666' }}>Esqueci minha senha</Text>
            </Link>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: primaryColor }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <Link href="/cadastro" asChild>
              <TouchableOpacity>
                <Text style={[styles.signupText, { color: primaryColor }]}>
                  {isFarmer ? 'Cadastre sua Fazenda' : 'Cadastre-se Grátis'}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 140, height: 100, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  
  toggleContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 15, 
    padding: 4, 
    marginBottom: 30 
  },
  toggleButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    borderRadius: 12,
    gap: 8
  },
  activeToggle: { 
    backgroundColor: '#fff', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2,
    borderWidth: 1 
  },
  toggleText: { fontSize: 14, fontWeight: '500' },

  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 8, fontWeight: '600' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 50, 
    backgroundColor: '#FAFAFA' 
  },
  input: { flex: 1, fontSize: 16 },
  forgotPassword: { alignSelf: 'flex-end', marginTop: 8 },
  
  loginButton: { 
    height: 56, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 3
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, gap: 5 },
  footerText: { color: '#666' },
  signupText: { fontWeight: 'bold' }
});