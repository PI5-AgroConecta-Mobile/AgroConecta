import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// Ajuste para o seu IP
const BASE_URL = 'http://192.168.1.102:3333'; 

type FormRowProps = {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
};

const FormRow: React.FC<FormRowProps> = ({ icon, label, value, placeholder, secureTextEntry = false, onChangeText }) => (
    <View style={styles.formRow}>
        <Ionicons name={icon} size={24} color="#606C38" style={styles.inputIcon} />
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                autoCapitalize={secureTextEntry ? 'none' : 'sentences'}
            />
        </View>
    </View>
);

export default function EditarPerfilFarmerScreen() {
    const { user, updateAuthState } = useAuth();
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            await uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        setLoading(true);
        try {
            const formData = new FormData();
            // @ts-ignore
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename as string);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            // @ts-ignore
            formData.append('avatar', { uri, name: filename, type });

            const response = await api.patch('/user/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (updateAuthState) {
                await updateAuthState({ imgUrl: response.data.imgUrl });
            }
            Alert.alert('Sucesso', 'Foto de perfil atualizada!');

        } catch (error) {
            console.log("Erro upload", error);
            Alert.alert('Erro', 'Falha ao enviar a foto.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        if (password && password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não conferem.");
            return;
        }

        setLoading(true);
        try {
            const dataToUpdate: any = { name, email };
            if (password) dataToUpdate.password = password;

            const response = await api.put('/updateUser', dataToUpdate);

            if (updateAuthState) {
                await updateAuthState(response.data);
            }

            Alert.alert("Sucesso!", "Seu perfil foi atualizado.", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.log(error);
            Alert.alert("Erro", error.response?.data?.err || "Falha ao atualizar perfil.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
             <Ionicons name="arrow-back" size={24} color="#283618" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil (Agricultor)</Text>
          <View style={{ width: 44 }} />
      </View>

      <ScrollView>
        <View style={styles.container}>
            <View style={styles.profilePicContainer}>
                {user?.imgUrl ? (
                    <Image
                        source={{ uri: `${BASE_URL}/uploads/${user.imgUrl}` }}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={[styles.profileImage, { backgroundColor: '#A3B18A', justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="person" size={60} color="#FFF" />
                    </View>
                )}

                <TouchableOpacity style={styles.changePicButton} onPress={handlePickImage} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <FormRow icon="person-outline" label="Nome do Responsável" value={name} onChangeText={setName} placeholder="Seu nome" />
                <FormRow icon="mail-outline" label="Email de Acesso" value={email} onChangeText={setEmail} placeholder="Seu email" />
                <FormRow icon="lock-closed-outline" label="Nova Senha" placeholder="Deixe em branco para manter" secureTextEntry value={password} onChangeText={setPassword} />
                <FormRow icon="lock-closed-outline" label="Confirmar Nova Senha" placeholder="Confirme a senha" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={loading}>
              {loading ? (
                  <ActivityIndicator color="#FEFAE0" />
              ) : (
                  <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              )}
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F7F2' },
    headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#283618' },
    container: { padding: 20 },
    profilePicContainer: { alignItems: 'center', marginBottom: 30, position: 'relative' },
    profileImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd', borderWidth: 3, borderColor: '#fff' },
    changePicButton: { position: 'absolute', bottom: 0, right: '35%', backgroundColor: '#283618', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
    form: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    formRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    inputIcon: { marginHorizontal: 10 },
    inputContainer: { flex: 1 },
    inputLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
    input: { fontSize: 16, color: '#333', paddingVertical: 5 },
    footer: { padding: 20, backgroundColor: '#F8F7F2' },
    saveButton: { backgroundColor: '#283618', padding: 15, borderRadius: 10, alignItems: 'center' },
    saveButtonText: { color: '#FEFAE0', fontSize: 18, fontWeight: 'bold' },
});