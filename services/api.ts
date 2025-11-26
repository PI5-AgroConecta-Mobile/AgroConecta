import axios from 'axios';

// !! IMPORTANTE !!
// 'localhost' não funciona em apps mobile.
// Use o IP da sua máquina onde o back-end (porta 3333) está rodando.
// Exemplo: 'http://192.168.1.10:3333'
//
// Para achar seu IP no Windows: abra o cmd e digite `ipconfig` (procure por Endereço IPv4)

const baseURL = 'http://192.168.1.102:3333';

const api = axios.create({
  baseURL: baseURL,
});

export default api;