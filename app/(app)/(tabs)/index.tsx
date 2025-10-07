import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- Tipos de Dados ---
interface Noticia {
  id: string;
  titulo: string;
  image: ImageSourcePropType;
}
interface Produto {
  id: string;
  nome: string;
  preco: string;
  produtor: string;
  image: ImageSourcePropType;
}
interface Fazenda {
    id: string;
    nome: string;
    distancia: string;
    image: ImageSourcePropType;
}

// --- Dados de Exemplo ---
const ultimasNoticias: Noticia[] = [
    { id: '1', titulo: 'Começa a Época dos Morangos Orgânicos', image: require('../../../assets/images/noticia_morango.jpeg') },
    { id: '2', titulo: 'Nova Fazenda Parceira: Sítio Verde', image: require('../../../assets/images/fazenda2.jpg') },
    { id: '3', titulo: 'Dicas para Conservar Suas Verduras', image: require('../../../assets/images/noticia_verduras.jpeg') },
];

const produtos: Produto[] = [
  { id: '1', nome: 'Tomate Orgânico', produtor: 'Horta da Clara', preco: 'R$ 10,99/kg', image: require('../../../assets/images/tomate.jpg') },
  { id: '2', nome: 'Alface Crespa', produtor: 'Sítio Verde', preco: 'R$ 3,50/un', image: require('../../../assets/images/alface.jpg') },
  { id: '3', nome: 'Cenoura Fresca', produtor: 'Fazenda Feliz', preco: 'R$ 5,00/kg', image: require('../../../assets/images/cenoura.jpg') },
  { id: '4', nome: 'Queijo Minas', produtor: 'Laticínios da Serra', preco: 'R$ 25,00/kg', image: require('../../../assets/images/queijominas.jpg') },
  { id: '5', nome: 'Ovos Caipira', produtor: 'Galinheiro do Zé', preco: 'R$ 15,00/dúzia', image: require('../../../assets/images/ovos.jpg') },
  { id: '6', nome: 'Mel Silvestre', produtor: 'Apiário do Sol', preco: 'R$ 30,00/pote', image: require('../../../assets/images/mel.jpg') },
];

const fazendasDestaque: Fazenda[] = [
  { id: '1', nome: 'Horta Dona Clara', distancia: '2.5km', image: require('../../../assets/images/hortaDonaClara.png') },
  { id: '2', nome: 'Fazenda Mundo Verde', distancia: '5km', image: require('../../../assets/images/hortaMundoVerde.png') },
  { id: '3', nome: 'Sítio do Sebastião', distancia: '8km', image: require('../../../assets/images/hortaSebastiao.png') },
];

// --- Componentes de Card ---
const NewsCard = ({ item }: { item: Noticia }) => (
    <TouchableOpacity style={styles.newsCard}>
        <Image source={item.image} style={styles.newsImage} />
        <Text style={styles.newsTitle}>{item.titulo}</Text>
    </TouchableOpacity>
);

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

const FarmCard = ({ item }: { item: Fazenda }) => (
  <TouchableOpacity style={styles.farmCard}>
    <Image source={item.image} style={styles.farmImage} />
    <View style={styles.farmInfo}>
      <Text style={styles.farmName}>{item.nome}</Text>
      <Text style={styles.farmDistance}>{item.distancia}</Text>
    </View>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* 1. Imagem de Destaque Fixa com Texto */}
        <ImageBackground source={require('../../../assets/images/capa.png')} style={styles.heroBanner}>
            <View style={styles.heroOverlay} />
            <Text style={styles.heroTitle}>Conectando o campo à sua mesa</Text>
            <Text style={styles.heroSubtitle}>Produtos frescos, direto de quem produz.</Text>
        </ImageBackground>

        <View style={styles.container}>
            {/* 2. Introdução ao AgroConecta  */}
            <View style={styles.aboutSection}>
                <Ionicons name="leaf-outline" size={32} color="#283618" />
                <Text style={styles.aboutTitle}>O que é o AgroConecta?</Text>
                <Text style={styles.aboutText}>
                    Somos a ponte que une agricultores familiares a consumidores que buscam uma vida mais saudável. Encontre alimentos de verdade e apoie o comércio local.
                </Text>
            </View>

            {/* 3. Carrossel de Últimas Notícias */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Últimas Notícias</Text>
                <FlatList
                    data={ultimasNoticias}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <NewsCard item={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingLeft: 20 }}
                />
            </View>
            
            {/* 4. Produtos em Destaque */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Produtos Frescos Para Você</Text>
                <View style={styles.productGrid}>
                    {produtos.map(item => (
                        <ProductCard item={item} key={item.id} />
                    ))}
                </View>
            </View>

            {/* 5. Fazendas em Destaque  */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fazendas Próximas a Você</Text>
              <FlatList
                data={fazendasDestaque}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <FarmCard item={item} />}
                contentContainerStyle={{ paddingHorizontal: 15 }}
              />
            </View>

            {/* 6. Pré-visualização do Mapa */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Explore no Mapa</Text>
              <Link href="/(app)/(tabs)/mapa" asChild>
                <TouchableOpacity style={styles.mapPreview}>
                    <Image source={require('../../../assets/images/map.jpg')} style={styles.mapImage} />
                    <View style={styles.mapOverlay}>
                        <Text style={styles.mapText}>Abrir Mapa Completo</Text>
                    </View>
                </TouchableOpacity>
              </Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS  ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingBottom: 40, 
  },
  heroBanner: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
  aboutSection: {
    padding: 25,
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#283618',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#283618',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  newsCard: {
    width: 280,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 140,
  },
  newsTitle: {
    padding: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '45%',
    marginBottom: 20,
    padding: 10,
    elevation: 3,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
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
  farmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 250,
    marginHorizontal: 10,
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmImage: {
    width: 80,
    height: 80,
  },
  farmInfo: {
    padding: 15,
    flex: 1,
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
  },
  farmDistance: {
    fontSize: 14,
    color: '#606C38',
    marginTop: 4,
  },
  mapPreview: {
    marginHorizontal: 20,
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});