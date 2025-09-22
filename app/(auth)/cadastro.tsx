import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CadastroScreen() {
  const [senha, setSenha] = useState('');
  const [requisitos, setRequisitos] = useState({
    tamanho: false,
    maiuscula: false,
    minuscula: false,
    numero: false,
    especial: false,
  });

  const verificarRequisitos = (senhaInput: string) => {
    setRequisitos({
      tamanho: senhaInput.length >= 8,
      maiuscula: /[A-Z]/.test(senhaInput),
      minuscula: /[a-z]/.test(senhaInput),
      numero: /\d/.test(senhaInput),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(senhaInput),
    });
  };

  const handleSenhaChange = (text: string) => {
    setSenha(text);
    verificarRequisitos(text);
  };
  
  const isSenhaValida = Object.values(requisitos).every(Boolean);

  const handleSubmit = () => {
    if (!isSenhaValida) {
      Alert.alert('Senha Inválida', 'Por favor, certifique-se de que sua senha atende a todos os requisitos.');
      return;
    }
    // Lógica de cadastro aqui
    Alert.alert('Sucesso!', 'Cadastro realizado com sucesso.', [
      { text: 'OK', onPress: () => router.replace('/(auth)/loginCliente') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../../assets/images/logo-escura.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput placeholder="Nome completo" style={styles.input} />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={handleSenhaChange}
        />
        
        {/* Requisitos da Senha */}
        <View style={styles.requisitosContainer}>
          <Text style={requisitos.tamanho ? styles.valido : styles.invalido}>
            ✓ No mínimo 8 caracteres
          </Text>
          <Text style={requisitos.maiuscula ? styles.valido : styles.invalido}>
            ✓ Pelo menos 1 letra maiúscula
          </Text>
          <Text style={requisitos.minuscula ? styles.valido : styles.invalido}>
            ✓ Pelo menos 1 letra minúscula
          </Text>
          <Text style={requisitos.numero ? styles.valido : styles.invalido}>
            ✓ Pelo menos 1 número
          </Text>
          <Text style={requisitos.especial ? styles.valido : styles.invalido}>
            ✓ Pelo menos 1 caractere especial
          </Text>
        </View>

        <TextInput placeholder="CPF" style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="CEP" style={styles.input} keyboardType="numeric" />

        <TouchableOpacity
          style={[styles.button, !isSenhaValida && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isSenhaValida}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <Link href="/(auth)/loginCliente" style={styles.backLink}>
          <Text>Voltar para o Login</Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
  },
  scrollContainer: {
    flexGrow: 1,
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
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(40, 54, 24, 0.05)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#283618',
    marginBottom: 10,
  },
  requisitosContainer: {
    width: '100%',
    marginBottom: 15,
    paddingLeft: 5,
  },
  valido: {
    color: 'green',
  },
  invalido: {
    color: 'red',
  },
  button: {
    width: '100%',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    marginTop: 20,
    fontSize: 16,
    color: '#283618',
  },
});