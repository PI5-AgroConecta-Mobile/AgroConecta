import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Componentes Reutilizáveis para a Tela ---

const SectionTitle = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
);

// Linha de navegação (ex: Editar Perfil)
const SettingsRow = ({ href, icon, label }: { href: any, icon: any, label: string }) => (
    <Link href={href} asChild>
        <TouchableOpacity style={styles.row}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon} size={24} color="#606C38" />
                <Text style={styles.rowLabel}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={22} color="#A9A9A9" />
        </TouchableOpacity>
    </Link>
);

// Linha com botão de Ligar/Desligar
const NotificationSwitch = ({ icon, label, value, onValueChange }: { icon: any, label: string, value: boolean, onValueChange: (value: boolean) => void }) => (
    <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={icon} size={24} color="#606C38" />
            <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <Switch
            trackColor={{ false: "#E0E0E0", true: "#606C38" }}
            thumbColor={value ? "#FEFAE0" : "#f4f3f4"}
            onValueChange={onValueChange}
            value={value}
        />
    </View>
);


// --- Tela Principal de Configurações ---
export default function ConfiguracoesScreen() {
    const [lembretes, setLembretes] = useState(true);
    const [statusPedido, setStatusPedido] = useState(true);
    const [novosProdutos, setNovosProdutos] = useState(false);
    const [promocoes, setPromocoes] = useState(true);

    const confirmDeleteAccount = () => {
        Alert.alert(
            "Apagar Conta",
            "Tem a certeza de que deseja apagar a sua conta? Esta ação é irreversível.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Apagar", style: "destructive", onPress: () => router.replace('/(auth)') } // Lógica de apagar e logout
            ]
        );
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: 'Configurações' }} />
      <ScrollView>
        <View style={styles.container}>
            {/* --- Seção Inventada: Gerenciamento da Conta --- */}
            <SectionTitle title="Gerenciamento da Conta" />
            <View style={styles.card}>
                <SettingsRow href="/editarPerfil" icon="person-outline" label="Editar Perfil" />
                <SettingsRow href="/alterarSenha" icon="lock-closed-outline" label="Alterar Senha" />
            </View>

            {/* --- Seção de Notificações --- */}
            <SectionTitle title="Notificações Push" />
            <View style={styles.card}>
                <NotificationSwitch icon="calendar-outline" label="Lembretes de agendamentos" value={lembretes} onValueChange={setLembretes} />
                <NotificationSwitch icon="swap-horizontal-outline" label="Status do pedido" value={statusPedido} onValueChange={setStatusPedido} />
                <NotificationSwitch icon="basket-outline" label="Novos produtos favoritos" value={novosProdutos} onValueChange={setNovosProdutos} />
                <NotificationSwitch icon="pricetag-outline" label="Promoções e ofertas" value={promocoes} onValueChange={setPromocoes} />
            </View>
            
            {/* --- Seção de Informações --- */}
            <SectionTitle title="Sobre o App" />
            <View style={styles.card}>
                <SettingsRow href="/termos" icon="document-text-outline" label="Termos de Serviço" />
                <SettingsRow href="/privacidade" icon="shield-checkmark-outline" label="Política de Privacidade" />
                <TouchableOpacity style={styles.row} onPress={() => Alert.alert("Avaliação", "Em breve, isto levará para a loja de aplicativos!")}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="star-outline" size={24} color="#606C38" />
                        <Text style={styles.rowLabel}>Avalie o nosso App</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* --- Seção de Apagar Conta --- */}
            <TouchableOpacity style={styles.deleteButton} onPress={confirmDeleteAccount}>
                <Text style={styles.deleteButtonText}>Apagar Conta</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>AgroConecta Versão 1.0.0 (Build 1)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F7F2',
    },
    container: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#888',
        paddingHorizontal: 10,
        marginTop: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    rowLabel: {
        fontSize: 16,
        marginLeft: 15,
        color: '#333',
    },
    deleteButton: {
        marginTop: 30,
        backgroundColor: '#FFF1F0',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#C70039',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        marginTop: 30,
        color: '#A9A9A9',
        fontSize: 12,
    },
});