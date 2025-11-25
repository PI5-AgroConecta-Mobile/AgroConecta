import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api';
const IMAGE_URL = 'http://192.168.1.102:3333'; 

export default function FazendaDetalhes() {
    const { id } = useLocalSearchParams(); 
    const [products, setProducts] = useState([]);
    const [farmer, setFarmer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const userRes = await api.get(`/getUser/${id}`);
            setFarmer(userRes.data);
            const prodRes = await api.get('/listProduct', {
                params: { ownerId: id } 
            });
            setProducts(prodRes.data);

        } catch (error) {
            console.log("Erro ao carregar fazenda", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{flex:1}} size="large" color="#283618" />;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <ScrollView>
                {/* Header com Foto da Fazenda/Perfil */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Image 
                        source={farmer?.imgUrl ? { uri: `${IMAGE_URL}/${farmer.imgUrl}` } : require('../../../assets/images/fazenda1.jpg')} 
                        style={styles.coverImage} 
                    />
                    <View style={styles.overlay} />
                    <View style={styles.headerContent}>
                        <Text style={styles.farmName}>{farmer?.farmName || farmer?.name}</Text>
                        <Text style={styles.locationText}>
                            <Ionicons name="location" size={14} color="#fff" /> {farmer?.city || "Localização não informada"}
                        </Text>
                    </View>
                </View>

                {/* Lista de Produtos */}
                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Produtos Disponíveis</Text>
                    
                    {products.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum produto disponível no momento.</Text>
                    ) : (
                        products.map((item: any) => (
                            <TouchableOpacity key={item.id} style={styles.productCard}>
                                <Image 
                                    source={item.imgUrl ? { uri: item.imgUrl } : require('../../../assets/images/icon.png')} 
                                    style={styles.prodImage} 
                                />
                                <View style={styles.prodInfo}>
                                    <Text style={styles.prodName}>{item.name}</Text>
                                    <Text style={styles.prodPrice}>R$ {item.price.toFixed(2)} / {item.unityType === 0 ? 'kg' : 'un'}</Text>
                                </View>
                                <TouchableOpacity style={styles.addButton}>
                                    <Ionicons name="add" size={24} color="#fff" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F7F2' },
    header: { height: 250, position: 'relative' },
    coverImage: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    backButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
    headerContent: { position: 'absolute', bottom: 20, left: 20 },
    farmName: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
    locationText: { color: '#eee', fontSize: 14, marginTop: 5 },
    body: { padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#283618', marginBottom: 15 },
    emptyText: { fontStyle: 'italic', color: '#666' },
    productCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, padding: 10, alignItems: 'center', elevation: 2 },
    prodImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
    prodInfo: { flex: 1, marginLeft: 15 },
    prodName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    prodPrice: { color: '#2E7D32', fontWeight: 'bold' },
    addButton: { backgroundColor: '#2E7D32', padding: 8, borderRadius: 20 },
});