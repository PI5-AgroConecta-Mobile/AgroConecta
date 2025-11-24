import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../services/api';

export default function MapaScreen() {
    const [localizacao, setLocalizacao] = useState<Location.LocationObject | null>(null);
    const [erroMsg, setErroMsg] = useState<string | null>(null);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            // 1. Permissão e Localização
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErroMsg('Permissão para aceder à localização foi negada');
                setLoading(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocalizacao(location);

            // 2. Buscar dados da API
            try {
                const response = await api.get('/products');
                // Filtra itens que têm coordenadas válidas (assumindo que o produto ou user tem lat/long)
                // Se o backend não retornar lat/long no produto, precisará ajustar para buscar do user
                const validMarkers = response.data.filter((item: any) => 
                    item.latitude && item.longitude
                );
                setMarkers(validMarkers);
            } catch (error) {
                console.log("Erro ao buscar mapa", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (erroMsg) return <View style={styles.container}><Text>{erroMsg}</Text></View>;
    if (loading || !localizacao) return <View style={styles.container}><ActivityIndicator size="large" color="#283618" /></View>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: localizacao.coords.latitude,
                        longitude: localizacao.coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    showsUserLocation={true}
                >
                    {markers.map((item: any) => (
                        <Marker 
                            key={item.id} 
                            coordinate={{ latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }}
                        >
                            <Callout>
                                <View style={styles.calloutView}>
                                    <Text style={styles.calloutTitle}>{item.name}</Text>
                                    <Text style={styles.calloutText}>R$ {item.price}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>

                {/* Lista Horizontal Inferior (Dados Reais) */}
                <View style={styles.listaContainer}>
                    <Text style={styles.listaTitle}>Ofertas Próximas</Text>
                    {markers.length === 0 ? (
                        <Text style={{marginLeft: 15, color: '#666'}}>Nenhum produto com localização encontrado.</Text>
                    ) : (
                        <FlatList
                            data={markers}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item:any) => item.id}
                            renderItem={({ item }: {item:any}) => (
                                 <Link href={`/fazenda/${item.id}` as any} asChild>
                                    <TouchableOpacity style={styles.cardFazenda}>
                                        <Image 
                                            source={item.imgUrl ? { uri: item.imgUrl } : require('../../../assets/images/icon.png')} 
                                            style={styles.cardImage} 
                                        />
                                        <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.cardDistance}>R$ {item.price}</Text>
                                    </TouchableOpacity>
                                </Link>
                            )}
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
    container: { flex: 1 },
    map: { flex: 1 },
    calloutView: { width: 150, alignItems: 'center', padding: 5 },
    calloutTitle: { fontWeight: 'bold', fontSize: 14 },
    calloutText: { fontSize: 12 },
    listaContainer: { height: 220, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
    listaTitle: { fontSize: 18, fontWeight: 'bold', margin: 15 },
    cardFazenda: { width: 160, height: 150, borderRadius: 10, backgroundColor: '#F8F7F2', marginHorizontal: 5, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
    cardImage: { width: '100%', height: 90, backgroundColor: '#eee' },
    cardTitle: { fontWeight: 'bold', paddingHorizontal: 10, paddingTop: 5 },
    cardDistance: { fontSize: 14, color: '#2E7D32', paddingHorizontal: 10 },
});