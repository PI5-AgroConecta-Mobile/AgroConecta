import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageSourcePropType,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Habilita a animação LayoutAnimation no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Tipos de Dados ---
interface Compra {
  id: string;
  produtoNome: string;
  produtoImagem: ImageSourcePropType;
  status: 'Entregue' | 'Cancelado';
  data: string;
  precoTotal: string;
  fazendaNome: string;
}

// --- Dados de Exemplo ---
const historicoDeCompras: Compra[] = [
  {
    id: '1',
    produtoNome: 'Cenoura Fresca',
    produtoImagem: require('../../../assets/images/cenoura.jpg'),
    status: 'Entregue',
    data: '15 de Agosto, 2025',
    precoTotal: 'R$ 5,00',
    fazendaNome: 'Fazenda Feliz',
  },
  {
    id: '2',
    produtoNome: 'Queijo Minas',
    produtoImagem: require('../../../assets/images/queijominas.jpg'),
    status: 'Cancelado',
    data: '10 de Agosto, 2025',
    precoTotal: 'R$ 25,00',
    fazendaNome: 'Laticínios da Serra',
  },
];

// --- Componente do Card de Histórico Expansível ---
const HistoricoCard = ({ item }: { item: Compra }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDelivered = item.status === 'Entregue';

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={toggleExpand} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Image source={item.produtoImagem} style={styles.productImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.cardTitle}>{item.produtoNome}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isDelivered ? '#2E7D32' : '#C62828' }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#A9A9A9" />
      </View>
      {isExpanded && (
        <View style={styles.cardDetails}>
          <Text style={styles.detailText}>Data: {item.data}</Text>
          <Text style={styles.detailText}>Vendido por: {item.fazendaNome}</Text>
          <Text style={styles.detailText}>Valor Total: {item.precoTotal}</Text>
          <TouchableOpacity style={styles.buyAgainButton}>
            <Text style={styles.buyAgainButtonText}>Comprar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

// --- Tela Principal de Histórico ---
export default function HistoricoScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Histórico de Compras' }} />
      <ScrollView style={styles.container}>
        {historicoDeCompras.length > 0 ? (
            historicoDeCompras.map(item => <HistoricoCard key={item.id} item={item} />)
        ) : (
            <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={80} color="#D1D1D1" />
                <Text style={styles.emptyText}>Seu histórico de compras está vazio.</Text>
            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F7F2',
    },
    container: {
        padding: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    headerTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginTop: 5,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardDetails: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginTop: 15,
        paddingTop: 15,
    },
    detailText: {
        fontSize: 15,
        color: '#555',
        marginBottom: 5,
    },
    buyAgainButton: {
        backgroundColor: '#283618',
        borderRadius: 8,
        paddingVertical: 10,
        marginTop: 15,
        alignItems: 'center',
    },
    buyAgainButtonText: {
        color: '#FEFAE0',
        fontSize: 15,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%',
    },
    emptyText: {
        fontSize: 16,
        color: '#A9A9A9',
        marginTop: 15,
    },
});