import * as SecureStore from 'expo-secure-store';
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  userType: number; // 0 = Cliente, 1 = Agricultor
  contact?: string | null;
  contactType?: number | null; 
  imgUrl?: string | null;
  createDate?: string | null; 
  
  // Novos campos do mapa
  farmName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface AuthContextData {
  signIn: (email: string, password: string) => Promise<User>; 
  signOut: () => void;
  updateAuthState: (userData: Partial<User>) => Promise<void>; 
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
  return useContext(AuthContext);
}

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDataFromStorage() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setToken(storedToken);
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error('Falha ao carregar dados de autenticação', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadDataFromStorage();
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => { 
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      return user; 

    } catch (e: any) {
      console.error('Erro no signIn:', e);
      throw new Error(e.response?.data?.err || 'Erro ao fazer login');
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

    } catch (e) {
      console.error('Erro no signOut:', e);
    }
  };

  const updateAuthState = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        updateAuthState, 
        user,
        token,
        isLoading,
        setUser
      }}>
      {children}
    </AuthContext.Provider>
  );
}