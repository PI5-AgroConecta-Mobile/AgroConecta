import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; 
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../../services/api';
import { ApiProduct } from '../../../types/api.types';

// --- Interface para as props do Card ---
interface ProductCardProps {
  item: ApiProduct;
  onDelete: (productId: string) => void; 
  onEdit: (product: ApiProduct) => void; 
}

// --- Componente de Card ---
const ProductCard = ({ item, onDelete, onEdit }: ProductCardProps) => {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  return (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: item.imgUrl || 'https://via.placeholder.com/150' }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.productStatus}>
          {item.productState ? 'Ativo' : 'Inativo'}
        </Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={() => onEdit(item)}>
          <Ionicons name="pencil" size={22} color="#606C38" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => onDelete(item.id)}>
          <Ionicons name="trash" size={22} color="#D90429" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default function MeusProdutosScreen() {
  const router = useRouter(); 
  
  const [produtos, setProdutos] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyProducts = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await api.get('/myproducts');
      setProdutos(response.data);
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("Não foi possível verificar a sua sessão.");
      } else {
        setError("Não foi possível carregar os seus produtos.");
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMyProducts();
    }, [fetchMyProducts])
  );

  const handleDelete = (productId: string) => {
    Alert.alert(
      "Apagar Produto",
      "Tem a certeza de que deseja apagar este produto? Esta ação é irreversível.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/deleteProduct/${productId}`);
              await fetchMyProducts(false);
            
            } catch (err) {
              if (axios.isAxiosError(err) && err.response) {
                Alert.alert("Erro", err.response.data.err || "Não foi possível apagar o produto.");
              } else {
                Alert.alert("Erro", "Erro de rede ao tentar apagar o produto.");
              }
            }
          },
        },
      ]
    );
  };
  
  const handleEdit = (product: ApiProduct) => {
    router.push({
      pathname: '/(farmer)/gerenciar-produto',
      params: { 
        product: JSON.stringify(product) 
      }
    });
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#283618" style={styles.centered} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (produtos.length === 0) {
      return <Text style={styles.emptyText}>Você ainda não criou nenhum produto.</Text>;
    }

    return (
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard 
            item={item} 
            onDelete={handleDelete} 
            onEdit={handleEdit}     
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => fetchMyProducts(true)} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Produtos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(farmer)/gerenciar-produto')}
        >
          <Ionicons name="add" size={24} color="#FEFAE0" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}

// --- Estilos  ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#283618',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#606C38',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FEFAE0',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#D90429',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  listContainer: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#283618',
  },
  productPrice: {
    fontSize: 16,
    color: '#606C38',
    marginTop: 5,
  },
  productStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  iconButton: {
    padding: 8,
  },
});