import { router, Link } from 'expo-router';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginClienteScreen() {
  const handleLogin = () => {
    // No futuro, aqui teremos a lógica de autenticação.
    // Por agora, vamos apenas navegar para a home.
    router.replace('/(app)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Image
        source={require('../../assets/images/logo-clara.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>LOGIN</Text>

      <TextInput
        placeholder="Digite seu e-mail aqui"
        style={styles.input}
        placeholderTextColor="#D4D8C8"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Digite sua senha aqui"
        style={styles.input}
        placeholderTextColor="#D4D8C8"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <View style={styles.linksContainer}>
        <Link href="/cadastro" style={styles.link}>
          Cadastre-se
        </Link>
        <Text style={styles.separator}> | </Text>
        <Link href="/recuperarSenha" style={styles.link}>
          Esqueci minha senha
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#283618',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: '#FEFAE0',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#FEFAE0',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#FEFAE0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#283618',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  link: {
    color: '#FEFAE0',
    fontSize: 16,
  },
  separator: {
    color: '#FEFAE0',
    fontSize: 16,
  },
});