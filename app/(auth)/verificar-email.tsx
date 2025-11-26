import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
import { generateVerificationCode, storeVerificationCode, verifyCode } from '../../services/emailService';

export default function VerificarEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const tipoUsuario = params.tipoUsuario as string;
  const devCode = params.code as string | undefined; // Código para desenvolvimento

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [showDevCode, setShowDevCode] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown para reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Se colar múltiplos dígitos
      const digits = value.slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      // Focar no último input preenchido
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Avançar para o próximo input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Por favor, preencha todos os dígitos do código.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verificar código localmente (sem backend)
      const isValid = await verifyCode(email, verificationCode);

      if (isValid) {
        Alert.alert(
          'Email verificado!',
          'Sua conta foi verificada com sucesso. Faça o login para continuar.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(auth)');
              },
            },
          ]
        );
      } else {
        setLoading(false);
        setError('Código inválido ou expirado. Tente novamente.');
        // Limpar código em caso de erro
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setLoading(false);
      setError('Erro ao verificar email. Tente novamente.');
      console.error(err);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setResending(true);
    setError(null);

    try {
      // Gerar novo código e armazenar
      const newCode = generateVerificationCode();
      await storeVerificationCode(email, newCode);
      
      setCountdown(60); // 60 segundos de espera
      
      // Em desenvolvimento, mostrar o código
      if (__DEV__) {
        Alert.alert(
          'Código Reenviado',
          `Novo código gerado: ${newCode}\n\n(Modo desenvolvimento - código visível apenas para testes)`
        );
      } else {
        Alert.alert('Sucesso', 'Código de verificação reenviado para seu email.');
      }
    } catch (err) {
      setError('Erro ao reenviar código. Tente novamente.');
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  // Mostrar código em desenvolvimento
  useEffect(() => {
    if (__DEV__ && devCode) {
      setShowDevCode(true);
    }
  }, [devCode]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#283618" />
          </TouchableOpacity>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={80} color="#606C38" />
        </View>

        <Text style={styles.title}>Verifique seu Email</Text>
        <Text style={styles.subtitle}>
          Enviamos um código de verificação de 6 dígitos para:
        </Text>
        <Text style={styles.emailText}>{email}</Text>

        {/* Mostrar código em desenvolvimento */}
        {__DEV__ && showDevCode && devCode && (
          <View style={styles.devCodeContainer}>
            <Text style={styles.devCodeLabel}>Modo Desenvolvimento:</Text>
            <Text style={styles.devCodeText}>{devCode}</Text>
            <Text style={styles.devCodeNote}>
              (Este código só aparece em desenvolvimento)
            </Text>
          </View>
        )}

        {/* Inputs do código */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[styles.codeInput, digit && styles.codeInputFilled]}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Exibição de Erro */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Botão de Verificar */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FEFAE0" />
          ) : (
            <Text style={styles.buttonText}>Verificar Email</Text>
          )}
        </TouchableOpacity>

        {/* Reenviar código */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Não recebeu o código?</Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={resending || countdown > 0}
            style={styles.resendButton}>
            {resending ? (
              <ActivityIndicator size="small" color="#283618" />
            ) : (
              <Text style={[styles.resendButtonText, countdown > 0 && styles.resendButtonDisabled]}>
                {countdown > 0 ? `Reenviar em ${countdown}s` : 'Reenviar código'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          Verifique sua caixa de entrada e spam. O código expira em 10 minutos.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  iconContainer: {
    alignItems: 'center',
    marginTop: 60,
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
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    textAlign: 'center',
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 50,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#283618',
  },
  codeInputFilled: {
    borderColor: '#606C38',
    backgroundColor: '#FEFAE0',
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
  errorText: {
    color: '#D90429',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#606C38',
    marginBottom: 8,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    color: '#283618',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    color: '#A9A9A9',
    textDecorationLine: 'none',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
  devCodeContainer: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFC107',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  devCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  devCodeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#283618',
    letterSpacing: 4,
    marginBottom: 8,
  },
  devCodeNote: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
  },
});