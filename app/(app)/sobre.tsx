import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Linking, 
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Componentes Reutilizáveis para a Tela ---

// Título de cada seção
const SectionTitle = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
);

const StepCard = ({ icon, step, description }: { icon: any, step: string, description: string }) => (
    <View style={styles.stepCard}>
        <Ionicons name={icon} size={32} color="#283618" />
        <Text style={styles.stepTitle}>{step}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
    </View>
);


// --- Tela Principal "Sobre" ---
export default function SobreScreen() {

    const handleRateApp = () => {
        Alert.alert("Obrigado!", "Em breve, este botão levará para a App Store / Google Play.");
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: true }} />
      <ScrollView>
        {/* Banner de Cabeçalho */}
        <ImageBackground
          source={require('../../assets/images/fazenda1.jpg')}
          style={styles.headerBanner}
        >
            <View style={styles.headerOverlay} />
            <Text style={styles.headerTitle}>Nossa História</Text>
        </ImageBackground>

        <View style={styles.container}>
            {/* Seção Nossa Missão */}
            <View style={styles.card}>
                <SectionTitle title="Nossa Missão" />
                <Text style={styles.bodyText}>
                    O AgroConecta nasceu do desejo de encurtar a distância entre o campo e a sua mesa. Acreditamos no poder da agricultura familiar e na importância de saber a origem dos seus alimentos. Criamos uma comunidade justa e transparente, onde consumidores encontram produtos frescos e de qualidade, e os produtores locais encontram um caminho direto para vender a sua colheita com dignidade.
                </Text>
            </View>

            {/* Seção Como Funciona */}
            <View style={styles.card}>
                <SectionTitle title="Como Funciona" />
                <View style={styles.stepsContainer}>
                    <StepCard icon="search-outline" step="1. Descubra" description="Explore o mapa ou o catálogo para encontrar produtores locais." />
                    <StepCard icon="calendar-outline" step="2. Agende" description="Escolha os melhores dias e horários para retirar os seus produtos." />
                    <StepCard icon="basket-outline" step="3. Desfrute" description="Retire os seus alimentos frescos e aproveite o sabor do campo." />
                </View>
            </View>
            
            {/* Seção de Informações do App */}
            <View style={styles.card}>
                <SectionTitle title="Sobre o Aplicativo" />
                <TouchableOpacity style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Termos de Serviço</Text>
                    <Ionicons name="chevron-forward-outline" size={22} color="#A9A9A9" />
                </TouchableOpacity>
                 <TouchableOpacity style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Política de Privacidade</Text>
                    <Ionicons name="chevron-forward-outline" size={22} color="#A9A9A9" />
                </TouchableOpacity>
                 <TouchableOpacity style={styles.infoRow} onPress={handleRateApp}>
                    <Text style={styles.infoLabel}>Avalie o nosso App</Text>
                    <Ionicons name="open-outline" size={22} color="#A9A9A9" />
                </TouchableOpacity>
            </View>
        </View>

        <Text style={styles.versionText}>AgroConecta Versão 1.0.0</Text>
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
    headerBanner: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(40, 54, 24, 0.5)',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#283618',
        marginBottom: 15,
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    stepsContainer: {
        gap: 15,
    },
    stepCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F7F2',
        padding: 15,
        borderRadius: 10,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#283618',
        marginLeft: 15,
    },
    stepDescription: {
        fontSize: 14,
        color: '#555',
        flex: 1,
        marginLeft: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#333',
    },
    versionText: {
        textAlign: 'center',
        color: '#A9A9A9',
        fontSize: 12,
        marginBottom: 20,
    },
});