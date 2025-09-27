import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Image, Alert, ImageSourcePropType } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Produto { id: string; nome: string; preco: string; estoque: string; image: ImageSourcePropType; }
const meusProdutosInicial: Produto[] = [
    { id: '1', nome: 'Tomate Orgânico', preco: 'R$ 10,99/kg', estoque: '10', image: require('../../../assets/images/tomate.jpg') },
    { id: '2', nome: 'Alface Crespa', preco: 'R$ 3,50/un', estoque: '30', image: require('../../../assets/images/alface.jpg') },
    { id: '3', nome: 'Queijo Minas', preco: 'R$ 25,00/kg', estoque: '5', image: require('../../../assets/images/queijominas.jpg') },
];

export default function FarmerProductsScreen() {
    const [meusProdutos, setMeusProdutos] = useState(meusProdutosInicial);

    const handleDelete = (produtoId: string) => {
        Alert.alert( "Apagar Produto", "Tem a certeza?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Apagar", style: "destructive", onPress: () => {
                    setMeusProdutos(produtosAtuais => produtosAtuais.filter(p => p.id !== produtoId));
                }}
            ]
        );
    };

    const renderProduto = ({ item }: { item: Produto }) => (
        <View style={styles.card}>
            <Image source={item.image} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nome}</Text>
                <Text style={styles.productPrice}>{item.preco}</Text>
                <Text style={styles.productStock}>Estoque: {item.estoque}</Text>
            </View>
            <View style={styles.actions}>
                <Link href={{ pathname: "/gerenciar-produto", params: { id: item.id, nome: item.nome, preco: item.preco, estoque: item.estoque } }} asChild>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="pencil" size={22} color="#0277BD" />
                    </TouchableOpacity>
                </Link>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-bin" size={22} color="#C62828" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: true, title: "Meus Produtos" }} />
            <FlatList
                data={meusProdutos}
                renderItem={renderProduto}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
            <Link href="/gerenciar-produto" asChild>
                <TouchableOpacity style={styles.fab}>
                    <Ionicons name="add" size={32} color="#FFFFFF" />
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
    listContainer: { padding: 15 },
    card: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, alignItems: 'center' },
    productImage: { width: 70, height: 70, borderRadius: 8 },
    productInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    productName: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20' },
    productPrice: { fontSize: 16, color: '#555', marginVertical: 2 },
    productStock: { fontSize: 14, color: 'gray' },
    actions: { flexDirection: 'row' },
    actionButton: { padding: 8 },
    fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center', elevation: 5 },
});