import { Link, router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function RecuperarSenhaScreen() {
  const handleSend = () => {
    // Lógica de recuperação aqui
    Alert.alert(
      'E-mail Enviado',
      'Um link para redefinição de senha foi enviado para o seu e-mail.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image
        source={require('../../assets/images/logo-escura.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Digite seu e-mail para receber as instruções de redefinição.
      </Text>

      <TextInput
        placeholder="Seu e-mail"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>

      <Link href="/(auth)" style={styles.backLink} asChild>
        <Text>Voltar para o Login</Text>
      </Link>
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
    width: 200,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#283618',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#606C38',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: '80%',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(40, 54, 24, 0.05)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#283618',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#283618',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FEFAE0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    marginTop: 30,
    fontSize: 16,
    color: '#283618',
  },
});