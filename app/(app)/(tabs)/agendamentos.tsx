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
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import api from '../../../services/api'; 
import { useAuth } from '../../../context/AuthContext'; 

interface Agendamento {
  id: string;
  quantity: number;
  totalPrice: number;
  status: number; // 0: Pendente, 1: Confirmado, 2: Cancelado
  scheduledFor: string; 
  product: {
    name: string;
    imgUrl: string;
  };
  farmer: {
    name: string;
    contact: string;
  };
}


const AgendamentoCard = ({ item }: { item: Agendamento }) => {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };
  
  const formatData = (dateISO: string) => {
    return new Date(dateISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (status: number): { text: string; color: string } => {
    if (status === 1) return { text: 'Confirmado', color: '#28A745' };
    if (status === 2) return { text: 'Cancelado', color: '#D90429' };
    return { text: 'Pendente', color: '#FFC107' };
  };

  const statusInfo = getStatusInfo(item.status);

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.product.imgUrl || 'https://via.placeholder.com/150' }} 
        style={styles.productImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.farmerName}>Vendido por: {item.farmer.name}</Text>
        <Text style={styles.details}>Quantidade: {item.quantity}</Text>
        <Text style={styles.details}>Total: {formatPrice(item.totalPrice)}</Text>
        <Text style={styles.date}>Retirada em: {formatData(item.scheduledFor)}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
        <Text style={styles.statusText}>{statusInfo.text}</Text>
      </View>
    </View>
  );
};

// --- Ecrã Principal ---
export default function AgendamentosScreen() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchAgendamentos = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const response = await api.get<Agendamento[]>('/myagendamentos/cliente');
      setAgendamentos(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Não foi possível carregar os seus agendamentos.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAgendamentos();
    }, [fetchAgendamentos])
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#283618" style={styles.centered} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (agendamentos.length === 0) {
      return <Text style={styles.emptyText}>Você ainda não fez nenhum agendamento.</Text>;
    }
    return (
      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AgendamentoCard item={item} />}
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
        <Text style={styles.title}>Meus Agendamentos</Text>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#283618' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#D90429' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  listContainer: { padding: 15 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
  },
  farmerName: {
    fontSize: 14,
    color: '#555',
  },
  details: {
    fontSize: 14,
    color: '#606C38',
    marginTop: 2,
  },
  date: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 5,
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});