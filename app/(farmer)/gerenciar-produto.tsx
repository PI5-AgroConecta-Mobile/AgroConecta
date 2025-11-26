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
  Modal,
  FlatList
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api'; 
import axios from 'axios';
import { ApiProduct } from '../../types/api.types'; 

const UNIT_TYPES = [
  { id: '1', label: 'Quilo (Kg)' },
  { id: '2', label: 'Unidade (Un)' },
  { id: '3', label: 'Dúzia' },
  { id: '4', label: 'Maço' },
];

const PRODUCT_TYPES = [
  { id: '1', label: 'Frutas' },
  { id: '2', label: 'Verduras/Legumes' },
  { id: '3', label: 'Laticínios' },
  { id: '4', label: 'Outros' },
];

const HARVEST_TYPES = [
  { id: '1', label: 'Orgânico (Sem agrotóxicos)' },
  { id: '2', label: 'Convencional' },
  { id: '3', label: 'Hidropônico' },
];

export default function GerenciarProdutoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); 
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  
  // States para seleção
  const [type, setType] = useState('1');
  const [harvestType, setHarvestType] = useState('1');
  const [unityType, setUnityType] = useState('1');

  // Controle dos Modais de Seleção
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectionField, setCurrentSelectionField] = useState<'type' | 'harvest' | 'unity' | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  useEffect(() => {
    if (params.product && typeof params.product === 'string') {
      try {
        const productData = JSON.parse(params.product) as ApiProduct;
        
        setName(productData.name);
        setDescription(productData.description || '');
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
      description,
      price: parseFloat(price.replace(',', '.')), 
      quantity: parseInt(quantity),
      type: parseInt(type),
      harvestType: parseInt(harvestType),
      unityType: parseInt(unityType),
      imgUrl: imgUrl,
      harvestDate: new Date().toISOString(), 
    };

    try {
      if (isEditing && currentProductId) {
        await api.put('/updateProduct', {
          ...produtoData,
          productId: currentProductId 
        });
        Alert.alert('Sucesso!', 'Produto atualizado.', [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        await api.post('/createProduct', produtoData);
        Alert.alert('Sucesso!', 'Produto criado.', [{ text: 'OK', onPress: () => router.back() }]);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.err || 'Erro ao salvar o produto.');
      } else {
        setError('Não foi possível ligar ao servidor. Tente novamente.');
      }
    }
  };

  const openSelector = (field: 'type' | 'harvest' | 'unity') => {
    setCurrentSelectionField(field);
    setModalVisible(true);
  };

  const getLabel = (options: any[], value: string) => {
    const found = options.find(opt => opt.id === value);
    return found ? found.label : 'Selecione';
  };

  const renderOption = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.optionItem} 
      onPress={() => {
        if (currentSelectionField === 'type') setType(item.id);
        if (currentSelectionField === 'harvest') setHarvestType(item.id);
        if (currentSelectionField === 'unity') setUnityType(item.id);
        setModalVisible(false);
      }}
    >
      <Text style={styles.optionText}>{item.label}</Text>
      {((currentSelectionField === 'type' && type === item.id) || 
        (currentSelectionField === 'harvest' && harvestType === item.id) ||
        (currentSelectionField === 'unity' && unityType === item.id)) && 
        <Ionicons name="checkmark" size={20} color="#606C38" />
      }
    </TouchableOpacity>
  );

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

        <Text style={styles.label}>Descrição (Opcional)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Conte mais sobre o produto..." 
          value={description} 
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={3}
        />
        
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Preço (R$)</Text>
            <TextInput style={styles.input} placeholder="0.00" value={price} onChangeText={setPrice} keyboardType="numeric" />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Quantidade</Text>
            <TextInput style={styles.input} placeholder="0" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
          </View>
        </View>
        
        {/* SELETORES VISUAIS */}
        <Text style={styles.label}>Unidade de Medida</Text>
        <TouchableOpacity style={styles.selectorButton} onPress={() => openSelector('unity')}>
          <Text style={styles.selectorText}>{getLabel(UNIT_TYPES, unityType)}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.label}>Categoria</Text>
        <TouchableOpacity style={styles.selectorButton} onPress={() => openSelector('type')}>
          <Text style={styles.selectorText}>{getLabel(PRODUCT_TYPES, type)}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.label}>Tipo de Cultivo</Text>
        <TouchableOpacity style={styles.selectorButton} onPress={() => openSelector('harvest')}>
          <Text style={styles.selectorText}>{getLabel(HARVEST_TYPES, harvestType)}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.label}>URL da Imagem (Opcional)</Text>
        <TextInput style={styles.input} placeholder="https://..." value={imgUrl} onChangeText={setImgUrl} autoCapitalize="none" />
        
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FEFAE0" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditing ? 'Salvar Alterações' : 'Publicar Produto'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DE SELEÇÃO */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione uma opção</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={currentSelectionField === 'type' ? PRODUCT_TYPES : currentSelectionField === 'harvest' ? HARVEST_TYPES : UNIT_TYPES}
              keyExtractor={item => item.id}
              renderItem={renderOption}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
  container: { flexGrow: 1, padding: 20, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 10, marginRight: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#283618' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  input: { height: 50, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  col: { flex: 1 },
  
  // Estilos do seletor
  selectorButton: {
    height: 50, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 15,
    borderWidth: 1, borderColor: '#E0E0E0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  selectorText: { fontSize: 16, color: '#333' },

  button: { backgroundColor: '#283618', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 40 },
  buttonDisabled: { backgroundColor: '#A9A9A9' },
  buttonText: { color: '#FEFAE0', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#D90429', textAlign: 'center', marginTop: 15, fontSize: 14, fontWeight: '600' },

  // Modal Styles
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#283618' },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  optionText: { fontSize: 16, color: '#333' }
});