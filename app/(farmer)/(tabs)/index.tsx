import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickActions } from '@/components/QuickActions';
import { useFocusEffect } from 'expo-router';
import api from '../../../services/api';
import { ApiProduct } from '../../../types/api.types';

interface Agendamento {
  id: string;
  quantity: number;
  totalPrice: number;
  status: number; 
  scheduledFor: string;
  product: { name: string; imgUrl: string; };
  client: { name: string; contact: string; };
}

// --- Componente StatCard  ---
const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
    <View style={styles.statCard}>
        <Ionicons name={icon} size={28} color={color} style={styles.statIcon} />
        <View style={styles.statTextContainer}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    </View>
);

const ListItem = ({ title, subtitle, icon, iconColor }: { title: string, subtitle: string, icon: any, iconColor: string }) => (
    <View style={styles.listItem}>
        <Ionicons name={icon} size={24} color={iconColor} style={styles.listItemIcon} />
        <View style={{ flex: 1 }}>
            <Text style={styles.listItemTitle}>{title}</Text>
            <Text style={styles.listItemSubtitle}>{subtitle}</Text>
        </View>
    </View>
);

/*type ActionButtonProps = { href: any; icon: React.ComponentProps<typeof Ionicons>['name']; label: string; };
export const ActionButton = ({ href, icon, label }: ActionButtonProps) => (
    <Link href={href} asChild>
        <TouchableOpacity style={styles.actionButton}>
            <Ionicons name={icon} size={28} color="#1B5E20" />
            <Text style={styles.actionButtonText}>{label}</Text>
        </TouchableOpacity>
    </Link>
);*/


// --- Tela Principal do Dashboard ---
export default function DashboardScreen() {
    const [produtos, setProdutos] = useState<ApiProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
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

    const fetchAgendamentos = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const response = await api.get<Agendamento[]>('/myagendamentos/farmer');
      setAgendamentos(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Não foi possível carregar os agendamentos recebidos.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // useFocusEffect (sem alterações)
  useFocusEffect(
    useCallback(() => {
        fetchMyProducts();
        fetchAgendamentos()

    }, [fetchMyProducts])
  );
    const dashboardData = {
        faturamentoMes: 'R$ 1.250,50', agendamentosPendentes: 3, totalProdutos: 18, totalEstoque: 152,
        produtosMaisVendidos: [ { id: '1', nome: 'Tomate Orgânico', vendidos: '35 kg' }, { id: '2', nome: 'Ovos Caipira', vendidos: '20 dúzias' }, ],
        dadosGrafico: { labels: ["Maio", "Junho", "Julho", "Agosto", "Setembro"], datasets: [{ data: [ 850, 980, 1100, 1050, 1250 ] }] }
    };

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.pageTitle}>Meu Painel</Text>
            <Text style={styles.pageSubtitle}>Bem-vindo, Fazenda Horta da Clara!</Text>
            
            <View style={styles.statsContainer}>
                <StatCard icon="cash" label="Faturamento (Mês)" value={dashboardData.faturamentoMes} color="#2E7D32" />
                <StatCard icon="calendar" label="Agendamentos Pendentes" value={agendamentos.filter(ag=>(ag.status==1)).length} color="#D84315" />
            </View>
             <View style={styles.statsContainer}>
                <StatCard icon="basket" label="Produtos Ativos" value={produtos.length} color="#0277BD" />
                <StatCard icon="layers" label="Unidades em Estoque" value={dashboardData.totalEstoque} color="#6A1B9A" />
            </View>

            <QuickActions/>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vendas nos Últimos Meses</Text>
                <LineChart
                    data={dashboardData.dadosGrafico}
                    width={Dimensions.get("window").width - 70}
                    height={220}
                    yAxisLabel="R$ "
                    chartConfig={{
                        backgroundColor: "#FFFFFF", backgroundGradientFrom: "#FFFFFF", backgroundGradientTo: "#FFFFFF",
                        decimalPlaces: 0, color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 }, propsForDots: { r: "4", strokeWidth: "2", stroke: "#2E7D32" }
                    }}
                    bezier style={{ marginVertical: 8, borderRadius: 16 }}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Produtos Mais Vendidos</Text>
                {dashboardData.produtosMaisVendidos.map(item => (
                    <ListItem key={item.id} icon="ribbon-outline" iconColor="#1565C0" title={item.nome} subtitle={`Vendidos este mês: ${item.vendidos}`} />
                ))}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F4F8' },
    container: { padding: 20 },
    pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#1B5E20' },
    pageSubtitle: { fontSize: 16, color: 'gray', marginBottom: 25 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, marginBottom: 15 },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5,
    },
    statIcon: {
        marginRight: 10,
    },
    statTextContainer: {
        flex: 1, 
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        flexShrink: 1,
    },
    section: {
        marginTop: 25,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginBottom: 15,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#1B5E20',
        textAlign: 'center',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    listItemIcon: {
        marginRight: 15,
    },
    listItemTitle: {
        fontSize: 16,
        color: '#333',
    },
    listItemSubtitle: {
        fontSize: 14,
        color: 'gray',
        fontStyle: 'italic',
        marginTop: 2,
    },
});