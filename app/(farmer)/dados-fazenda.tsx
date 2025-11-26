import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location'; 
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DadosFazendaScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [farmName, setFarmName] = useState('');
  const [contact, setContact] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState(''); 
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFarmName(user.farmName || '');
      setContact(user.contact || '');
      setLatitude(user.latitude || null);
      setLongitude(user.longitude || null);
    }
  }, [user]);

  const handleGetLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à localização.');
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      
      try {
        const reverse = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        });
        if (reverse.length > 0) {
            const addr = reverse[0];
            setStreet(addr.street || '');
            setDistrict(addr.district || '');
            setCity(addr.city || '');
            setUf(addr.region || '');
            setNumber(addr.streetNumber || '');
            if(addr.postalCode) setCep(addr.postalCode);
        }
      } catch (e) {
      }

      Alert.alert('Sucesso', 'Localização GPS capturada!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter o GPS.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleBlurCep = async () => {
    if (cep.length < 8) return;

    setLoadingCep(true);
    Keyboard.dismiss();
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado.');
        return;
      }

      setStreet(data.logradouro || '');
      setDistrict(data.bairro || '');
      setCity(data.localidade || '');
      setUf(data.uf || '');
      
      if (number) {
          updateCoordinatesFromAddress(`${data.logradouro}, ${number} - ${data.localidade}`);
      } else {
          updateCoordinatesFromAddress(`${data.logradouro}, ${data.localidade}`);
      }

    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleBlurNumber = () => {
      if (street && city && number) {
          updateCoordinatesFromAddress(`${street}, ${number} - ${city}, ${uf}`);
      }
  }

  const updateCoordinatesFromAddress = async (fullAddress: string) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let geocoded = await Location.geocodeAsync(fullAddress);
      if (geocoded.length > 0) {
        setLatitude(geocoded[0].latitude);
        setLongitude(geocoded[0].longitude);
      }
    } catch (e) {
      console.log("Erro geocoding:", e);
    }
  };

  const handleSave = async () => {
    if (!farmName) {
      Alert.alert('Obrigatório', 'Digite o nome da fazenda.');
      return;
    }
    if (!latitude || !longitude) {
      Alert.alert('Localização', 'Use o botão de GPS ou digite o endereço completo.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put('/updateUser', {
        farmName,
        contact,
        latitude,
        longitude
      });

      if (setUser) {
         // @ts-ignore
         setUser({ ...user, ...response.data });
      }

      Alert.alert('Sucesso', 'Dados atualizados!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#283618" />
        </TouchableOpacity>
        <Text style={styles.title}>Dados da Fazenda</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome da Fazenda</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Fazenda Santa Luzia"
          value={farmName}
          onChangeText={setFarmName}
        />

        <Text style={styles.label}>Contato</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />

        <View style={styles.divider} />
        
        <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <TouchableOpacity style={styles.gpsButtonSmall} onPress={handleGetLocation} disabled={locationLoading}>
                {locationLoading ? <ActivityIndicator size="small" color="#FFF"/> : <Ionicons name="locate" size={20} color="#FFF" />}
                <Text style={styles.gpsButtonText}>Usar GPS</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.row}>
            <View style={{flex: 2, marginRight: 10}}>
                <Text style={styles.label}>CEP</Text>
                <TextInput
                    style={styles.input}
                    placeholder="00000-000"
                    value={cep}
                    onChangeText={setCep}
                    keyboardType="numeric"
                    maxLength={9}
                    onBlur={handleBlurCep}
                />
            </View>
            
            <View style={{flex: 1}}>
                <Text style={styles.label}>Nº</Text>
                <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={number}
                    onChangeText={setNumber}
                    onBlur={handleBlurNumber} 
                />
            </View>
        </View>

        <Text style={styles.label}>Rua / Logradouro</Text>
        <TextInput style={[styles.input, styles.readOnly]} value={street} editable={false} />
        
        <View style={styles.row}>
            <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Bairro</Text>
                <TextInput style={[styles.input, styles.readOnly]} value={district} editable={false} />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.label}>Cidade</Text>
                <TextInput style={[styles.input, styles.readOnly]} value={city} editable={false} />
            </View>
        </View>

        <View style={[styles.coordsFeedback, latitude ? styles.feedbackOk : styles.feedbackWarn]}>
            <Ionicons 
                name={latitude ? "checkmark-circle" : "navigate-circle"} 
                size={24} 
                color={latitude ? "#2E7D32" : "#F57C00"} 
            />
            <View style={{marginLeft: 10, flex: 1}}>
                <Text style={[styles.coordsTitle, {color: latitude ? "#2E7D32" : "#F57C00"}]}>
                    {latitude ? "Localização Identificada" : "Localização Pendente"}
                </Text>
                <Text style={styles.coordsSub}>
                    {latitude 
                        ? `Lat: ${latitude.toFixed(4)}, Long: ${longitude?.toFixed(4)}` 
                        : "Preencha o endereço com número OU clique em 'Usar GPS'"}
                </Text>
            </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F8F7F2', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  backButton: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#283618' },
  form: { gap: 12 },
  
  locationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#283618' },
  gpsButtonSmall: { backgroundColor: '#BC6C25', flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center', gap: 5 },
  gpsButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 5 },
  label: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
  input: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD',
    borderRadius: 8, padding: 12, fontSize: 16, color: '#333'
  },
  readOnly: { backgroundColor: '#EFEFEF', color: '#666' },
  row: { flexDirection: 'row' },
  
  coordsFeedback: { 
    flexDirection: 'row', alignItems: 'center', marginTop: 15, 
    padding: 15, borderRadius: 10, borderWidth: 1 
  },
  feedbackOk: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  feedbackWarn: { backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' },
  coordsTitle: { fontWeight: 'bold', fontSize: 14 },
  coordsSub: { fontSize: 12, color: '#555', marginTop: 2 },

  saveButton: {
    backgroundColor: '#283618', padding: 16, borderRadius: 8,
    alignItems: 'center', marginTop: 20
  },
  saveButtonText: { color: '#FEFAE0', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { opacity: 0.7 }
});