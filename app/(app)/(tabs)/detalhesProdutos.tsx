import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, ScrollView, Image, 
  TouchableOpacity, ActivityIndicator, Alert, TextInput, Platform, Linking
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api'; 
import { ApiProduct } from '../../../types/api.types'; 
import DateTimePicker from '@react-native-community/datetimepicker';

interface Agricultor {
  id: string;
  name: string;
  rate: number;
  imgUrl: string;
  contact?: string; 
}

interface ProdutoDetalhado extends ApiProduct {
  agricultor: Agricultor;
  contact?: string; 
}

export default function DetalhesProdutoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState('1');
  const [isAgendando, setIsAgendando] = useState(false);
  const [dataAgendamento, setDataAgendamento] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (!id) return;
    const fetchProduto = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/getProductById/${id}`);
        setProduto(response.data);
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar o produto.");
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

  const showDatepicker = () => { setPickerMode('date'); setShowPicker(true); };
  const showTimepicker = () => { setPickerMode('time'); setShowPicker(true); };

  const handleVerNoMapa = () => {
    if (produto?.latitude && produto?.longitude) {
      router.push({
        pathname: '/(app)/(tabs)/mapa',
        params: { lat: produto.latitude, long: produto.longitude, title: produto.name }
      });
    } else {
      Alert.alert("Localização", "O produtor não cadastrou a localização exata.");
    }
  };

  const handleWhatsApp = () => {
    const contact = produto?.contact || produto?.agricultor?.contact;
    
    if (contact) {
      const cleanNumber = contact.replace(/\D/g, '');
      const url = `https://wa.me/55${cleanNumber}?text=Olá! Vi seu produto ${produto?.name} no AgroConecta.`;
      Linking.openURL(url);
    } else {
      Alert.alert("Contato", "Este produtor não cadastrou um número de WhatsApp.");
    }
  };

  const handleAgendamento = async () => {
    const qtdeNum = parseInt(quantidade);
    if (isNaN(qtdeNum) || qtdeNum <= 0) return Alert.alert("Erro", "Quantidade inválida.");
    if (!produto) return;
    
    setIsAgendando(true);
    try {
      await api.post('/createAgendamento', {
        productId: produto.id,
        quantity: qtdeNum,
        scheduledFor: dataAgendamento.toISOString(), 
      });
      setIsAgendando(false);
      Alert.alert("Sucesso!", "Pedido enviado.", [{ text: "OK", onPress: () => router.push('/(app)/(tabs)/agendamentos') }]);
    } catch (err) {
      setIsAgendando(false);
      Alert.alert("Erro", "Não foi possível completar o agendamento.");
    }
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#283618"/></View>;
  if (!produto) return null;

  const unidadeMap = { 1: 'Kg', 2: 'Un', 3: 'Dúzia', 4: 'Maço' };
  // @ts-ignore
  const unidadeTexto = unidadeMap[produto.unityType] || 'Un';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#283618" />
        </TouchableOpacity>
        
        <Image source={{ uri: produto.imgUrl || 'https://via.placeholder.com/400' }} style={styles.productImage} />

        <View style={styles.container}>
          <Text style={styles.productName}>{produto.name}</Text>
          <Text style={styles.productPrice}>R$ {produto.price.toFixed(2)} / {unidadeTexto}</Text>
          <Text style={styles.productQuantity}>Estoque: {produto.quantity} {unidadeTexto}</Text>

          {produto.description && (
            <View style={styles.descriptionBox}>
              <Text style={styles.sectionTitle}>Sobre o produto</Text>
              <Text style={styles.descriptionText}>{produto.description}</Text>
            </View>
          )}

          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Produzido por:</Text>
          <View style={styles.agricultorContainer}>
            <Image source={{ uri: produto.agricultor.imgUrl || 'https://via.placeholder.com/100' }} style={styles.agricultorImage} />
            <View style={{flex: 1}}>
              <Text style={styles.agricultorName}>{produto.agricultor.name}</Text>
              
              <View style={styles.actionButtonsRow}>
                  <TouchableOpacity style={styles.actionButton} onPress={handleVerNoMapa}>
                     <Ionicons name="location-sharp" size={16} color="#FFF" />
                     <Text style={styles.actionButtonText}>Mapa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={handleWhatsApp}>
                     <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
                     <Text style={styles.actionButtonText}>WhatsApp</Text>
                  </TouchableOpacity>
              </View>

            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Agendar Retirada</Text>
          
          {/* --- BLOCO DE QUANTIDADE, DATA E HORA --- */}
          <View style={styles.rowInput}>
             <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Quantidade:</Text>
                <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholder="1" />
             </View>
             
             <View style={{flex: 2, flexDirection: 'row', gap: 8}}>
                <View style={{flex: 1}}>
                   <Text style={styles.label}>Data:</Text>
                   <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
                     <Text style={styles.dateButtonText}>{dataAgendamento.toLocaleDateString()}</Text>
                   </TouchableOpacity>
                </View>
                
                <View style={{flex: 1}}>
                   <Text style={styles.label}>Hora:</Text>
                   <TouchableOpacity onPress={showTimepicker} style={styles.dateButton}>
                     <Text style={styles.dateButtonText}>{dataAgendamento.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                   </TouchableOpacity>
                </View>
             </View>
          </View>
          
           <TouchableOpacity style={[styles.button, isAgendando && styles.buttonDisabled]} onPress={handleAgendamento} disabled={isAgendando}>
            {isAgendando ? <ActivityIndicator size="small" color="#FEFAE0" /> : (
              <>
                <Ionicons name="bag-check-outline" size={22} color="#FEFAE0" />
                <Text style={styles.buttonText}>Confirmar Pedido</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {showPicker && <DateTimePicker value={dataAgendamento} mode={pickerMode} is24Hour={true} display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onChangePicker} minimumDate={new Date()} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 8 },
  productImage: { width: '100%', height: 280, resizeMode: 'cover' },
  
  productName: { fontSize: 26, fontWeight: 'bold', color: '#283618', marginBottom: 5 },
  productPrice: { fontSize: 24, fontWeight: '600', color: '#606C38', marginBottom: 5 },
  productQuantity: { fontSize: 14, color: '#888', marginBottom: 15 },
  descriptionBox: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 10, marginTop: 5 },
  descriptionText: { fontSize: 15, color: '#555', lineHeight: 22, marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#283618', marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 },
  
  agricultorContainer: { flexDirection: 'row', alignItems: 'center' },
  agricultorImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  agricultorName: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  
  actionButtonsRow: { flexDirection: 'row', gap: 10 },
  actionButton: { flexDirection: 'row', backgroundColor: '#BC6C25', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center', gap: 5 },
  whatsappButton: { backgroundColor: '#25D366' },
  actionButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  rowInput: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
  input: { height: 50, backgroundColor: '#F8F8F8', borderRadius: 10, paddingHorizontal: 10, fontSize: 16, borderWidth: 1, borderColor: '#DDD' },
  dateButton: { height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 10, borderWidth: 1, borderColor: '#DDD' },
  dateButtonText: { fontSize: 14, color: '#283618', fontWeight: '500' },
  
  button: { backgroundColor: '#283618', padding: 16, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 3.84, elevation: 5 },
  buttonDisabled: { backgroundColor: '#A9A9A9' },
  buttonText: { color: '#FEFAE0', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});