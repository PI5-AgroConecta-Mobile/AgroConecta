import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api'; 
import axios from 'axios';
import { ApiProduct } from '../../types/api.types'; 

export default function GerenciarProdutoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('1');
  const [harvestType, setHarvestType] = useState('1');
  const [unityType, setUnityType] = useState('1');
  const [imgUrl, setImgUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  useEffect(() => {
    if (params.product && typeof params.product === 'string') {
      try {
        const productData = JSON.parse(params.product) as ApiProduct;
        
        setName(productData.name);
        setPrice(productData.price.toString());
        setQuantity(productData.quantity.toString());
        setType(productData.type.toString());
        setHarvestType(productData.harvestType.toString());
        setUnityType(productData.unityType.toString());
        setImgUrl(productData.imgUrl || '');
        
        setIsEditing(true);
        setCurrentProductId(productData.id);
      } catch (e) {
        console.error("Erro ao analisar produto:", e);
      }
    } else {
      setName('');
      setPrice('');
      setQuantity('');
      setType('1');
      setHarvestType('1');
      setUnityType('1');
      setImgUrl('');
      
      setIsEditing(false);
      setCurrentProductId(null);
    }
  }, [params.product]); 

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (!name || !price || !quantity) {
      setError('Nome, Preço e Quantidade são obrigatórios.');
      setLoading(false);
      return;
    }

    const produtoData = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      type: parseInt(type),
      harvestType: parseInt(harvestType),
      unityType: parseInt(unityType),
      imgUrl: imgUrl,
      harvestDate: new Date().toISOString(), 
    };

    try {
      if (isEditing && currentProductId) {
        // --- MODO EDIÇÃO ---
        await api.put('/updateProduct', {
          ...produtoData,
          productId: currentProductId 
        });
        
        Alert.alert('Sucesso!', 'Produto atualizado.', [
          { text: 'OK', onPress: () => router.back() }
        ]);

      } else {
        await api.post('/createProduct', produtoData);
        
        Alert.alert('Sucesso!', 'Produto criado.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
      
      setLoading(false);

    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.err || 'Erro ao salvar o produto.');
        console.error('Erro API:', err.response.data);
      } else {
        setError('Não foi possível ligar ao servidor. Tente novamente.');
        console.error(err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#283618" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </Text>
        </View>

        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput style={styles.input} placeholder="Ex: Tomate Orgânico" value={name} onChangeText={setName} />
        
        <Text style={styles.label}>Preço</Text>
        <TextInput style={styles.input} placeholder="Ex: 10.99" value={price} onChangeText={setPrice} keyboardType="numeric" />
        
        <Text style={styles.label}>Quantidade Disponível</Text>
        <TextInput style={styles.input} placeholder="Ex: 50" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
        
        <Text style={styles.label}>Tipo de Unidade (1=Kg, 2=Un, 3=Dúzia)</Text>
        <TextInput style={styles.input} value={unityType} onChangeText={setUnityType} keyboardType="numeric" />
        
        <Text style={styles.label}>Tipo de Produto (1=Fruta, 2=Verdura, ...)</Text>
        <TextInput style={styles.input} value={type} onChangeText={setType} keyboardType="numeric" />
        
        <Text style={styles.label}>Tipo de Colheita (1=Orgânico, 2=Não)</Text>
        <TextInput style={styles.input} value={harvestType} onChangeText={setHarvestType} keyboardType="numeric" />
        
        <Text style={styles.label}>URL da Imagem (Opcional)</Text>
        <TextInput style={styles.input} placeholder="https://..." value={imgUrl} onChangeText={setImgUrl} autoCapitalize="none" />
        
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FEFAE0" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? 'Salvar Alterações' : 'Salvar Produto'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
  container: { flexGrow: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 10, marginRight: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#283618' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 },
  input: { height: 50, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  button: { backgroundColor: '#283618', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  buttonDisabled: { backgroundColor: '#A9A9A9' },
  buttonText: { color: '#FEFAE0', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#D90429', textAlign: 'center', marginTop: 15, fontSize: 14, fontWeight: '600' },
});