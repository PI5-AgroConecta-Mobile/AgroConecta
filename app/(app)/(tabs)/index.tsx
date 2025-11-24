import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Tipos e Dados de Exemplo ---
interface Slide { id: string; image: ImageSourcePropType; }
interface Categoria { id: string; nome: string; icon: any; }
interface Produto { id: string; nome: string; preco: string; produtor: string; image: ImageSourcePropType; }
interface Fazenda { id: string; nome: string; distancia: string; image: ImageSourcePropType; }

const slides: Slide[] = [
    { id: '1', image: require('../../../assets/images/capa.png') },
    { id: '2', image: require('../../../assets/images/PG.jpg') },
    { id: '3', image: require('../../../assets/images/fazenda1.jpg') },
];
const categorias: Categoria[] = [
    { id: '1', nome: 'Frutas', icon: 'nutrition-outline' }, { id: '2', nome: 'Verduras', icon: 'leaf-outline' },
    { id: '3', nome: 'Laticínios', icon: 'egg-outline' }, { id: '4', nome: 'Outros', icon: 'grid-outline' },
];
const produtos: Produto[] = [
    { id: '1', nome: 'Tomate Orgânico', produtor: 'Horta da Clara', preco: 'R$ 10,99/kg', image: require('../../../assets/images/tomate.jpg') },
    { id: '2', nome: 'Alface Crespa', produtor: 'Sítio Verde', preco: 'R$ 3,50/un', image: require('../../../assets/images/alface.jpg') },
    { id: '5', nome: 'Ovos Caipira', produtor: 'Galinheiro do Zé', preco: 'R$ 15,00/dúzia', image: require('../../../assets/images/ovos.jpg') },
    { id: '4', nome: 'Queijo Minas', produtor: 'Laticínios da Serra', preco: 'R$ 25,00/kg', image: require('../../../assets/images/queijominas.jpg') },
];
const fazendasDestaque: Fazenda[] = [
    { id: '1', nome: 'Horta Dona Clara', distancia: '2.5km', image: require('../../../assets/images/hortaDonaClara.png') },
    { id: '2', nome: 'Fazenda Mundo Verde', distancia: '5km', image: require('../../../assets/images/hortaMundoVerde.png') },
    { id: '3', nome: 'Sítio do Sebastião', distancia: '8km', image: require('../../../assets/images/hortaSebastiao.png') },
];
const { width } = Dimensions.get('window');

// --- Componentes de Card ---
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
    <View style={styles.farmInfo}><Text style={styles.farmName}>{item.nome}</Text><Text style={styles.farmDistance}>{item.distancia}</Text></View>
  </TouchableOpacity>
);

// --- TELA PRINCIPAL ---
export default function HomeScreen() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slideRef = useRef<FlatList>(null);

  // Efeito para o carrossel passar sozinho
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prevIndex => {
        const nextIndex = prevIndex === slides.length - 1 ? 0 : prevIndex + 1;
        slideRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 4000); // Muda a cada 4 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <View style={styles.container}>
            {/* 1. Cabeçalho Customizado */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, Samer!</Text>
                    <Text style={styles.location}>O que vamos colher hoje?</Text>
                </View>
                <Image source={require('../../../assets/images/Perfil-Cliente.jpeg')} style={styles.profilePic} />
            </View>

            {/* 2. Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={22} color="#888" />
                <TextInput placeholder="Procure por alimentos frescos..." style={styles.searchInput}/>
            </View>
            
            {/* 3. Carrossel Automático */}
            <View style={styles.section}>
                <FlatList
                    ref={slideRef} data={slides} keyExtractor={(item) => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => { const index = Math.floor(event.nativeEvent.contentOffset.x / (width - 40)); setSlideIndex(index); }}
                    renderItem={({ item }) => ( <Image source={item.image} style={[styles.slideImage, { width: width - 40 }]} /> )}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                />
                <View style={styles.pagination}>
                    {slides.map((_, index) => (<View key={index} style={[styles.dot, index === slideIndex && styles.dotActive]}/>))}
                </View>
            </View>

            {/* 4. Categorias */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categorias</Text>
                <FlatList
                    data={categorias} horizontal showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                    <TouchableOpacity style={styles.categoryChip}>
                        <Ionicons name={item.icon} size={24} color="#606C38" />
                        <Text style={styles.categoryText}>{item.nome}</Text>
                    </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id} contentContainerStyle={{ paddingLeft: 20 }}
                />
            </View>
            
            {/* 5. Produtos em Destaque */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Produtos Frescos Para Você</Text>
                <View style={styles.productGrid}>
                    {produtos.map(item => ( <ProductCard item={item} key={item.id} /> ))}
                </View>
            </View>

            {/* 6. Chamada para Agricultores */}
            <View style={styles.ctaSection}>
                <Ionicons name="leaf-outline" size={40} color="#FEFAE0" />
                <Text style={styles.ctaTitle}>Você é um Agricultor?</Text>
                <Text style={styles.ctaText}>Venda seus produtos diretamente para consumidores na sua região.</Text>
                <Link href="/(auth)/loginAgricultor" asChild>
                    <TouchableOpacity style={styles.ctaButton}><Text style={styles.ctaButtonText}>Comece a Vender</Text></TouchableOpacity>
                </Link>
            </View>

            {/* 7. Fazendas em Destaque */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fazendas Próximas</Text>
              <FlatList
                data={fazendasDestaque} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <FarmCard item={item} />} contentContainerStyle={{ paddingHorizontal: 15 }}
              />
            </View>

            {/* 8. Pré-visualização do Mapa */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Explore no Mapa</Text>
              <Link href="/mapa" asChild>
                <TouchableOpacity style={styles.mapPreview}>
                    <Image source={require('../../../assets/images/map.jpg')} style={styles.mapImage} />
                    <View style={styles.mapOverlay}><Text style={styles.mapText}>Abrir Mapa Completo</Text></View>
                </TouchableOpacity>
              </Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS REFINADOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
  container: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  profilePic: { width: 50, height: 50, borderRadius: 25 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#283618' },
  location: { fontSize: 16, color: '#606C38' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 15, margin: 20, paddingHorizontal: 15, height: 50, elevation: 3 },
  searchInput: { flex: 1, fontSize: 16, marginLeft: 10 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#283618', paddingHorizontal: 20, marginBottom: 15 },
  slideImage: { height: 160, resizeMode: 'cover', borderRadius: 15 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4D8C8', margin: 3 },
  dotActive: { backgroundColor: '#606C38' },
  categoryChip: { backgroundColor: '#FFFFFF', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, alignItems: 'center', flexDirection: 'row', elevation: 2 },
  categoryText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#606C38' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10 },
  productCard: { backgroundColor: '#FFFFFF', borderRadius: 10, width: '45%', marginBottom: 20, padding: 10, elevation: 3, alignItems: 'center' },
  productImage: { width: '100%', height: 120, borderRadius: 8 },
  productName: { fontSize: 16, fontWeight: '600', marginTop: 8, color: '#283618', textAlign: 'center' },
  producerName: { fontSize: 12, color: '#888', marginTop: 2 },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: '#606C38', marginTop: 6 },
  ctaSection: { backgroundColor: '#283618', margin: 20, borderRadius: 15, padding: 25, alignItems: 'center' },
  ctaTitle: { fontSize: 22, fontWeight: 'bold', color: '#FEFAE0', marginBottom: 10 },
  ctaText: { fontSize: 16, color: '#D4D8C8', textAlign: 'center', marginBottom: 20 },
  ctaButton: { backgroundColor: '#FEFAE0', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  ctaButtonText: { color: '#283618', fontSize: 16, fontWeight: 'bold' },
  farmCard: { backgroundColor: '#FFFFFF', borderRadius: 10, width: 250, marginHorizontal: 10, elevation: 3, overflow: 'hidden', flexDirection: 'row', alignItems: 'center' },
  farmImage: { width: 80, height: 80 },
  farmInfo: { padding: 15, flex: 1 },
  farmName: { fontSize: 18, fontWeight: 'bold', color: '#283618' },
  farmDistance: { fontSize: 14, color: '#606C38', marginTop: 4 },
  mapPreview: { marginHorizontal: 20, height: 150, borderRadius: 15, overflow: 'hidden', elevation: 3 },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  mapText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});