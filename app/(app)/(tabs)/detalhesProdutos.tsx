import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ImageSourcePropType,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Interface para o tipo de produto ---
interface Produto {
    id: string;
    nome: string;
    produtor: string;
    precoUnitario: number;
    unidade: string;
    descricao: string;
    imagem: ImageSourcePropType;
}

// --- Dados de Exemplo com os caminhos das imagens CORRIGIDOS ---
const getProductDetails = (id: string | string[]): Produto => {
    const products: Record<string, Produto> = {
        '1': { id: '1', nome: 'Tomate Orgânico', produtor: 'Horta da Clara', precoUnitario: 10.99, unidade: 'kg', descricao: 'Tomates frescos e suculentos, cultivados sem agrotóxicos. Perfeitos para saladas, molhos e para comer puro.', imagem: require('../../../assets/images/tomate.jpg')},
        '2': { id: '2', nome: 'Alface Crespa', produtor: 'Sítio Verde', precoUnitario: 3.50, unidade: 'un', descricao: 'Folhas crocantes e saborosas, ideais para uma salada refrescante e saudável.', imagem: require('../../../assets/images/alface.jpg')},
        '3': { id: '3', nome: 'Cenoura Fresca', produtor: 'Fazenda Feliz', precoUnitario: 5.00, unidade: 'kg', descricao: 'Cenouras doces e crocantes, perfeitas para lanches ou para cozinhar.', imagem: require('../../../assets/images/cenoura.jpg')},
        '4': { id: '4', nome: 'Queijo Minas', produtor: 'Laticínios da Serra', precoUnitario: 25.00, unidade: 'kg', descricao: 'Queijo fresco e artesanal, com um sabor suave e textura macia.', imagem: require('../../../assets/images/queijominas.jpg')},
        '5': { id: '5', nome: 'Ovos Caipira', produtor: 'Galinheiro do Zé', precoUnitario: 15.00, unidade: 'dúzia', descricao: 'Ovos de galinhas criadas soltas, com gemas mais ricas e saborosas.', imagem: require('../../../assets/images/ovos.jpg')},
        '6': { id: '6', nome: 'Mel Silvestre', produtor: 'Apiário do Sol', precoUnitario: 30.00, unidade: 'pote', descricao: 'Mel puro e natural, colhido de flores silvestres da região.', imagem: require('../../../assets/images/mel.jpg')},
    };
    return products[String(id)] || products['1']; // Retorna produto ou um padrão
}


export default function DetalhesProdutoScreen() {
  const { id } = useLocalSearchParams();
  const produto = getProductDetails(id);

  const [quantidade, setQuantidade] = useState(1);

  const precoTotal = (produto.precoUnitario * quantidade).toFixed(2).replace('.', ',');

  const handleAgendar = () => {
      alert(`${quantidade} ${produto.unidade} de ${produto.nome} agendado(s)!`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <Image source={produto.imagem} style={styles.headerImage} />
        <View style={styles.container}>
            <Text style={styles.producerName}>Vendido por: {produto.produtor}</Text>
            <Text style={styles.productName}>{produto.nome}</Text>
            
            <Text style={styles.description}>{produto.descricao}</Text>

            <View style={styles.separator} />
            
            <View style={styles.quantityContainer}>
                <Text style={styles.quantityLabel}>Quantidade ({produto.unidade})</Text>
                <View style={styles.quantitySelector}>
                    <TouchableOpacity onPress={() => setQuantidade(Math.max(1, quantidade - 1))}>
                        <Ionicons name="remove-circle-outline" size={32} color="#283618" />
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{quantidade}</Text>
                    <TouchableOpacity onPress={() => setQuantidade(quantidade + 1)}>
                        <Ionicons name="add-circle" size={32} color="#283618" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.separator} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
          <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Preço Total</Text>
              <Text style={styles.priceValue}>R$ {precoTotal}</Text>
          </View>
          <TouchableOpacity style={styles.scheduleButton} onPress={handleAgendar}>
              <Text style={styles.scheduleButtonText}>Agendar Retirada</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerImage: {
        width: '100%',
        height: 250,
    },
    container: {
        padding: 20,
    },
    producerName: {
        fontSize: 16,
        color: '#606C38',
        fontWeight: '600',
    },
    productName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#283618',
        marginTop: 4,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginTop: 15,
    },
    separator: {
        height: 1,
        backgroundColor: '#EAEAEA',
        marginVertical: 20,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityValue: {
        fontSize: 22,
        fontWeight: 'bold',
        marginHorizontal: 20,
        color: '#283618',
    },
    footer: {
        borderTopWidth: 1,
        borderColor: '#EAEAEA',
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 14,
        color: '#888',
    },
    priceValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#283618',
    },
    scheduleButton: {
        backgroundColor: '#283618',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    scheduleButtonText: {
        color: '#FEFAE0',
        fontSize: 16,
        fontWeight: 'bold',
    },
});