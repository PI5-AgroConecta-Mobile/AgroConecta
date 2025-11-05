import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform, 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api'; 
import { ApiProduct } from '../../../types/api.types'; 
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Agricultor {
  id: string;
  name: string;
  rate: number;
  imgUrl: string;
}
interface ProdutoDetalhado extends ApiProduct {
  agricultor: Agricultor;
}

export default function DetalhesProdutoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState('1');
  const [isAgendando, setIsAgendando] = useState(false);
  const [dataAgendamento, setDataAgendamento] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Começa 24h no futuro
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (!id) {
      setError("ID do produto não encontrado.");
      setLoading(false);
      return;
    }
    const fetchProduto = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/getProductById/${id}`);
        setProduto(response.data);
      } catch (err: any) {
        console.error(err);
        setError("Não foi possível carregar o produto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduto();
  }, [id]);

  const onChangePicker = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    
    if (event.type === 'set' && selectedDate) {
      setDataAgendamento(selectedDate);
    }
  };

  const showDatepicker = () => {
    setPickerMode('date');
    setShowPicker(true);
  };

  const showTimepicker = () => {
    setPickerMode('time');
    setShowPicker(true);
  };

  const formatarDataHora = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAgendamento = async () => {
    const qtdeNum = parseInt(quantidade);

    if (isNaN(qtdeNum) || qtdeNum <= 0) {
      Alert.alert("Erro", "Por favor, insira uma quantidade válida.");
      return;
    }
    if (!produto) return;
    if (qtdeNum > produto.quantity) {
      Alert.alert("Stock Insuficiente", `Só existem ${produto.quantity} unidades disponíveis.`);
      return;
    }
    if (dataAgendamento.getTime() < Date.now()) {
      Alert.alert("Data Inválida", "Não é possível agendar uma data no passado.");
      return;
    }
    
    setIsAgendando(true);

    try {
      await api.post('/createAgendamento', {
        productId: produto.id,
        quantity: qtdeNum,
        scheduledFor: dataAgendamento.toISOString(), 
      });

      setIsAgendando(false);
      Alert.alert(
        "Agendamento Confirmado!",
        `O seu pedido de ${qtdeNum}x ${produto.name} foi enviado para ${produto.agricultor.name}.`,
        [{ text: "OK", onPress: () => router.push('/(app)/(tabs)/agendamentos') }]
      );

    } catch (err) {
      setIsAgendando(false);
      if (axios.isAxiosError(err) && err.response) {
        Alert.alert("Erro no Agendamento", err.response.data.err);
      } else {
        Alert.alert("Erro", "Não foi possível completar o agendamento.");
      }
    }
  };


  if (loading) { /* ... */ }
  if (error || !produto) { /* ... */ }
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2)}`;
  };

  if (!produto) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#283618" />
        </TouchableOpacity>
        <Image 
          source={{ uri: produto.imgUrl || 'https://via.placeholder.com/400' }} 
          style={styles.productImage} 
        />

        <View style={styles.container}>
          <Text style={styles.productName}>{produto.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(produto.price)}</Text>
          <Text style={styles.productQuantity}>Disponível: {produto.quantity} (Kg/Un/etc.)</Text>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Vendido por:</Text>
          <View style={styles.agricultorContainer}>
            <Image 
              source={{ uri: produto.agricultor.imgUrl || 'https://via.placeholder.com/100' }} 
              style={styles.agricultorImage} 
            />
            <View>
              <Text style={styles.agricultorName}>{produto.agricultor.name}</Text>
              <Text style={styles.agricultorRating}>Avaliação: {produto.agricultor.rate.toFixed(1)}/5.0</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Agendar Retirada</Text>
          
          <Text style={styles.label}>Quantidade desejada:</Text>
          <TextInput
            style={styles.input}
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
            placeholder="1"
          />

          <Text style={styles.label}>Data e Hora da Retirada:</Text>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
              <Ionicons name="calendar-outline" size={20} color="#283618" />
              <Text style={styles.dateButtonText}>Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={showTimepicker} style={styles.dateButton}>
              <Ionicons name="time-outline" size={20} color="#283618" />
              <Text style={styles.dateButtonText}>Hora</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.dateDisplay}>
            {formatarDataHora(dataAgendamento)}
          </Text>

           <TouchableOpacity 
            style={[styles.button, isAgendando && styles.buttonDisabled]} 
            onPress={handleAgendamento}
            disabled={isAgendando}
          >
            {isAgendando ? (
              <ActivityIndicator size="small" color="#FEFAE0" />
            ) : (
              <>
                <Ionicons name="calendar-outline" size={20} color="#FEFAE0" />
                <Text style={styles.buttonText}>Agendar Retirada</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dataAgendamento}
          mode={pickerMode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangePicker}
          minimumDate={new Date()} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 20, padding: 8 },
  productImage: { width: '100%', height: 300 },
  productName: { fontSize: 28, fontWeight: 'bold', color: '#283618', marginBottom: 8 },
  productPrice: { fontSize: 24, fontWeight: '600', color: '#606C38', marginBottom: 8 },
  productQuantity: { fontSize: 16, color: '#555', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#283618', marginBottom: 15 },
  agricultorContainer: { flexDirection: 'row', alignItems: 'center' },
  agricultorImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  agricultorName: { fontSize: 18, fontWeight: '600', color: '#333' },
  agricultorRating: { fontSize: 14, color: '#606C38' },
  button: { backgroundColor: '#283618', padding: 15, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#A9A9A9' },
  buttonText: { color: '#FEFAE0', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  errorText: { textAlign: 'center', fontSize: 16, color: '#D90429', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 },
  input: { height: 50, backgroundColor: '#F0F0F0', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 10 },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    marginLeft: 8,
  },
  dateDisplay: {
    fontSize: 18,
    fontWeight: '600',
    color: '#606C38',
    textAlign: 'center',
    marginBottom: 20,
  },
});