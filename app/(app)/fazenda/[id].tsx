import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageSourcePropType,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Tipos de Dados ---
interface Produto {
  id: string;
  nome: string;
  preco: string;
  image: ImageSourcePropType;
}
interface Fazenda {
    id: string;
    nome: string;
    imagemCapa: ImageSourcePropType;
    localizacao: string;
    avaliacao: number;
    produtos: Produto[];
}

// --- Simulação de "Busca" na Base de Dados ---
const getFazendaDetails = (id: string | string[]): Fazenda => {
    const fazendas: Record<string, Fazenda> = {
        '1': {
            id: '1', nome: 'Horta da Clara', imagemCapa: require('../../../assets/images/fazenda1.jpg'), localizacao: 'Piracicaba-SP', avaliacao: 4.9,
            produtos: [
                { id: '1', nome: 'Tomate Orgânico', preco: 'R$ 10,99/kg', image: require('../../../assets/images/tomate.jpg') },
                { id: '3', nome: 'Cenoura Fresca', preco: 'R$ 5,00/kg', image: require('../../../assets/images/cenoura.jpg') },
            ]
        },
        '2': {
            id: '2', nome: 'Sítio Verde', imagemCapa: require('../../../assets/images/fazenda2.jpg'), localizacao: 'Limeira-SP', avaliacao: 4.8,
            produtos: [
                { id: '2', nome: 'Alface Crespa', preco: 'R$ 3,50/un', image: require('../../../assets/images/alface.jpg') },
                { id: '5', nome: 'Ovos Caipira', preco: 'R$ 15,00/dúzia', image: require('../../../assets/images/ovos.jpg') },
            ]
        },
        // Adicione as outras fazendas aqui
    };
    return fazendas[String(id)] || fazendas['1']; // Retorna a fazenda ou uma padrão
}

// --- Componente de Card de Produto ---
const ProductCard = ({ item }: { item: Produto }) => (
  <Link href={`/detalhesProdutos?id=${item.id}`} asChild>
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>{item.nome}</Text>
      <Text style={styles.productPrice}>{item.preco}</Text>
    </TouchableOpacity>
  </Link>
);


// --- Tela Principal do Perfil da Fazenda ---
export default function PaginaFazenda() {
  const { id, nome } = useLocalSearchParams();
  const fazenda = getFazendaDetails(id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: String(nome) }} />
      <ScrollView>
        {/* Banner da Fazenda */}
        <ImageBackground source={fazenda.imagemCapa} style={styles.headerBanner}>
            <View style={styles.headerOverlay} />
            <Text style={styles.farmName}>{fazenda.nome}</Text>
            <View style={styles.farmMetaContainer}>
                <View style={styles.metaItem}>
                    <Ionicons name="location-sharp" size={16} color="#FFFFFF" />
                    <Text style={styles.metaText}>{fazenda.localizacao}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.metaText}>{fazenda.avaliacao} (Avaliações)</Text>
                </View>
            </View>
        </ImageBackground>

        {/* Lista de Produtos */}
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Produtos Disponíveis</Text>
            <View style={styles.productGrid}>
                {fazenda.produtos.map(item => (
                    <ProductCard item={item} key={item.id} />
                ))}
            </View>
        </View>
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
    headerBanner: {
        height: 200,
        justifyContent: 'flex-end',
        padding: 20,
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    farmName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    farmMetaContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 15,
    },
    metaText: {
        color: '#FFFFFF',
        marginLeft: 5,
        fontSize: 14,
    },
    container: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#283618',
        marginBottom: 20,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    productCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '48%',
        marginBottom: 15,
        padding: 10,
        elevation: 3,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        color: '#283618',
        textAlign: 'center',
        height: 40, // Para alinhar cards com nomes de 1 ou 2 linhas
    },
    productPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#606C38',
        marginTop: 6,
    },
});