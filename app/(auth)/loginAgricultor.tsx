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

export default function LoginAgricultorScreen() {
  const handleLogin = () => {
    // Navega para a home do agricultor (vamos criar essa rota depois)
    router.replace('/(app)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Image
        source={require('../../assets/images/logo-escura.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>LOGIN</Text>

      <TextInput
        placeholder="Digite seu e-mail aqui"
        style={styles.input}
        placeholderTextColor="#606C38"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Digite sua senha aqui"
        style={styles.input}
        placeholderTextColor="#606C38"
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
    backgroundColor: '#FEFAE0',
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
    color: '#283618',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(40, 54, 24, 0.1)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#283618',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#283618',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FEFAE0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  link: {
    color: '#283618',
    fontSize: 16,
  },
  separator: {
    color: '#283618',
    fontSize: 16,
  },
});