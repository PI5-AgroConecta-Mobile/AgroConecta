import React, { useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ImageSourcePropType,
  Switch,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';

// --- Tipos e Dados de Exemplo (sem alterações) ---
interface Produto {
  id: string; nome: string; preco: string; produtor: string;
  categoria: 'Frutas' | 'Verduras' | 'Laticínios' | 'Outros';
  distancia: number; organico: boolean; image: ImageSourcePropType;
}
const todosOsProdutos: Produto[] = [
    { id: '1', nome: 'Tomate Orgânico', produtor: 'Horta da Clara', preco: 'R$ 10,99/kg', categoria: 'Frutas', distancia: 2.5, organico: true, image: require('../../../assets/images/tomate.jpg') },
    { id: '2', nome: 'Alface Crespa', produtor: 'Sítio Verde', preco: 'R$ 3,50/un', categoria: 'Verduras', distancia: 5.1, organico: false, image: require('../../../assets/images/alface.jpg') },
    { id: '3', nome: 'Cenoura Fresca', produtor: 'Fazenda Feliz', preco: 'R$ 5,00/kg', categoria: 'Verduras', distancia: 8.3, organico: false, image: require('../../../assets/images/cenoura.jpg') },
    { id: '4', nome: 'Queijo Minas', produtor: 'Laticínios da Serra', preco: 'R$ 25,00/kg', categoria: 'Laticínios', distancia: 12.0, organico: false, image: require('../../../assets/images/queijominas.jpg') },
    { id: '5', nome: 'Ovos Caipira', produtor: 'Galinheiro do Zé', preco: 'R$ 15,00/dúzia', categoria: 'Laticínios', distancia: 4.2, organico: true, image: require('../../../assets/images/ovos.jpg') },
    { id: '6', nome: 'Mel Silvestre', produtor: 'Apiário do Sol', preco: 'R$ 30,00/pote', categoria: 'Outros', distancia: 15.5, organico: true, image: require('../../../assets/images/mel.jpg') },
];
const categorias = ['Todos', 'Frutas', 'Verduras', 'Laticínios', 'Outros'];
const parsePrice = (priceString: string): number => parseFloat(priceString.replace('R$', '').replace(',', '.').trim());

const ProductCard = ({ item }: { item: Produto }) => ( <Link href={`/detalhesProdutos?id=${item.id}`} asChild><TouchableOpacity style={styles.productCard}><Image source={item.image} style={styles.productImage} /><Text style={styles.productName} numberOfLines={1}>{item.nome}</Text><Text style={styles.producerName}>{item.produtor}</Text><Text style={styles.productPrice}>{item.preco}</Text></TouchableOpacity></Link> );

// --- Tela Principal do Catálogo ---
export default function ProdutosScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        categoria: 'Todos',
        distanciaMax: 50,
        precoMax: 50,
        apenasOrganicos: false,
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const filteredProducts = useMemo(() => {
        return todosOsProdutos.filter(p => 
            (filters.categoria === 'Todos' || p.categoria === filters.categoria) &&
            (p.distancia <= filters.distanciaMax) &&
            (parsePrice(p.preco) <= filters.precoMax) &&
            (!filters.apenasOrganicos || p.organico === true) &&
            (p.nome.toLowerCase().includes(searchQuery.toLowerCase()) || p.produtor.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, filters]);
    
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['75%', '90%'], []);
    const openFilters = () => {
        setTempFilters(filters);
        bottomSheetRef.current?.expand();
    };
    const applyFilters = () => {
        setFilters(tempFilters);
        bottomSheetRef.current?.close();
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={22} color="#888" style={styles.searchIcon} />
                <TextInput placeholder="Procure por produtos..." style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery}/>
            </View>
            <TouchableOpacity onPress={openFilters} style={styles.filterButton}>
                <Ionicons name="filter" size={24} color="#FEFAE0" />
            </TouchableOpacity>
        </View>

        <FlatList
            data={filteredProducts} keyExtractor={item => item.id} numColumns={2}
            renderItem={({ item }) => <ProductCard item={item} />}
            contentContainerStyle={styles.productGrid}
            ListEmptyComponent={ <View style={styles.emptyContainer}><Ionicons name="sad-outline" size={60} color="#A9A9A9" /><Text style={styles.emptyText}>Nenhum produto encontrado.</Text></View>}
        />
      </View>

      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose backgroundStyle={{ backgroundColor: '#F8F7F2' }}>
          <BottomSheetView style={styles.sheetContainer}>
              <Text style={styles.sheetTitle}>Filtros</Text>

              {/* MUDANÇA AQUI: Filtro de Categoria em Grelha 2x2 */}
              <Text style={styles.filterLabel}>Categoria</Text>
              <View style={styles.categoryGridContainer}>
                  {categorias.map(cat => (
                      <TouchableOpacity key={cat} onPress={() => setTempFilters({...tempFilters, categoria: cat})} style={[styles.categoryChip, tempFilters.categoria === cat && styles.categoryChipActive]}>
                          <Text style={[styles.categoryText, tempFilters.categoria === cat && styles.categoryTextActive]}>{cat}</Text>
                      </TouchableOpacity>
                  ))}
              </View>

              {/* Filtro de Distância */}
              <Text style={styles.filterLabel}>Distância Máxima: até {tempFilters.distanciaMax.toFixed(0)} km</Text>
              <Slider style={{ width: '100%', height: 40, marginBottom: 20 }} minimumValue={1} maximumValue={50} step={1} value={tempFilters.distanciaMax} onValue-Change={(value: any) => setTempFilters({...tempFilters, distanciaMax: value})} minimumTrackTintColor="#283618" maximumTrackTintColor="#D1D1D1" thumbTintColor="#283618"/>

              {/* Filtro de Preço */}
              <Text style={styles.filterLabel}>Preço Máximo: até R$ {tempFilters.precoMax.toFixed(2)}</Text>
              <Slider style={{ width: '100%', height: 40, marginBottom: 20 }} minimumValue={0} maximumValue={50} step={0.5} value={tempFilters.precoMax} onValueChange={(value) => setTempFilters({...tempFilters, precoMax: value})} minimumTrackTintColor="#283618" maximumTrackTintColor="#D1D1D1" thumbTintColor="#283618"/>

              {/* Filtro de Orgânicos */}
              <View style={styles.switchRow}>
                  <Text style={styles.filterLabel}>Apenas Orgânicos</Text>
                  <Switch trackColor={{ false: "#E0E0E0", true: "#606C38" }} thumbColor={tempFilters.apenasOrganicos ? "#FEFAE0" : "#f4f3f4"} onValueChange={(value) => setTempFilters({...tempFilters, apenasOrganicos: value})} value={tempFilters.apenasOrganicos}/>
              </View>

              <View style={styles.sheetFooter}>
                  <TouchableOpacity onPress={() => setTempFilters({ categoria: 'Todos', distanciaMax: 50, precoMax: 50, apenasOrganicos: false })} style={styles.clearButton}>
                      <Text style={styles.clearButtonText}>Limpar Tudo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
                      <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                  </TouchableOpacity>
              </View>
          </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10 },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 10, height: 50, elevation: 2 },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: '100%', fontSize: 16 },
    filterButton: { backgroundColor: '#283618', padding: 12, borderRadius: 10, marginLeft: 10, elevation: 2 },
    productGrid: { paddingHorizontal: 15 },
    productCard: { backgroundColor: '#FFFFFF', borderRadius: 10, flex: 1, margin: 5, padding: 10, elevation: 2, alignItems: 'center' },
    productImage: { width: '100%', height: 120, borderRadius: 8 },
    productName: { fontSize: 16, fontWeight: '600', marginTop: 8, color: '#283618', textAlign: 'center' },
    producerName: { fontSize: 12, color: '#888', marginTop: 2 },
    productPrice: { fontSize: 15, fontWeight: 'bold', color: '#606C38', marginTop: 6 },
    emptyContainer: { flex: 1, marginTop: '20%', alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 18, color: '#A9A9A9', marginTop: 15 },
    sheetContainer: { flex: 1, paddingHorizontal: 20 },
    sheetTitle: { fontSize: 22, fontWeight: 'bold', color: '#283618', textAlign: 'center', marginBottom: 20 },
    filterLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15 },
    categoryGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    categoryChip: {
        width: '48%', 
        marginBottom: 10, 
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center', 
    },
    categoryChipActive: { backgroundColor: '#606C38', borderColor: '#606C38' },
    categoryText: { fontSize: 14, fontWeight: '600', color: '#606C38' },
    categoryTextActive: { color: '#FFFFFF' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
    sheetFooter: { flexDirection: 'row', marginTop: 'auto', gap: 15, paddingVertical: 10 },
    clearButton: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#B0B0B0', alignItems: 'center' },
    clearButtonText: { color: '#555', fontSize: 16, fontWeight: 'bold' },
    applyButton: { flex: 2, padding: 15, borderRadius: 10, backgroundColor: '#283618', alignItems: 'center' },
    applyButtonText: { color: '#FEFAE0', fontSize: 16, fontWeight: 'bold' },
});