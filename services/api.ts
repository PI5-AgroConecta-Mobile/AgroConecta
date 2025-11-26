import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Verifique se este IP é o do seu computador atual (ipconfig no cmd)
const baseURL = 'http://192.168.1.102:3333';

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@AgroConecta:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log("Erro ao recuperar token:", error);
  }
  return config;
});

export default api;