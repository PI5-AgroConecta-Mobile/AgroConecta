import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DadosFazendaScreen() {
    const { user, updateAuthState } = useAuth();
    const [loading, setLoading] = useState(false);
    const [farmName, setFarmName] = useState(user?.farmName || '');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');

    const buscarCep = async () => {
        if (cep.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setRua(data.logradouro);
                setCidade(data.localidade);
                setEstado(data.uf);
            }
        } catch (error) {
            console.log("Erro CEP");
        }
    };

    const handleSave = async () => {
        if (!farmName || !cep || !rua || !numero || !cidade) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        setLoading(true);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Erro", "Permissão de localização necessária para cadastrar a fazenda no mapa.");
                setLoading(false);
                return;
            }
            const fullAddress = `${rua}, ${numero}, ${cidade} - ${estado}, ${cep}`;
            const geocodedLocation = await Location.geocodeAsync(fullAddress);

            if (geocodedLocation.length === 0) {
                Alert.alert("Erro", "Endereço não encontrado no mapa. Verifique os dados.");
                setLoading(false);
                return;
            }

            const { latitude, longitude } = geocodedLocation[0];
            await api.put('/updateUser', {
                farmName,
                latitude,
                longitude
            });

            if (updateAuthState) {
                await updateAuthState({
                    farmName,
                    latitude,
                    longitude
                });
            }

            Alert.alert("Sucesso", "Fazenda localizada e salva com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Falha ao salvar dados da fazenda.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#283618" />
                </TouchableOpacity>
                <Text style={styles.title}>Localização da Fazenda</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Nome da Fazenda *</Text>
                <TextInput 
                    style={styles.input} 
                    value={farmName} 
                    onChangeText={setFarmName} 
                    placeholder="Ex: Sítio Recanto Verde" 
                />

                <Text style={styles.sectionTitle}>Endereço</Text>
                <Text style={styles.subText}>Isso colocará sua fazenda no mapa para os clientes.</Text>

                <Text style={styles.label}>CEP *</Text>
                <TextInput 
                    style={styles.input} 
                    value={cep} 
                    onChangeText={setCep} 
                    keyboardType="numeric"
                    maxLength={8}
                    placeholder="00000000" 
                    onBlur={buscarCep}
                />

                <Text style={styles.label}>Rua / Logradouro *</Text>
                <TextInput style={styles.input} value={rua} onChangeText={setRua} />

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={styles.label}>Número *</Text>
                        <TextInput style={styles.input} value={numero} onChangeText={setNumero} keyboardType="numeric" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Estado (UF)</Text>
                        <TextInput style={styles.input} value={estado} onChangeText={setEstado} maxLength={2} />
                    </View>
                </View>

                <Text style={styles.label}>Cidade *</Text>
                <TextInput style={styles.input} value={cidade} onChangeText={setCidade} />

                <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Salvar e Localizar no Mapa</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#283618', marginLeft: 15 },
    content: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#283618', marginTop: 10 },
    subText: { fontSize: 13, color: '#666', marginBottom: 15 },
    label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: 'bold' },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
    row: { flexDirection: 'row' },
    button: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});