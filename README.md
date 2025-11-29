# AgroConecta - App Mobile

Aplicação móvel do AgroConecta, desenvolvida para conectar agricultores e consumidores, facilitando a gestão de produtos, agendamentos e comunicação.

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias e bibliotecas principais:

* **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Roteamento:** [Expo Router](https://docs.expo.dev/router/introduction/) (navegação baseada em arquivos)
* **Comunicação API:** [Axios](https://axios-http.com/)
* **Comunicação Real-time:** [Socket.io Client](https://socket.io/) (para o chat)
* **Armazenamento Local:** AsyncStorage
* **Recursos do Dispositivo:**
    * `expo-location` (Geolocalização e mapas)
    * `expo-image-picker` (Acesso à câmera e galeria)
* **Componentes Visuais:**
    * `react-native-chart-kit` (Gráficos)
    * `react-native-calendars` (Calendários)
    * `@gorhom/bottom-sheet` (Modais deslizantes)

## 🚀 Pré-requisitos

* [Node.js](https://nodejs.org/) instalado.
* App **Expo Go** instalado no seu celular (Android ou iOS).
* Backend do projeto rodando localmente.

## 📦 Instalação

1.  Acesse a pasta do projeto no terminal.
2.  Instale as dependências:
    ```bash
    npm install
    ```

## ⚠️ CONFIGURAÇÃO CRÍTICA: Endereço IP

Como o backend roda no seu computador e o app no seu celular, é necessário configurar o IP da sua máquina manualmente em **vários arquivos** do projeto para que eles se comuniquem.

### 1. Descubra seu IP Local
No terminal do computador, digite:
* **Windows:** `ipconfig` (procure por Endereço IPv4, ex: `192.168.1.15`)
* **Mac/Linux:** `ifconfig` ou `ip addr`

### 2. Atualize os Arquivos
Você deve substituir o IP antigo (provavelmente `192.168.1.102`) pelo **seu IP atual** nos seguintes arquivos:

1.  **Principal (API):**
    * `services/api.ts`

2.  **Área do Agricultor:**
    * `app/(farmer)/editar-perfil.tsx`
    * `app/(farmer)/(tabs)/perfil-fazenda.tsx`

3.  **Área do Cliente/Comum:**
    * `app/(app)/(tabs)/editarPerfil.tsx`

> **Dica:** Use o recurso de "Localizar e Substituir" do seu editor (Ctrl+Shift+F) para trocar `192.168.1.102` pelo seu IP novo em todo o projeto de uma vez.

## ▶️ Rodando o App

1.  Certifique-se que o backend está rodando (`npm run dev` na pasta da API).
2.  Inicie o Expo na pasta do mobile:
    ```bash
    npx expo start
    ```
3.  Um QR Code aparecerá no terminal. Escaneie-o com o aplicativo **Expo Go** no seu celular.

### 🛠️ Solução de Problemas

* **Erro "Network Error" ou App não conecta:**
    * Confira se mudou o IP em **todos** os arquivos listados acima.
    * Confira se o celular e o PC estão conectados na **mesma rede Wi-Fi**.
    * Desative temporariamente o Firewall do Windows/Antivírus se necessário, pois eles podem bloquear a conexão na porta do servidor.
