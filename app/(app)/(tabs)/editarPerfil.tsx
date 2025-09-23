import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Componente reutilizável para cada campo do formulário
type FormRowProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
};

const FormRow: React.FC<FormRowProps> = ({ icon, label, value, placeholder, secureTextEntry = false }) => (
    <View style={styles.formRow}>
        <Ionicons name={icon} size={24} color="#606C38" style={styles.inputIcon} />
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                defaultValue={value}
                secureTextEntry={secureTextEntry}
            />
        </View>
    </View>
);

export default function EditarPerfilScreen() {
    const handleSaveChanges = () => {
        // Lógica para salvar as alterações no futuro
        Alert.alert("Sucesso!", "Seu perfil foi atualizado.", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Editar Perfil' }} />
      <ScrollView>
        <View style={styles.container}>
            {/* Seção da Foto de Perfil */}
            <View style={styles.profilePicContainer}>
                <Image
                    source={require('../../../assets/images/Perfil-Cliente.jpeg')}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.changePicButton}>
                    <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Formulário de Edição */}
            <View style={styles.form}>
                <FormRow icon="person-outline" label="Nome Completo" value="Samer Halat" placeholder="Seu nome completo" />
                <FormRow icon="mail-outline" label="Email" value="samer.halat@email.com" placeholder="Seu email" />
                <FormRow icon="lock-closed-outline" label="Nova Senha" placeholder="Deixe em branco para não alterar" secureTextEntry value={undefined} />
                <FormRow icon="lock-closed-outline" label="Confirmar Nova Senha" placeholder="Confirme sua nova senha" secureTextEntry />
            </View>
        </View>
      </ScrollView>
       {/* Botão de Salvar Fixo no Fim da Tela */}
      <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F7F2',
    },
    container: {
        padding: 20,
    },
    profilePicContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    changePicButton: {
        position: 'absolute',
        bottom: 0,
        right: '35%',
        backgroundColor: '#283618',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    form: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    inputIcon: {
        marginHorizontal: 10,
    },
    inputContainer: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        color: '#888',
    },
    input: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 5,
    },
    footer: {
        padding: 20,
        backgroundColor: '#F8F7F2',
    },
    saveButton: {
        backgroundColor: '#283618',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FEFAE0',
        fontSize: 18,
        fontWeight: 'bold',
    },
});