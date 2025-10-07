import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function FarmProfileScreen() {
    // No futuro, estes dados virão da fazenda logada
    const [nomeFazenda, setNomeFazenda] = useState('Horta da Clara');
    const [endereco, setEndereco] = useState('Estrada do Sol, 123, Piracicaba-SP');
    const [horarios, setHorarios] = useState('Segunda a Sábado, das 8:00 às 16:00');
    const [descricao, setDescricao] = useState('Cultivamos alimentos orgânicos com muito carinho e respeito pela natureza.');

    const handleSaveChanges = () => {
        Alert.alert("Sucesso!", "O perfil da sua fazenda foi atualizado.", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
            {/* Seção da Foto de Capa */}
            <View style={styles.coverPicContainer}>
                <Image
                    source={require('../../../assets/images/fazenda1.jpg')}
                    style={styles.coverImage}
                />
                <TouchableOpacity style={styles.changePicButton}>
                    <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Formulário de Edição */}
            <Text style={styles.sectionTitle}>Informações da Fazenda</Text>
            <View style={styles.form}>
                <Text style={styles.label}>Nome da Fazenda</Text>
                <TextInput style={styles.input} value={nomeFazenda} onChangeText={setNomeFazenda} />

                <Text style={styles.label}>Endereço</Text>
                <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} />

                <Text style={styles.label}>Horários de Retirada</Text>
                <TextInput style={styles.input} value={horarios} onChangeText={setHorarios} />

                <Text style={styles.label}>Descrição Curta</Text>
                <TextInput style={[styles.input, styles.textArea]} multiline value={descricao} onChangeText={setDescricao} />
            </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
    container: { paddingBottom: 20 },
    coverPicContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: 180,
    },
    changePicButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
    },
    form: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B5E20',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 20,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 20,
        backgroundColor: '#F0F4F8',
    },
    saveButton: {
        backgroundColor: '#2E7D32',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});