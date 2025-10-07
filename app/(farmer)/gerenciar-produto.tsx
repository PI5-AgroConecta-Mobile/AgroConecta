import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GerenciarProdutoScreen() {
    const params = useLocalSearchParams();
    const isEditing = params.id ? true : false;

    // Estados para os campos do formulário
    const [imagem, setImagem] = useState<string | null>(null);
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [estoque, setEstoque] = useState('');
    const [descricao, setDescricao] = useState('');

    useEffect(() => {
        // Se estiver editando, pré-carrega os dados (simulação)
        if (isEditing) {
            setNome(String(params.nome));
            setPreco(String(params.preco));
            setEstoque(String(params.estoque));
        }
    }, [params]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!nome || !preco || !estoque) {
            Alert.alert("Campos Obrigatórios", "Por favor, preencha o nome, preço e estoque.");
            return;
        }
        const produto = { id: params.id, imagem, nome, preco, estoque, descricao };
        console.log("Salvando produto:", produto); 
        
        Alert.alert(
            `Produto ${isEditing ? 'Atualizado' : 'Criado'}!`,
            `O produto "${nome}" foi salvo com sucesso.`,
            [{ text: "OK", onPress: () => router.back() }]
        );
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: isEditing ? `Editar ${params.nome}` : 'Adicionar Novo Produto' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imagem ? (
                <Image source={{ uri: imagem }} style={styles.productImage} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera-outline" size={40} color="#A9A9A9" />
                    <Text style={styles.imagePlaceholderText}>Escolher Foto</Text>
                </View>
            )}
        </TouchableOpacity>

        <View style={styles.form}>
            <Text style={styles.label}>Nome do Produto</Text>
            <TextInput style={styles.input} placeholder="Ex: Tomate Orgânico" value={nome} onChangeText={setNome} />

            <Text style={styles.label}>Preço</Text>
            <TextInput style={styles.input} placeholder="Ex: R$ 10,99/kg" value={preco} onChangeText={setPreco} />

            <Text style={styles.label}>Estoque Disponível</Text>
            <TextInput style={styles.input} placeholder="Ex: 20 (em kg, un, dúzia, etc.)" value={estoque} onChangeText={setEstoque} keyboardType="numeric" />
            
            <Text style={styles.label}>Descrição</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva seu produto, tipo de colheita, etc." multiline value={descricao} onChangeText={setDescricao} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Produto</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
    container: { padding: 20 },
    imagePicker: { width: '100%', height: 200, backgroundColor: '#E8F5E9', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 30, borderWidth: 2, borderColor: '#A5D6A7', borderStyle: 'dashed' },
    productImage: { width: '100%', height: '100%', borderRadius: 10 },
    imagePlaceholder: { alignItems: 'center' },
    imagePlaceholderText: { marginTop: 10, color: '#A9A9A9', fontSize: 16 },
    form: {},
    label: { fontSize: 16, fontWeight: '500', color: '#1B5E20', marginBottom: 8 },
    input: { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#DDD', marginBottom: 20 },
    textArea: { height: 120, textAlignVertical: 'top' },
    saveButton: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});