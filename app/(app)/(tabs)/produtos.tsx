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
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Tipos de Dados ---
interface Produto {
  id: string;
  nome: string;
  preco: string;
  produtor: string;
  image: ImageSourcePropType;
}

// --- Dados de Exemplo ---
const todosOsProdutos: Produto[] = [
  { id: '1', nome: 'Tomate Orgânico', produtor: 'Horta da Clara', preco: 'R$ 10,99/kg', image: require('../../../assets/images/tomate.jpg') },
  { id: '2', nome: 'Alface Crespa', produtor: 'Sítio Verde', preco: 'R$ 3,50/un', image: require('../../../assets/images/alface.jpg') },
  { id: '3', nome: 'Cenoura Fresca', produtor: 'Fazenda Feliz', preco: 'R$ 5,00/kg', image: require('../../../assets/images/cenoura.jpg') },
  { id: '4', nome: 'Queijo Minas', produtor: 'Laticínios da Serra', preco: 'R$ 25,00/kg', image: require('../../../assets/images/queijominas.jpg') },
  { id: '5', nome: 'Ovos Caipira', produtor: 'Galinheiro do Zé', preco: 'R$ 15,00/dúzia', image: require('../../../assets/images/ovos.jpg') },
  { id: '6', nome: 'Mel Silvestre', produtor: 'Apiário do Sol', preco: 'R$ 30,00/pote', image: require('../../../assets/images/mel.jpg') },
];

// --- Componente de Card de Produto ---
const ProductCard = ({ item }: { item: Produto }) => (
  <Link href={`/detalhesProdutos?id=${item.id}`} asChild>
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={1}>{item.nome}</Text>
      <Text style={styles.producerName}>{item.produtor}</Text>
      <Text style={styles.productPrice}>{item.preco}</Text>
    </TouchableOpacity>
  </Link>
);

// --- Tela de Catálogo ---
export default function ProdutosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Nosso Catálogo</Text>
            {/* Futuramente, adicione filtros e busca aqui */}
            <View style={styles.productGrid}>
                {todosOsProdutos.map(item => (
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
  container: {
    padding: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#283618',
    paddingHorizontal: 10,
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
    width: '48%', // Para 2 colunas com espaço
    marginBottom: 15,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    alignItems: 'center',
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
    marginTop: 8,
    color: '#283618',
    textAlign: 'center',
  },
  producerName: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#606C38',
    marginTop: 6,
  },
});