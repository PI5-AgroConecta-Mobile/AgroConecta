# AgroConecta - App Mobile

Aplicação móvel desenvolvida com React Native e Expo.

## 🚀 Pré-requisitos

* [Node.js](https://nodejs.org/) instalado.
* App **Expo Go** no celular.
* Backend rodando localmente.

## 📦 Instalação

1.  Acesse a pasta do projeto no terminal.
2.  Instale as dependências:
    ```bash
    npm install
    ```

## ⚠️ CONFIGURAÇÃO CRÍTICA: Endereço IP

Como o backend roda no seu computador e o app no seu celular, é necessário configurar o IP da sua máquina em **vários arquivos** do projeto.

### 1. Descubra seu IP Local
No terminal do computador, digite:
* **Windows:** `ipconfig` (procure por Endereço IPv4, ex: `192.168.1.15`)
* **Mac/Linux:** `ifconfig`

### 2. Atualize os Arquivos
Você deve substituir o IP antigo (provavelmente `192.168.1.102`) pelo **seu IP atual** nos seguintes arquivos:

1.  **Principal (API):**
    * `services/api.ts`

2.  **Área do Agricultor:**
    * `app/(farmer)/editar-perfil.tsx`
    * `app/(farmer)/(tabs)/perfil-fazenda.tsx`

3.  **Área do Cliente/Comum:**
    * `app/(app)/(tabs)/editarPerfil.tsx`

## ▶️ Rodando o App

1.  Certifique-se que o backend está rodando.
2.  Inicie o Expo:
    ```bash
    npx expo start
    ```
3.  Escaneie o QR Code com o aplicativo **Expo Go** no seu celular.

### 🛠️ Solução de Problemas

* **Erro "Network Error" ou App não conecta:**
    * Confira se mudou o IP em **todos** os arquivos listados acima.
    * Confira se o celular e o PC estão no **mesmo Wi-Fi**.
    * Desative temporariamente o Firewall do Windows se necessário.
