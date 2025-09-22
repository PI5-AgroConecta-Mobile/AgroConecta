import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SobreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o AgroConecta</Text>
      <Text style={styles.text}>
        Este é um aplicativo para conectar agricultores e consumidores...
      </Text>

      {/* --- BOTÃO PARA VOLTAR AO INÍCIO --- */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(app)/(tabs)')} // Navega para a tela inicial
      >
        <Text style={styles.buttonText}>Voltar para o Início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#283618',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FEFAE0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});