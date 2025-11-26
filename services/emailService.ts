import * as SecureStore from 'expo-secure-store';

// Serviço de verificação de email sem backend
// Usa armazenamento local para códigos de verificação

const VERIFICATION_PREFIX = 'verification_';
const VERIFIED_PREFIX = 'verified_';

// Função para gerar código de 6 dígitos
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Função para armazenar código localmente
export async function storeVerificationCode(email: string, code: string): Promise<void> {
  const data = {
    code,
    email,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutos
  };
  
  try {
    await SecureStore.setItemAsync(
      `${VERIFICATION_PREFIX}${email}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error('Erro ao armazenar código:', error);
  }
}

// Função para verificar código
export async function verifyCode(email: string, code: string): Promise<boolean> {
  try {
    const stored = await SecureStore.getItemAsync(`${VERIFICATION_PREFIX}${email}`);
    if (!stored) return false;

    const data = JSON.parse(stored);
    
    // Verificar expiração
    if (Date.now() > data.expiresAt) {
      await SecureStore.deleteItemAsync(`${VERIFICATION_PREFIX}${email}`);
      return false;
    }

    // Verificar código
    if (data.code === code) {
      // Marcar email como verificado
      await SecureStore.setItemAsync(`${VERIFIED_PREFIX}${email}`, 'true');
      await SecureStore.deleteItemAsync(`${VERIFICATION_PREFIX}${email}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return false;
  }
}

// Função para verificar se email já foi verificado
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const verified = await SecureStore.getItemAsync(`${VERIFIED_PREFIX}${email}`);
    return verified === 'true';
  } catch {
    return false;
  }
}

// Função para obter código armazenado (para exibição em desenvolvimento)
export async function getStoredCode(email: string): Promise<string | null> {
  try {
    const stored = await SecureStore.getItemAsync(`${VERIFICATION_PREFIX}${email}`);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return data.code;
  } catch {
    return null;
  }
}

// Função para limpar verificação (útil para testes)
export async function clearVerification(email: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(`${VERIFICATION_PREFIX}${email}`);
    await SecureStore.deleteItemAsync(`${VERIFIED_PREFIX}${email}`);
  } catch (error) {
    console.error('Erro ao limpar verificação:', error);
  }
}