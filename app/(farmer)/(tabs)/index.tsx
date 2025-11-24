import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { QuickActions } from '@/components/QuickActions';
import { useFocusEffect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { ApiProduct } from '../../../types/api.types';

// --- Interfaces ---
interface Agendamento {
    id: string;
    quantity: number;
    totalPrice: number;
    status: number;
    scheduledFor: string;
    product: { name: string; imgUrl: string; };
    client: { name: string; contact: string; };
}

// --- Componentes Auxiliares ---
const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
            <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.statTextContainer}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    </View>
);

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
    const { user } = useAuth();
    const [produtos, setProdutos] = useState<ApiProduct[]>([]);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [prodRes, agendRes] = await Promise.all([
                api.get('/myproducts'),
                api.get<Agendamento[]>('/myagendamentos/farmer')
            ]);
            setProdutos(prodRes.data);
            setAgendamentos(agendRes.data);
        } catch (err) {
            console.error("Erro dashboard", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const pendentes = agendamentos.filter(a => a.status === 0).length;
    const confirmados = agendamentos.filter(a => a.status === 1).length;
    const totalFaturamento = agendamentos
        .filter(a => a.status === 1)
        .reduce((acc, curr) => acc + Number(curr.totalPrice), 0);

    const pieData = [
        { name: 'Pendentes', population: pendentes, color: '#FFB74D', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Confirmados', population: confirmados, color: '#66BB6A', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: 'Cancelados', population: agendamentos.filter(a => a.status === 2).length, color: '#EF5350', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    ].filter(item => item.population > 0);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" backgroundColor="#F2F5F8" />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E7D32']} />}
            >
                <View style={styles.headerSimple}>
                    <Text style={styles.pageTitle}>Painel de Controle</Text>
                    <Text style={styles.pageSubtitle}>Visão geral da fazenda</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
                ) : (
                    <>
                        {/* Cards de Estatísticas */}
                        <View style={styles.gridContainer}>
                            <StatCard icon="wallet-outline" label="Faturamento" value={`R$ ${totalFaturamento.toFixed(2)}`} color="#2E7D32" />
                            <StatCard icon="cube-outline" label="Produtos" value={produtos.length} color="#1976D2" />
                        </View>
                        <View style={styles.gridContainer}>
                            <StatCard icon="time-outline" label="Pendentes" value={pendentes} color="#F57C00" />
                            <StatCard icon="checkmark-done-outline" label="Entregues" value={confirmados} color="#388E3C" />
                        </View>

                        {/* Ações Rápidas */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Acesso Rápido</Text>
                            <QuickActions />
                        </View>

                        {/* Gráfico de Pizza - Com espaçamento corrigido */}
                        {pieData.length > 0 && (
                            <View style={styles.chartSection}>
                                <View style={styles.chartCard}>
                                    <Text style={styles.chartTitle}>Status dos Pedidos</Text>
                                    <PieChart
                                        data={pieData}
                                        width={screenWidth - 60}
                                        height={200}
                                        chartConfig={{
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            decimalPlaces: 0,
                                        }}
                                        accessor={"population"}
                                        backgroundColor={"transparent"}
                                        paddingLeft={"15"}
                                        center={[10, 0]}
                                        absolute
                                    />
                                </View>
                            </View>
                        )}

                        {/* Últimos Pedidos */}
                        <View style={styles.lastOrdersContainer}>
                            <Text style={styles.sectionTitle}>Últimos Pedidos</Text>
                            {agendamentos.length === 0 ? (
                                <Text style={styles.emptyText}>Nenhum pedido recebido ainda.</Text>
                            ) : (
                                agendamentos.slice(0, 5).map((ag) => (
                                    <View key={ag.id} style={styles.orderRow}>
                                        <View style={[styles.statusDot, { backgroundColor: ag.status === 1 ? '#4CAF50' : ag.status === 0 ? '#FFC107' : '#F44336' }]} />
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <Text style={styles.orderProduct}>{ag.product?.name || 'Produto Removido'}</Text>
                                            <Text style={styles.orderClient}>{ag.client?.name} • {new Date(ag.scheduledFor).toLocaleDateString('pt-BR')}</Text>
                                        </View>
                                        <Text style={styles.orderPrice}>R$ {Number(ag.totalPrice).toFixed(2)}</Text>
                                    </View>
                                ))
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F2F5F8' },
    scrollView: { flex: 1 },
    container: { padding: 20, paddingBottom: 40 },
    
    headerSimple: { marginBottom: 20 },
    pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#1B5E20' },
    pageSubtitle: { fontSize: 14, color: '#666' },

    gridContainer: { flexDirection: 'row', gap: 15, marginBottom: 15 },
    statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
    iconContainer: { padding: 10, borderRadius: 8, marginRight: 12 },
    statTextContainer: { flex: 1 },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    statLabel: { fontSize: 12, color: '#666' },

    sectionContainer: { marginBottom: 25 }, 
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20', marginBottom: 12 },

    chartSection: { marginBottom: 25, alignItems: 'center' },
    chartCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, width: '100%', elevation: 2, alignItems: 'center' },
    chartTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10, alignSelf: 'flex-start' },

    lastOrdersContainer: { backgroundColor: '#FFF', borderRadius: 16, padding: 15, elevation: 2 },
    orderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F1F1' },
    statusDot: { width: 10, height: 10, borderRadius: 5 },
    orderProduct: { fontSize: 15, fontWeight: '600', color: '#333' },
    orderClient: { fontSize: 12, color: '#888' },
    orderPrice: { fontSize: 15, fontWeight: 'bold', color: '#2E7D32' },
    emptyText: { color: '#999', fontStyle: 'italic', textAlign: 'center', padding: 20 }
});