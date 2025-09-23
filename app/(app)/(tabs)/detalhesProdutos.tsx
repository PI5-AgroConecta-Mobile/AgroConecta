import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

// Configuração do calendário (continua igual)
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'],
};
LocaleConfig.defaultLocale = 'pt-br';

// --- Lógica de Dados (Simulação - continua igual) ---
interface Produto {
    id: string; nome: string; produtor: string; precoUnitario: number; unidade: string; descricao: string; imagem: ImageSourcePropType;
}
const getProductDetails = (id: string | string[]): Produto => {
    const products: Record<string, Produto> = {
        '1': { id: '1', nome: 'Tomate Orgânico', produtor: 'Horta da Clara', precoUnitario: 10.99, unidade: 'kg', descricao: 'Tomates frescos e suculentos, cultivados sem agrotóxicos. Perfeitos para saladas, molhos e para comer puro.', imagem: require('../../../assets/images/tomate.jpg')},
        '2': { id: '2', nome: 'Alface Crespa', produtor: 'Sítio Verde', precoUnitario: 3.50, unidade: 'un', descricao: 'Folhas crocantes e saborosas, ideais para uma salada refrescante e saudável.', imagem: require('../../../assets/images/alface.jpg')},
    };
    return products[String(id)] || products['1'];
}
const horariosDoAgricultor = { inicio: 8, fim: 16 };
const gerarSlotsDeHorario = () => {
    const slots = [];
    for (let i = horariosDoAgricultor.inicio; i < horariosDoAgricultor.fim; i++) {
        slots.push(`${String(i).padStart(2, '0')}:00 - ${String(i + 1).padStart(2, '0')}:00`);
    }
    return slots;
};

// --- Tela Principal ---
export default function DetalhesProdutoScreen() {
  const { id } = useLocalSearchParams();
  const produto = getProductDetails(id);

  const [quantidade, setQuantidade] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  
  // --- MUDANÇA 1: O estado dos horários agora é um array ---
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const horariosDisponiveis = useMemo(() => gerarSlotsDeHorario(), []);
  const precoTotal = (produto.precoUnitario * quantidade).toFixed(2).replace('.', ',');

  // --- MUDANÇA 2: Nova função para lidar com a seleção de horários ---
  const handleSlotSelection = (slot: string) => {
    setSelectedSlots(prevSlots => {
      // Se o horário já está selecionado, remove-o (desmarca)
      if (prevSlots.includes(slot)) {
        return prevSlots.filter(s => s !== slot);
      }
      // Se ainda não atingiu o limite de 3, adiciona o novo horário
      if (prevSlots.length < 3) {
        return [...prevSlots, slot];
      }
      // Se já tem 3, mostra um alerta e não faz nada
      Alert.alert("Limite Atingido", "Você pode selecionar no máximo 3 horários.");
      return prevSlots;
    });
  };

  const handleConfirmar = () => {
    const horariosFormatados = selectedSlots.join(', ');
    Alert.alert(
      "Agendamento Confirmado!",
      `Sua retirada de ${quantidade} ${produto.unidade} de ${produto.nome} foi agendada para ${selectedDate.split('-').reverse().join('/')}.\n\nOpções de horário: ${horariosFormatados}.`,
      [{ text: "OK", onPress: () => router.push('/(app)/(tabs)') }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: produto.nome }} />
      <ScrollView>
        {/* ... Seção de Detalhes do Produto (continua igual) ... */}
        <Image source={produto.imagem} style={styles.headerImage} />
        <View style={styles.container}>
            <Text style={styles.producerName}>Vendido por: {produto.produtor}</Text>
            <Text style={styles.productName}>{produto.nome}</Text>
            <Text style={styles.description}>{produto.descricao}</Text>
            <View style={styles.separator} />
            <View style={styles.quantityContainer}>
                <Text style={styles.sectionTitle}>Quantidade ({produto.unidade})</Text>
                <View style={styles.quantitySelector}>
                    <TouchableOpacity onPress={() => setQuantidade(Math.max(1, quantidade - 1))}>
                        <Ionicons name="remove-circle-outline" size={32} color="#283618" />
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{quantidade}</Text>
                    <TouchableOpacity onPress={() => setQuantidade(quantidade + 1)}>
                        <Ionicons name="add-circle" size={32} color="#283618" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.separator} />

            {/* --- Seção de Agendamento (Atualizada) --- */}
            <Text style={styles.sectionTitle}>Agende a Retirada</Text>
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{ [selectedDate]: { selected: true, selectedColor: '#283618' } }}
                minDate={new Date().toISOString().split('T')[0]}
            />
            {selectedDate && (
                <>
                    <Text style={styles.subTitle}>Selecione até 3 horários para {selectedDate.split('-').reverse().join('/')}</Text>
                    <View style={styles.slotsContainer}>
                        {horariosDisponiveis.map(slot => {
                            // --- MUDANÇA 3: A verificação de seleção agora usa o array ---
                            const isSelected = selectedSlots.includes(slot);
                            return (
                                <TouchableOpacity
                                    key={slot}
                                    style={[ styles.slotButton, isSelected && styles.slotButtonSelected ]}
                                    onPress={() => handleSlotSelection(slot)}
                                >
                                    <Text style={[ styles.slotText, isSelected && styles.slotTextSelected ]}>{slot}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </>
            )}
        </View>
      </ScrollView>
      {/* --- Footer Fixo com Preço e Botão --- */}
      <View style={styles.footer}>
          <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Preço Total</Text>
              <Text style={styles.priceValue}>R$ {precoTotal}</Text>
          </View>
          <TouchableOpacity 
            // --- MUDANÇA 4: O botão agora verifica se o array não está vazio ---
            style={[styles.confirmButton, (selectedSlots.length === 0) && styles.confirmButtonDisabled]}
            disabled={selectedSlots.length === 0}
            onPress={handleConfirmar}
          >
              <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Estilos (continuam iguais) ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    headerImage: { width: '100%', height: 250 },
    container: { padding: 20 },
    producerName: { fontSize: 16, color: '#606C38', fontWeight: '600' },
    productName: { fontSize: 28, fontWeight: 'bold', color: '#283618', marginTop: 4 },
    description: { fontSize: 16, color: '#555', lineHeight: 24, marginTop: 15 },
    separator: { height: 1, backgroundColor: '#EAEAEA', marginVertical: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#283618' },
    quantityContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    quantitySelector: { flexDirection: 'row', alignItems: 'center' },
    quantityValue: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 20, color: '#283618' },
    subTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 20, marginBottom: 15 },
    slotsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    slotButton: { width: '48%', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#B0B0B0', alignItems: 'center', marginBottom: 10 },
    slotButtonSelected: { backgroundColor: '#283618', borderColor: '#283618' },
    slotText: { fontSize: 16, color: '#283618' },
    slotTextSelected: { color: '#FFFFFF', fontWeight: 'bold' },
    footer: { borderTopWidth: 1, borderColor: '#EAEAEA', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
    priceContainer: { flex: 1 },
    priceLabel: { fontSize: 14, color: '#888' },
    priceValue: { fontSize: 22, fontWeight: 'bold', color: '#283618' },
    confirmButton: { backgroundColor: '#283618', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
    confirmButtonDisabled: { backgroundColor: '#B0B0B0' },
    confirmButtonText: { color: '#FEFAE0', fontSize: 16, fontWeight: 'bold' },
});