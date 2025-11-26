import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ActivityIndicator, Dimensions, Image, ScrollView
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import api from '../../../services/api';

interface Fazenda {
  id: string;
  name: string;
  farmName: string;
  latitude: number;
  longitude: number;
  imgUrl?: string;
  contact?: string;
}

export default function MapaScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Fazenda | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const [region, setRegion] = useState({
    latitude: -15.7801, longitude: -47.9292,
    latitudeDelta: 0.05, longitudeDelta: 0.05,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05, longitudeDelta: 0.05,
        });
      }
    })();
    fetchFazendas();
  }, []);

  const fetchFazendas = async () => {
    try {
      const response = await api.get('/listFarms');
      setFazendas(response.data);
    } catch (error) {
      console.error("Erro ao buscar fazendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFazendas = fazendas.filter(fazenda => {
    const nome = fazenda.farmName || fazenda.name || '';
    const matchesSearch = nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'Todos' || true; 

    return matchesSearch && matchesCategory;
  });

  const onMarkerPress = (fazenda: Fazenda) => {
    setSelectedFarm(fazenda);
    mapRef.current?.animateToRegion({
      latitude: fazenda.latitude - 0.002, 
      longitude: fazenda.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 500);
  };

  const onMapPress = () => {
    setSelectedFarm(null); 
  };

  const navigateToFarm = () => {
    if (selectedFarm) {
      router.push(`/fazenda/${selectedFarm.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar fazenda..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
           {['Todos', 'Orgânicos', 'Hidropônicos', 'Próximos'].map((filter) => (
             <TouchableOpacity 
               key={filter} 
               style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
               onPress={() => setActiveFilter(filter)}
             >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                  {filter}
                </Text>
             </TouchableOpacity>
           ))}
        </ScrollView>
      </View>

      {/* --- MAPA --- */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
        onPress={onMapPress} 
      >
        {filteredFazendas.map((fazenda) => {
           if (!fazenda.latitude || !fazenda.longitude) return null;
           const isSelected = selectedFarm?.id === fazenda.id;

           return (
             <Marker
               key={fazenda.id}
               coordinate={{ latitude: fazenda.latitude, longitude: fazenda.longitude }}
               onPress={() => onMarkerPress(fazenda)}
             >
               <View style={[styles.markerIcon, isSelected && styles.markerIconSelected]}>
                 <Ionicons name="leaf" size={isSelected ? 24 : 18} color="#FEFAE0" />
               </View>
             </Marker>
           );
        })}
      </MapView>

      {selectedFarm && (
        <View style={styles.cardContainer}>
           <TouchableOpacity activeOpacity={0.9} onPress={navigateToFarm} style={styles.cardContent}>
              <Image 
                source={{ uri: selectedFarm.imgUrl || 'https://via.placeholder.com/150' }} 
                style={styles.cardImage} 
              />
              <View style={styles.cardInfo}>
                 <Text style={styles.cardTitle}>{selectedFarm.farmName || selectedFarm.name}</Text>
                 <Text style={styles.cardSubtitle}>Toque para ver produtos e detalhes</Text>
                 
                 <View style={styles.cardFooter}>
                    <View style={styles.ratingBadge}>
                       <Ionicons name="star" size={12} color="#FFD700" />
                       <Text style={styles.ratingText}>4.8</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                 </View>
              </View>
           </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#283618" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F2' },
  map: { width: '100%', height: '100%' },
  topContainer: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10 },
  searchContainer: {
    marginHorizontal: 20, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 15, height: 45, borderRadius: 12, elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  
  filtersScroll: { marginTop: 10, paddingHorizontal: 20 },
  filterChip: { 
    backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, 
    marginRight: 10, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1 
  },
  filterChipActive: { backgroundColor: '#283618' },
  filterText: { color: '#333', fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: '#FEFAE0' },

  markerIcon: {
    backgroundColor: '#606C38', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF',
    elevation: 4
  },
  markerIconSelected: {
    backgroundColor: '#BC6C25', padding: 12, borderColor: '#FEFAE0', borderWidth: 3
  },

  cardContainer: {
    position: 'absolute', bottom: 30, left: 20, right: 20,
    backgroundColor: 'transparent', zIndex: 20,
  },
  cardContent: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 15, padding: 10,
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5
  },
  cardImage: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#EEE' },
  cardInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#283618', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#666', marginBottom: 6 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratingBadge: { flexDirection: 'row', backgroundColor: '#F0F0F0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#333' },

  loadingOverlay: { position: 'absolute', bottom: '50%', alignSelf: 'center' }
});