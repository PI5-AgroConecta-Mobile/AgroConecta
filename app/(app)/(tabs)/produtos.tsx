import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'; 
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageSourcePropType,
    RefreshControl,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import api from '../../../services/api'; 
import { ApiProduct } from '../../../types/api.types'; 

// --- TIPAGEM ---
interface Produto {
  id: string; 
  nome: string; 
  precoFormatted: string; 
  precoValue: number; 
  produtor: string;
  categoria: 'Frutas' | 'Verduras' | 'Laticínios' | 'Outros';
  distancia: number; 
  organico: boolean; 
  image: ImageSourcePropType;
}

type SortOption = 'padrao' | 'menor_preco' | 'maior_preco' | 'az';

const categorias = ['Todos', 'Frutas', 'Verduras', 'Laticínios', 'Outros'];

const ProductCard = React.memo(({ item }: { item: Produto }) => ( 
  <Link href={`/detalhesProdutos?id=${item.id}`} asChild>
    <TouchableOpacity style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      
      <View style={styles.cardContent}>
        <Text style={styles.productName} numberOfLines={1}>{item.nome}</Text>
        <View style={styles.priceContainer}>
           <Text style={styles.productPrice}>{item.precoFormatted}</Text>
           {item.organico && (
             <View style={styles.badge}>
               <Text style={styles.badgeText}>Orgânico</Text>
             </View>
           )}
        </View>
      </View>
    </TouchableOpacity>
  </Link> 
));

// --- TELA PRINCIPAL ---
export default function ProdutosScreen() {
    const [produtos, setProdutos] = useState<Produto[]>([]); 
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        categoria: 'Todos',
        distanciaMax: 50,
        precoMax: 100, 
        apenasOrganicos: false,
        ordenacao: 'padrao' as SortOption,
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['85%'], []);
    const fetchProducts = useCallback(async () => {
        setError(null);
        try {
          const response = await api.get<ApiProduct[]>('/listProduct');
          
          const mappedProducts: Produto[] = response.data.map(p => {
            const mapCategoria = (type: number): 'Frutas' | 'Verduras' | 'Laticínios' | 'Outros' => {
              if (type === 1) return 'Frutas';
              if (type === 2) return 'Verduras';
              if (type === 3) return 'Laticínios';
              return 'Outros';
            };

            const mapUnidade = (unityType: number): string => {
              if (unityType === 1) return 'kg';
              if (unityType === 2) return 'un';
              return 'dúzia';
            };
            
            return {
              id: p.id,
              nome: p.name,
              precoValue: p.price,
              precoFormatted: `R$ ${p.price.toFixed(2).replace('.', ',')}/${mapUnidade(p.unityType)}`, 
              produtor: p.ownerId, 
              categoria: mapCategoria(p.type),
              distancia: 5.0, 
              organico: p.harvestType === 1, 
              image: { uri: p.imgUrl } 
            };
          });

          setProdutos(mappedProducts);

        } catch (err) {
          console.error("Erro ao buscar produtos:", err);
          setError("Não foi possível carregar os produtos. Verifique sua conexão.");
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = useMemo(() => {
       let result = produtos.filter(p => 
            (filters.categoria === 'Todos' || p.categoria === filters.categoria) &&
            (p.distancia <= filters.distanciaMax) &&
            (p.precoValue <= filters.precoMax) &&
            (!filters.apenasOrganicos || p.organico === true) &&
            (p.nome.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        // Ordenação
        switch (filters.ordenacao) {
            case 'menor_preco':
                result.sort((a, b) => a.precoValue - b.precoValue);
                break;
            case 'maior_preco':
                result.sort((a, b) => b.precoValue - a.precoValue);
                break;
            case 'az':
                result.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            default:
                break;
        }

        return result;
    }, [searchQuery, filters, produtos]); 

    const openFilters = () => {
        setTempFilters(filters);
        bottomSheetRef.current?.expand();
    };
    const applyFilters = () => {
        setFilters(tempFilters);
        bottomSheetRef.current?.close();
    };
    const clearFilters = () => {
        const resetState = { categoria: 'Todos', distanciaMax: 50, precoMax: 100, apenasOrganicos: false, ordenacao: 'padrao' as SortOption };
        setFilters(resetState);
        setTempFilters(resetState); 
        bottomSheetRef.current?.close();
    };

    const hasActiveFilters = filters.categoria !== 'Todos' || filters.apenasOrganicos || filters.precoMax < 100 || filters.ordenacao !== 'padrao';

  // --- RENDERIZAÇÃO ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header com Busca */}
        <View style={styles.header}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput 
                  placeholder="Buscar produto..." 
                  style={styles.searchInput} 
                  value={searchQuery} 
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#CCC" />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity onPress={openFilters} style={styles.filterButton}>
                <Ionicons name="options" size={24} color="#FEFAE0" />
                {hasActiveFilters && <View style={styles.activeFilterBadge} />}
            </TouchableOpacity>
        </View>

        {/* Lista de Produtos */}
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#283618" />
            <Text style={styles.loadingText}>Buscando os melhores produtos...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons name="cloud-offline-outline" size={60} color="#A9A9A9" />
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
                <Text style={styles.retryText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
              data={filteredProducts} 
              keyExtractor={item => item.id} 
              numColumns={2}
              renderItem={({ item }) => <ProductCard item={item} />}
              contentContainerStyle={styles.productGrid}
              refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#283618']} />
              }
              ListEmptyComponent={ 
                <View style={styles.centerContainer}>
                  <Ionicons name="leaf-outline" size={60} color="#A9A9A9" />
                  <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
                  {hasActiveFilters && (
                      <TouchableOpacity onPress={clearFilters} style={styles.clearFilterButtonSmall}>
                          <Text style={styles.clearFilterTextSmall}>Limpar Filtros</Text>
                      </TouchableOpacity>
                  )}
                </View>
              }
          />
        )}
      </View>

     <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose backgroundStyle={{ backgroundColor: '#F8F7F2' }}>
          <BottomSheetView style={styles.sheetContainer}>
              <Text style={styles.sheetTitle}>Filtrar e Ordenar</Text>
              
              <Text style={styles.filterLabel}>Ordenar Por</Text>
              <View style={styles.sortRow}>
                  {['padrao', 'menor_preco', 'maior_preco', 'az'].map((opt) => (
                      <TouchableOpacity 
                        key={opt} 
                        style={[styles.sortChip, tempFilters.ordenacao === opt && styles.sortChipActive]}
                        onPress={() => setTempFilters({...tempFilters, ordenacao: opt as SortOption})}
                      >
                          <Text style={[styles.sortText, tempFilters.ordenacao === opt && styles.sortTextActive]}>
                              {opt === 'padrao' ? 'Padrão' : opt === 'az' ? 'A-Z' : opt === 'menor_preco' ? 'Menor Preço' : 'Maior Preço'}
                          </Text>
                      </TouchableOpacity>
                  ))}
              </View>

              <Text style={styles.filterLabel}>Categoria</Text>
              <View style={styles.categoryGridContainer}>
                  {categorias.map(cat => (
                      <TouchableOpacity key={cat} onPress={() => setTempFilters({...tempFilters, categoria: cat as any})} style={[styles.categoryChip, tempFilters.categoria === cat && styles.categoryChipActive]}>
                          <Text style={[styles.categoryText, tempFilters.categoria === cat && styles.categoryTextActive]}>{cat}</Text>
                      </TouchableOpacity>
                  ))}
              </View>

              <Text style={styles.filterLabel}>Preço Máximo: até R$ {tempFilters.precoMax.toFixed(0)}</Text>
              <Slider 
                style={{ width: '100%', height: 40 }} 
                minimumValue={0} maximumValue={100} step={1} 
                value={tempFilters.precoMax} 
                onValueChange={(value) => setTempFilters({...tempFilters, precoMax: value})} 
                minimumTrackTintColor="#283618" maximumTrackTintColor="#D1D1D1" thumbTintColor="#283618"
              />

              <View style={styles.switchRow}>
                  <Text style={styles.filterLabel}>Apenas Orgânicos</Text>
                  <Switch trackColor={{ false: "#E0E0E0", true: "#606C38" }} thumbColor={tempFilters.apenasOrganicos ? "#FEFAE0" : "#f4f3f4"} onValueChange={(value) => setTempFilters({...tempFilters, apenasOrganicos: value})} value={tempFilters.apenasOrganicos}/>
              </View>

              <View style={styles.sheetFooter}>
                  <TouchableOpacity onPress={() => setTempFilters({ categoria: 'Todos', distanciaMax: 50, precoMax: 100, apenasOrganicos: false, ordenacao: 'padrao' })} style={styles.clearButton}>
                      <Text style={styles.clearButtonText}>Limpar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
                      <Text style={styles.applyButtonText}>Ver Resultados</Text>
                  </TouchableOpacity>
              </View>
          </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#F8F7F2' },
    
    // Busca
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, height: 45, borderWidth: 1, borderColor: '#E0E0E0' },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, height: '100%', fontSize: 16, color: '#333' },
    
    // Botão Filtro
    filterButton: { backgroundColor: '#283618', width: 45, height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginLeft: 10, position: 'relative' },
    activeFilterBadge: { position: 'absolute', top: -5, right: -5, width: 12, height: 12, borderRadius: 6, backgroundColor: '#D90429', borderWidth: 2, borderColor: '#F8F7F2' },

    // Lista e Card
    productGrid: { paddingHorizontal: 10, paddingBottom: 20 },
    productCard: { backgroundColor: '#FFFFFF', borderRadius: 12, flex: 1, margin: 6, padding: 10, elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4, alignItems: 'center' },
    productImage: { width: '100%', height: 110, borderRadius: 8, resizeMode: 'cover' },
    cardContent: { width: '100%', marginTop: 10 },
    productName: { fontSize: 15, fontWeight: '700', color: '#283618', textAlign: 'left' },
    priceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    productPrice: { fontSize: 14, fontWeight: 'bold', color: '#606C38' },
    badge: { backgroundColor: '#606C38', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
    badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
    
    // Estados Vazios/Carregando
    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, marginTop: 50 },
    loadingText: { marginTop: 10, color: '#666', fontSize: 14 },
    emptyText: { fontSize: 16, color: '#888', marginTop: 15, textAlign: 'center', marginBottom: 20 },
    retryButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#283618', borderRadius: 8 },
    retryText: { color: '#FEFAE0', fontWeight: 'bold' },
    clearFilterButtonSmall: { paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: '#283618', borderRadius: 8 },
    clearFilterTextSmall: { color: '#283618', fontWeight: '600' },

    // Bottom Sheet
    sheetContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
    sheetTitle: { fontSize: 20, fontWeight: 'bold', color: '#283618', marginBottom: 20, textAlign: 'center' },
    filterLabel: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 10, marginTop: 10 },
    
    // Ordenação
    sortRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
    sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#DDD', backgroundColor: '#FFF' },
    sortChipActive: { backgroundColor: '#606C38', borderColor: '#606C38' },
    sortText: { fontSize: 13, color: '#555' },
    sortTextActive: { color: '#FFF', fontWeight: 'bold' },

    // Categorias
    categoryGridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
    categoryChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFF', minWidth: '45%', alignItems: 'center' },
    categoryChipActive: { backgroundColor: '#283618', borderColor: '#283618' },
    categoryText: { fontSize: 13, fontWeight: '600', color: '#555' },
    categoryTextActive: { color: '#FEFAE0' },

    // Rodapé do Sheet
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 30 },
    sheetFooter: { flexDirection: 'row', gap: 10, paddingBottom: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15 },
    clearButton: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#CCC', alignItems: 'center' },
    clearButtonText: { color: '#666', fontWeight: 'bold' },
    applyButton: { flex: 2, padding: 15, borderRadius: 10, backgroundColor: '#283618', alignItems: 'center' },
    applyButtonText: { color: '#FEFAE0', fontWeight: 'bold' },
});