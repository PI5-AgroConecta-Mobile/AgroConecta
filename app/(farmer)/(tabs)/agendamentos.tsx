import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
  TouchableOpacity,
  Alert, // <-- Importar Alert
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api'; 
import axios from 'axios'; // <-- Importar Axios para erros

// 2. Definir o tipo de dados
interface Agendamento {
  id: string;
  quantity: number;
  totalPrice: number;
  status: number; 
  scheduledFor: string;
  product: { name: string; imgUrl: string; };
  client: { name: string; contact: string; };
}

// 3. Interface para as Props do Card
interface CardProps {
  item: Agendamento;
  onUpdateStatus: (agendamentoId: string, newStatus: number) => void; // Função para atualizar
}

// --- Componente Card (ATUALIZADO) ---
const AgendamentoCard = ({ item, onUpdateStatus }: CardProps) => {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };
  const formatData = (dateISO: string) => {
    return new Date(dateISO).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };
  const getStatusInfo = (status: number): { text: string; color: string } => {
    if (status === 1) return { text: 'Confirmado', color: '#28A745' };
    if (status === 2) return { text: 'Cancelado', color: '#D90429' };
    return { text: 'Pendente', color: '#FFC107' };
  };
  // ...
  
  const statusInfo = getStatusInfo(item.status);

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.product.imgUrl || 'https://via.placeholder.com/150' }} 
        style={styles.productImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.quantity}x {item.product.name}</Text>
        <Text style={styles.clientName}>Cliente: {item.client.name}</Text>
        <Text style={styles.details}>Total: {formatPrice(item.totalPrice)}</Text>
        <Text style={styles.date}>Retirada em: {formatData(item.scheduledFor)}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
        <Text style={styles.statusText}>{statusInfo.text}</Text>
      </View>
      
      {/* 4. Botões de Ação (LIGADOS) */}
      {item.status === 0 && ( // Só mostra botões se estiver Pendente
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => onUpdateStatus(item.id, 2)} // 2 = Cancelar
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => onUpdateStatus(item.id, 1)} // 1 = Confirmar
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- Ecrã Principal (ATUALIZADO) ---
export default function AgendamentosFarmerScreen() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar os agendamentos (sem alterações)
  const fetchAgendamentos = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const response = await api.get<Agendamento[]>('/myagendamentos/farmer');
      setAgendamentos(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Não foi possível carregar os agendamentos recebidos.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // useFocusEffect (sem alterações)
  useFocusEffect(
    useCallback(() => {
      fetchAgendamentos();
    }, [fetchAgendamentos])
  );

  // --- 5. NOVA FUNÇÃO PARA ATUALIZAR O STATUS ---
  const handleUpdateStatus = async (agendamentoId: string, newStatus: number) => {
    const actionText = newStatus === 1 ? "Confirmar" : "Cancelar";
    
    Alert.alert(
      `${actionText} Agendamento`,
      `Tem a certeza de que deseja ${actionText.toLowerCase()} este pedido?`,
      [
        { text: "Voltar", style: "cancel" },
        {
          text: `Sim, ${actionText}`,
          style: newStatus === 1 ? "default" : "destructive",
          onPress: async () => {
            try {
              // 1. Chamar a nova API
              await api.put(`/updateAgendamentoStatus/${agendamentoId}`, {
                status: newStatus 
              });

              // 2. Atualizar a lista localmente (mais rápido)
              // ou recarregar da API
              setAgendamentos(prev =>
                prev.map(ag =>
                  ag.id === agendamentoId ? { ...ag, status: newStatus } : ag
                )
              );
              // await fetchAgendamentos(false); // Alternativa
              
            } catch (err) {
              if (axios.isAxiosError(err) && err.response) {
                Alert.alert("Erro", err.response.data.err);
              } else {
                Alert.alert("Erro", `Não foi possível ${actionText.toLowerCase()} o pedido.`);
              }
            }
          },
        },
      ]
    );
  };

  // 8. Renderização (Atualizada para passar a nova função)
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#283618" style={styles.centered} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (agendamentos.length === 0) {
      return <Text style={styles.emptyText}>Você ainda não recebeu nenhum pedido.</Text>;
    }
    return (
      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AgendamentoCard 
            item={item} 
            onUpdateStatus={handleUpdateStatus} // <-- Passa a função
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => fetchAgendamentos(true)} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Agendamentos Recebidos</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

// --- Estilos (sem alterações da Etapa 35) ---
const styles = StyleSheet.create({
  // ... (cole os estilos da Etapa 35 aqui)
  safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#283618' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#D90429' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  listContainer: { padding: 15 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10, marginBottom: 15, elevation: 2, flexDirection: 'row' },
  productImage: { width: 80, height: 100, borderRadius: 8 },
  cardInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#283618' },
  clientName: { fontSize: 14, color: '#555', fontStyle: 'italic' },
  details: { fontSize: 14, color: '#606C38', marginTop: 2 },
  date: { fontSize: 14, color: '#333', fontWeight: '500', marginTop: 5 },
  statusBadge: { position: 'absolute', top: 10, right: 10, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 12 },
  statusText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  actionButtons: { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', gap: 8 },
  actionButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  cancelButton: { backgroundColor: '#D90429' },
  confirmButton: { backgroundColor: '#28A745' },
});