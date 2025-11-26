import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  imgUrl?: string | null;
  userType: number;
  farmName?: string | null;
}

type UserSearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
};

export default function UserSearchModal({ visible, onClose, onSelectUser }: UserSearchModalProps) {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os usuários disponíveis usando o endpoint /users
  const loadAllUsers = useCallback(async (): Promise<User[]> => {
    try {
      const listResponse = await api.get('/users');
      if (Array.isArray(listResponse.data)) {
        // Filtrar usuário atual e remover duplicatas por ID
        const usersMap = new Map<string, User>();
        listResponse.data.forEach((u: User) => {
          if (u && u.id && u.id !== currentUser?.id) {
            // Usar Map para garantir IDs únicos (último item com mesmo ID prevalece)
            usersMap.set(u.id, u);
          }
        });
        const users = Array.from(usersMap.values());
        console.log(`Successfully loaded ${users.length} unique users from /users endpoint`);
        return users;
      }
      return [];
    } catch (listErr: any) {
      console.error('Error loading users from /users endpoint:', listErr);
      // Fallback: tentar buscar via produtos (caso o endpoint não esteja disponível)
      try {
        const productsResponse = await api.get('/listProduct');
        if (Array.isArray(productsResponse.data) && productsResponse.data.length > 0) {
          const ownerIds = [...new Set(productsResponse.data.map((p: any) => p.ownerId).filter(Boolean))];
          const limitedOwnerIds = ownerIds.slice(0, 30);
          const userPromises = limitedOwnerIds.map(async (ownerId: string) => {
            try {
              const userResponse = await api.get(`/getUser/${ownerId}`);
              return userResponse.data;
            } catch {
              return null;
            }
          });
          const fetchedUsers = await Promise.all(userPromises);
          // Remover duplicatas e usuário atual
          const usersMap = new Map<string, User>();
          fetchedUsers.forEach((u) => {
            if (u && u.id && u.id !== currentUser?.id) {
              usersMap.set(u.id, u);
            }
          });
          const users = Array.from(usersMap.values());
          console.log(`Fallback: loaded ${users.length} unique users from products`);
          return users;
        }
      } catch (productsErr) {
        console.error('Error in fallback method:', productsErr);
      }
      return [];
    }
  }, [currentUser]);

  const searchUsers = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Se não há query, carregar todos os usuários usando /users
      if (!query.trim()) {
        const allUsers = await loadAllUsers();
        setUsers(allUsers);
        if (allUsers.length === 0) {
          setError('Nenhum usuário encontrado.');
        }
        return;
      }

      // Se há query, usar endpoint de busca /users/search
      try {
        const searchResponse = await api.get('/users/search', {
          params: { q: query.trim() }
        });
        
        if (Array.isArray(searchResponse.data)) {
          // Remover duplicatas e usuário atual usando Map
          const usersMap = new Map<string, User>();
          searchResponse.data.forEach((u: User) => {
            if (u && u.id && u.id !== currentUser?.id) {
              usersMap.set(u.id, u);
            }
          });
          const filtered = Array.from(usersMap.values());
          setUsers(filtered);
          
          if (filtered.length === 0) {
            setError(`Nenhum usuário encontrado com "${query}". Tente outro termo.`);
          } else {
            setError(null);
          }
        } else {
          setUsers([]);
          setError('Formato de resposta inválido.');
        }
      } catch (searchErr: any) {
        // Fallback: se o endpoint de busca falhar, carregar todos e filtrar localmente
        console.log('Search endpoint failed, using local filter:', searchErr);
        const allUsers = await loadAllUsers();
        
        const filtered = allUsers
          .filter((u: User) => 
            u && 
            u.id !== currentUser?.id &&
            (u.name?.toLowerCase().includes(query.toLowerCase()) ||
             u.email?.toLowerCase().includes(query.toLowerCase()) ||
             (u.farmName && u.farmName.toLowerCase().includes(query.toLowerCase())))
          );
        
        setUsers(filtered);
        
        if (filtered.length === 0) {
          setError(`Nenhum usuário encontrado com "${query}". Tente outro termo.`);
        } else {
          setError(null);
        }
      }
    } catch (err: any) {
      console.error('Error searching users:', err);
      setError('Erro ao buscar usuários. Tente novamente.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, loadAllUsers]);

  useEffect(() => {
    if (visible) {
      if (searchQuery.trim()) {
        // Se há query, fazer busca com debounce
        const timeoutId = setTimeout(() => {
          searchUsers(searchQuery);
        }, 500); // Debounce de 500ms

        return () => clearTimeout(timeoutId);
      } else {
        // Se não há query, carregar todos os usuários
        searchUsers('');
      }
    } else {
      // Limpar quando fechar o modal
      setUsers([]);
      setSearchQuery('');
      setError(null);
    }
  }, [searchQuery, visible, searchUsers]);

  const handleSelectUser = (user: User) => {
    onSelectUser(user);
    setSearchQuery('');
    setUsers([]);
    onClose();
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleSelectUser(item)}
      activeOpacity={0.7}
    >
      {item.imgUrl ? (
        <Image source={{ uri: item.imgUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.farmName || item.name}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {item.email}
        </Text>
        {item.userType === 1 && (
          <Text style={styles.userType}>Agricultor</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#606C38" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Nova Conversa</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#283618" />
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#606C38" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome, email ou fazenda..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setUsers([]);
                }}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#283618" />
              <Text style={styles.loadingText}>Buscando usuários...</Text>
            </View>
          )}

          {error && (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && searchQuery.length === 0 && users.length === 0 && (
            <View style={styles.centerContainer}>
              <Ionicons name="search" size={64} color="#A9B388" />
              <Text style={styles.emptyText}>Carregando usuários...</Text>
              <Text style={styles.emptySubtext}>
                Digite para buscar ou aguarde a lista carregar
              </Text>
            </View>
          )}

          {!loading && !error && searchQuery.length > 0 && users.length === 0 && (
            <View style={styles.centerContainer}>
              <Ionicons name="people-outline" size={64} color="#A9B388" />
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
              <Text style={styles.emptySubtext}>
                Tente buscar com outros termos ou deixe o campo vazio para ver todos
              </Text>
            </View>
          )}

          {users.length > 0 && (
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item: User) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#283618',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#283618',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#283618',
    fontSize: 16,
  },
  errorText: {
    color: '#b4232c',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#283618',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#606C38',
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#606C38',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FEFAE0',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283618',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#606C38',
    marginBottom: 2,
  },
  userType: {
    fontSize: 12,
    color: '#A9B388',
  },
});