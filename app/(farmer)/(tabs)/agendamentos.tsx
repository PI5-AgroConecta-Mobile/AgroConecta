import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- Tipos de Dados ---
interface Agendamento {
  id: string;
  clienteNome: string;
  produtoNome: string;
  produtoImagem: ImageSourcePropType;
  quantidade: string;
  dia: string;
  horario: string;
}

// --- Dados de Exemplo ---
const agendamentosPendentes: Agendamento[] = [
  {
    id: '1',
    clienteNome: 'Samer Halat',
    produtoNome: 'Tomate Orgânico',
    produtoImagem: require('../../../assets/images/tomate.jpg'),
    quantidade: '2 kg',
    dia: '26 de Setembro',
    horario: '10:00 - 11:00',
  },
  {
    id: '3',
    clienteNome: 'Ana Paula',
    produtoNome: 'Queijo Minas',
    produtoImagem: require('../../../assets/images/queijominas.jpg'),
    quantidade: '1 kg',
    dia: '27 de Setembro',
    horario: '09:00 - 10:00',
  },
];

const historicoAgendamentos: Agendamento[] = [
    {
    id: '2',
    clienteNome: 'Maria Silva',
    produtoNome: 'Ovos Caipira',
    produtoImagem: require('../../../assets/images/ovos.jpg'),
    quantidade: '1 dúzia',
    dia: '22 de Setembro',
    horario: '14:00 - 15:00',
  },
]

// --- Componente do Card de Agendamento ---
const AgendamentoCard = ({ item, isPendente }: { item: Agendamento, isPendente: boolean }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Image source={item.produtoImagem} style={styles.productImage} />
            <View style={styles.headerTextContainer}>
                <Text style={styles.cardTitle}>{item.produtoNome} ({item.quantidade})</Text>
                <Text style={styles.cardSubtitle}>Cliente: {item.clienteNome}</Text>
                <Text style={styles.cardInfo}>{item.dia} • {item.horario}</Text>
            </View>
        </View>
        {isPendente && (
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
                    <Ionicons name="close-circle-outline" size={20} color="#C62828" />
                    <Text style={[styles.actionButtonText, { color: '#C62828' }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.confirmButton]}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#2E7D32" />
                    <Text style={[styles.actionButtonText, { color: '#2E7D32' }]}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);

// --- Tela Principal ---
export default function FarmerSchedulesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Agendamentos Recebidos</Text>
        
        <Text style={styles.sectionTitle}>Pendentes de Confirmação</Text>
        {agendamentosPendentes.map(item => <AgendamentoCard key={item.id} item={item} isPendente={true} />)}

        <Text style={styles.sectionTitle}>Histórico</Text>
        {historicoAgendamentos.map(item => <AgendamentoCard key={item.id} item={item} isPendente={false} />)}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
    container: { padding: 15 },
    pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20', marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 15, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#DDD', paddingBottom: 5 },
    card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    productImage: { width: 60, height: 60, borderRadius: 8 },
    headerTextContainer: { flex: 1, marginLeft: 15 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20' },
    cardSubtitle: { fontSize: 14, color: '#555' },
    cardInfo: { fontSize: 14, color: '#606C38', marginTop: 4 },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#F0F0F0', marginTop: 15, paddingTop: 10 },
    actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20 },
    cancelButton: { backgroundColor: '#FFEBEE' },
    confirmButton: { backgroundColor: '#E8F5E9' },
    actionButtonText: { marginLeft: 8, fontSize: 14, fontWeight: '600' },
});