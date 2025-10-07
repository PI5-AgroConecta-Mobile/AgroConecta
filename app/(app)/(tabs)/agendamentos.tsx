import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- Tipos de Dados ---
interface Agendamento {
  id: string;
  produtoNome: string;
  produtoImagem: ImageSourcePropType;
  quantidade: string;
  precoTotal: string;
  dia: string;
  horario: string;
  fazendaNome: string;
  fazendaEndereco: string;
  pagamentos: string[];
}

// --- Dados de Exemplo ---
const meusAgendamentos: Agendamento[] = [
  {
    id: '1',
    produtoNome: 'Tomate Orgânico',
    produtoImagem: require('../../../assets/images/tomate.jpg'),
    quantidade: '2 kg',
    precoTotal: 'R$ 21,98',
    dia: '25 de Setembro, 2025',
    horario: '10:00 - 11:00',
    fazendaNome: 'Horta da Clara',
    fazendaEndereco: 'Estrada do Sol, 123 - Bairro Verde, Piracicaba-SP',
    pagamentos: ['Dinheiro', 'Pix', 'Cartão de Débito'],
  },
  {
    id: '2',
    produtoNome: 'Ovos Caipira',
    produtoImagem: require('../../../assets/images/ovos.jpg'),
    quantidade: '1 dúzia',
    precoTotal: 'R$ 15,00',
    dia: '28 de Setembro, 2025',
    horario: '14:00 - 15:00',
    fazendaNome: 'Galinheiro do Zé',
    fazendaEndereco: 'Rua das Flores, 45 - Centro, Limeira-SP',
    pagamentos: ['Dinheiro', 'Pix'],
  },
];


// --- Componente do Card de Agendamento Expansível ---
const AgendamentoCard = ({ agendamento }: { agendamento: Agendamento }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={toggleExpand} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Image source={agendamento.produtoImagem} style={styles.productImage} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.cardTitle}>{agendamento.produtoNome}</Text>
          <Text style={styles.cardSubtitle}>{agendamento.fazendaNome}</Text>
          <Text style={styles.cardInfo}>{agendamento.dia} • {agendamento.horario}</Text>
        </View>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#606C38" />
      </View>

      {/* Conteúdo Expansível */}
      {isExpanded && (
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#606C38" />
            <Text style={styles.detailText}>{agendamento.fazendaEndereco}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="wallet-outline" size={20} color="#606C38" />
            <Text style={styles.detailText}>Pagamento: {agendamento.pagamentos.join(', ')}</Text>
          </View>
          <Link href="/(app)/(tabs)/mapa" asChild>
            <TouchableOpacity style={styles.mapButton}>
              <Text style={styles.mapButtonText}>Ir até a Fazenda</Text>
              <Ionicons name="navigate-outline" size={20} color="#FEFAE0" />
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </TouchableOpacity>
  );
};


// --- Tela Principal de Agendamentos ---
export default function AgendamentosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Meus Agendamentos</Text>
        {meusAgendamentos.map(agendamento => (
          <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
        ))}
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
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#283618',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
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
        color: '#283618',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#555',
    },
    cardInfo: {
        fontSize: 14,
        color: '#606C38',
        marginTop: 4,
    },
    cardDetails: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginTop: 15,
        paddingTop: 15,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 15,
        color: '#333',
        marginLeft: 10,
        flex: 1, // Para quebrar a linha se o texto for longo
    },
    mapButton: {
        backgroundColor: '#283618',
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapButtonText: {
        color: '#FEFAE0',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});