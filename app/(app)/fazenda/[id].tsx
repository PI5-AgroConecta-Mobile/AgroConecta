import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, FlatList, ActivityIndicator, 
  TouchableOpacity, ScrollView, Linking 
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FazendaPerfilScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [farmer, setFarmer] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const userRes = await api.get(`/getUser/${id}`);
      setFarmer(userRes.data);
      const prodRes = await api.get(`/products/farmer/${id}`);
      setProducts(prodRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (contact: string) => {
    const cleanNumber = contact.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/55${cleanNumber}`);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#283618"/></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
           </TouchableOpacity>
           <Image 
             source={{ uri: farmer?.imgUrl || 'https://via.placeholder.com/500' }} 
             style={styles.coverImage} 
           />
           <View style={styles.overlay} />
           <View style={styles.headerContent}>
              <Text style={styles.farmName}>{farmer?.farmName || farmer?.name}</Text>
              <View style={styles.ratingBadge}>
                 <Ionicons name="star" size={14} color="#FFD700" />
                 <Text style={styles.ratingText}>4.8 (Novo)</Text>
              </View>
           </View>
        </View>

        {/* Informações */}
        <View style={styles.infoContainer}>
           <Text style={styles.sectionTitle}>Sobre o Produtor</Text>
           <Text style={styles.description}>
             Produtor local focado em agricultura familiar e produtos frescos.
           </Text>

           {farmer?.contact && (
             <TouchableOpacity style={styles.whatsappButton} onPress={() => openWhatsApp(farmer.contact)}>
                <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
                <Text style={styles.whatsappText}>Entrar em contato</Text>
             </TouchableOpacity>
           )}
        </View>
        <View style={styles.productsContainer}>
           <Text style={styles.sectionTitle}>Produtos Disponíveis ({products.length})</Text>
           
           {products.length === 0 ? (
             <Text style={styles.emptyText}>Nenhum produto disponível no momento.</Text>
           ) : (
             <FlatList
               data={products}
               horizontal
               showsHorizontalScrollIndicator={false}
               keyExtractor={(item) => item.id}
               contentContainerStyle={{ paddingVertical: 10 }}
               renderItem={({ item }) => (
                 <Link href={`/detalhesProdutos?id=${item.id}`} asChild>
                   <TouchableOpacity style={styles.productCard}>
                      <Image source={{ uri: item.imgUrl }} style={styles.productImage} />
                      <View style={styles.productInfo}>
                        <Text style={styles.prodName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.prodPrice}>R$ {item.price.toFixed(2)}</Text>
                      </View>
                   </TouchableOpacity>
                 </Link>
               )}
             />
           )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F2' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { height: 250, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  headerContent: { position: 'absolute', bottom: 20, left: 20 },
  farmName: { color: '#FFF', fontSize: 26, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.7)', textShadowRadius: 10 },
  ratingBadge: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginTop: 5, alignItems: 'center', gap: 4 },
  ratingText: { color: '#FFD700', fontWeight: 'bold', fontSize: 12 },
  
  infoContainer: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#283618', marginBottom: 10 },
  description: { color: '#666', lineHeight: 20, marginBottom: 15 },
  whatsappButton: { backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, gap: 8 },
  whatsappText: { color: '#FFF', fontWeight: 'bold' },

  productsContainer: { padding: 20 },
  emptyText: { color: '#999', fontStyle: 'italic' },
  productCard: { width: 140, marginRight: 15, backgroundColor: '#FFF', borderRadius: 10, elevation: 2, padding: 8 },
  productImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 8 },
  productInfo: { alignItems: 'flex-start' },
  prodName: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  prodPrice: { color: '#606C38', fontWeight: 'bold', marginTop: 2 },
});