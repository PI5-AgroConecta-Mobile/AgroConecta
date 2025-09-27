import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

// --- Tipos e Dados de Exemplo ---
interface Fazenda {
    id: string;
    nome: string;
    produtos: string[];
    imagem: any;
    coordenadas: {
        latitude: number;
        longitude: number;
    };
}

const fazendas: Fazenda[] = [
    { id: '1', nome: 'Horta da Clara', produtos: ['Tomates', 'Alface'], imagem: require('../../../assets/images/hortaDonaClara.png'), coordenadas: { latitude: -23.5505, longitude: -46.6345 } },
    { id: '2', nome: 'Sítio Verde', produtos: ['Ovos', 'Queijo'], imagem: require('../../../assets/images/fazenda2.jpg'), coordenadas: { latitude: -23.5480, longitude: -46.6360 } },
    { id: '3', nome: 'Fazenda Feliz', produtos: ['Cenouras', 'Batatas'], imagem: require('../../../assets/images/fazenda3.jpg'), coordenadas: { latitude: -23.5530, longitude: -46.6300 } },
];

// --- Tela Principal do Mapa ---
export default function MapaScreen() {
    const [localizacao, setLocalizacao] = useState<Location.LocationObject | null>(null);
    const [erroMsg, setErroMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErroMsg('Permissão para aceder à localização foi negada');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocalizacao(location);
        })();
    }, []);

    // --- Renderização da Tela ---
    if (erroMsg) {
        return <View style={styles.container}><Text>{erroMsg}</Text></View>;
    }

    if (!localizacao) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#283618" /></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Filtros (funcionalidade a ser adicionada no futuro) */}
                <View style={styles.filtrosContainer}>
                    <Text style={styles.filtrosText}>Filtros: Em breve!</Text>
                </View>

                {/* Mapa */}
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: localizacao.coords.latitude,
                        longitude: localizacao.coords.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.01,
                    }}
                >
                    {/* Marcador do Usuário */}
                    <Marker coordinate={localizacao.coords} title="Você está aqui" pinColor="blue" />

                    {/* Marcadores das Fazendas */}
                    {fazendas.map(fazenda => (
                        <Marker key={fazenda.id} coordinate={fazenda.coordenadas}>
                            <Callout>
                                <View style={styles.calloutView}>
                                    <Image source={fazenda.imagem} style={styles.calloutImage} />
                                    <Text style={styles.calloutTitle}>{fazenda.nome}</Text>
                                    <Text style={styles.calloutText}>Produtos: {fazenda.produtos.join(', ')}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>

                {/* Lista de Fazendas Próximas */}
                <View style={styles.listaContainer}>
                    <Text style={styles.listaTitle}>Fazendas Próximas</Text>
                    <FlatList
                        data={fazendas}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                             <Link href={{ pathname: '/fazenda/[id]', params: { id: item.id, nome: item.nome } }} asChild>
                                <TouchableOpacity style={styles.cardFazenda}>
                                    <Image source={item.imagem} style={styles.cardImage} />
                                    <Text style={styles.cardTitle}>{item.nome}</Text>
                                    <Text style={styles.cardDistance}>A 1.5 km de você</Text>
                                </TouchableOpacity>
                            </Link>
                        )}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
    container: { flex: 1 },
    filtrosContainer: { padding: 15, backgroundColor: '#fff' },
    filtrosText: { fontSize: 16, fontWeight: '500' },
    map: {
        flex: 1,
    },
    calloutView: { width: 150, alignItems: 'center' },
    calloutImage: { width: 140, height: 80, borderRadius: 5 },
    calloutTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 5 },
    calloutText: { fontSize: 12 },
    listaContainer: {
        height: 220,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    listaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 15,
    },
    cardFazenda: {
        width: 160,
        height: 150,
        borderRadius: 10,
        backgroundColor: '#F8F7F2',
        marginHorizontal: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardImage: {
        width: '100%',
        height: 90,
    },
    cardTitle: {
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    cardDistance: {
        fontSize: 12,
        color: '#666',
        paddingHorizontal: 10,
    },
});