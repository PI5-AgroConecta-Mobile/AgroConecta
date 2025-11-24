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
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

// --- Tipos Adaptados para API ---
interface Slide { id: string; image: any; }
interface Categoria { id: string; nome: string; icon: any; }

const slides: Slide[] = [
    { id: '1', image: require('../../../assets/images/capa.png') },
    { id: '2', image: require('../../../assets/images/PG.jpg') },
    { id: '3', image: require('../../../assets/images/fazenda1.jpg') },
];
const categorias: Categoria[] = [
    { id: '1', nome: 'Frutas', icon: 'nutrition-outline' },
    { id: '2', nome: 'Verduras', icon: 'leaf-outline' },
    { id: '3', nome: 'Laticínios', icon: 'egg-outline' },
    { id: '4', nome: 'Outros', icon: 'grid-outline' },
];

const { width } = Dimensions.get('window');

// --- Componentes de Card Atualizados ---
const ProductCard = ({ item }: { item: any }) => (
  <Link href={`/fazenda/${item.id}` as any} asChild>
    <TouchableOpacity style={styles.productCard}>
      <Image 
        source={item.imgUrl ? { uri: item.imgUrl } : require('../../../assets/images/icon.png')} 
        style={styles.productImage} 
      />
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.producerName}>{item.user?.name || 'Produtor'}</Text>
      <Text style={styles.productPrice}>R$ {Number(item.price).toFixed(2)}</Text>
    </TouchableOpacity>
  </Link>
);

// --- TELA PRINCIPAL ---
export default function HomeScreen() {
  const { user } = useAuth();
  const [slideIndex, setSlideIndex] = useState(0);
  const slideRef = useRef<FlatList>(null);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrossel
    const interval = setInterval(() => {
      setSlideIndex(prevIndex => {
        const nextIndex = prevIndex === slides.length - 1 ? 0 : prevIndex + 1;
        slideRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Buscar produtos reais
    async function loadData() {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.log("Erro ao buscar produtos", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <View style={styles.container}>
            {/* 1. Cabeçalho Real */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0] || 'Visitante'}!</Text>
                    <Text style={styles.location}>O que vamos colher hoje?</Text>
                </View>
                <Image 
                    source={user?.imgUrl ? { uri: user.imgUrl } : require('../../../assets/images/icon.png')} 
                    style={styles.profilePic} 
                />
            </View>

            {/* 2. Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={22} color="#888" />
                <TextInput placeholder="Procure por alimentos frescos..." style={styles.searchInput}/>
            </View>
            
            {/* 3. Carrossel */}
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
            
            {/* 5. Produtos em Destaque (REAIS) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Produtos Frescos Para Você</Text>
                {loading ? (
                    <ActivityIndicator color="#606C38" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.productGrid}>
                        {products.length > 0 ? (
                            products.slice(0, 6).map((item: any) => ( <ProductCard item={item} key={item.id} /> ))
                        ) : (
                            <Text style={{ padding: 20, color: '#666' }}>Nenhum produto disponível no momento.</Text>
                        )}
                    </View>
                )}
            </View>

            {/* 6. Chamada para Agricultores - CORRIGIDO */}
            <View style={styles.ctaSection}>
                <Ionicons name="leaf-outline" size={40} color="#FEFAE0" />
                <Text style={styles.ctaTitle}>Você é um Agricultor?</Text>
                <Text style={styles.ctaText}>Venda seus produtos diretamente para consumidores na sua região.</Text>
                {/* Rota corrigida para o login unificado */}
                <Link href="/(auth)" asChild>
                    <TouchableOpacity style={styles.ctaButton}><Text style={styles.ctaButtonText}>Comece a Vender</Text></TouchableOpacity>
                </Link>
            </View>

            {/* 7. Mapa Preview */}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
  container: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  profilePic: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ddd' },
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
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  productCard: { backgroundColor: '#FFFFFF', borderRadius: 10, width: '48%', marginBottom: 20, padding: 10, elevation: 3, alignItems: 'center' },
  productImage: { width: '100%', height: 120, borderRadius: 8, backgroundColor: '#f0f0f0' },
  productName: { fontSize: 16, fontWeight: '600', marginTop: 8, color: '#283618', textAlign: 'center' },
  producerName: { fontSize: 12, color: '#888', marginTop: 2 },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: '#606C38', marginTop: 6 },
  ctaSection: { backgroundColor: '#283618', margin: 20, borderRadius: 15, padding: 25, alignItems: 'center' },
  ctaTitle: { fontSize: 22, fontWeight: 'bold', color: '#FEFAE0', marginBottom: 10 },
  ctaText: { fontSize: 16, color: '#D4D8C8', textAlign: 'center', marginBottom: 20 },
  ctaButton: { backgroundColor: '#FEFAE0', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  ctaButtonText: { color: '#283618', fontSize: 16, fontWeight: 'bold' },
  mapPreview: { marginHorizontal: 20, height: 150, borderRadius: 15, overflow: 'hidden', elevation: 3 },
  mapImage: { width: '100%', height: '100%' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  mapText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});