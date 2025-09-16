import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  nome: string;
  ferias: 'actived' | 'desactived';
  data?: string | null; // Data de início das férias
}

export interface UseVacationManagerReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  hasChanges: boolean;
  toggleUserStatus: (userId: string) => void;
  updateUserDate: (userId: string, date: string) => void;
  saveChanges: () => Promise<void>;
  refreshData: () => Promise<void>;
}

// Função para converter data do formato brasileiro (DD/MM/YYYY) para ISO (YYYY-MM-DD)
const convertBrazilianToISO = (brazilianDate: string): string => {
  if (!brazilianDate) return '';
  const [day, month, year] = brazilianDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Função para converter data do formato ISO (YYYY-MM-DD) para brasileiro (DD/MM/YYYY)
const convertISOToBrazilian = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

export function useVacationManager(): UseVacationManagerReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URLs das webhooks (coloque as reais aqui)
  const READ_WEBHOOK_URL = 'https://dev.gruponfa.com/webhook/6e93a478-8188-4625-94e0-749032ca1280';
  const WRITE_WEBHOOK_URL = 'https://dev.gruponfa.com/webhook/7162435b-22ca-460f-aad7-2155e4f6994b';

  // Função para buscar dados da webhook de leitura
  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch(READ_WEBHOOK_URL, {
        method: 'POST', // ou 'GET', depende do que sua webhook espera
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados dos usuários');
      }

      const data = await response.json();

      // 🔹 Ajuste aqui se a estrutura da resposta for diferente
      // Exemplo: se a API retornar { users: [...] }
      return data as User[];
    } catch (err) {
      throw new Error('Erro ao carregar dados dos usuários');
    }
  };

  // Função para enviar alterações para webhook de escrita
  const sendChanges = async (usersOnVacation: User[]): Promise<void> => {
    try {
      const response = await fetch(WRITE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usersOnVacation),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar alterações');
      }
    } catch (err) {
      throw new Error('Erro ao salvar alterações');
    }
  };

  // Carrega dados iniciais
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await fetchUsers();
      
      // Processa os dados dos usuários: converte datas e define data atual para quem não tem
      const processedUserData = userData.map(user => {
        let processedUser = { ...user };
        
        // Converte data do formato brasileiro para ISO se existe
        if (user.data && user.data !== null) {
          processedUser.data = convertBrazilianToISO(user.data);
        }
        
        // Para usuários que já estão de férias mas não têm data, define a data atual
        if (user.ferias === 'actived' && (!processedUser.data || processedUser.data === null || processedUser.data === '')) {
          const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
          processedUser.data = today;
        }
        
        return processedUser;
      });
      
      setUsers(processedUserData);
      setOriginalUsers(processedUserData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Alterna status de férias de um usuário
  const toggleUserStatus = useCallback((userId: string) => {
    setUsers(currentUsers =>
      currentUsers.map(user => {
        if (user.id === userId) {
          const newStatus = user.ferias === 'actived' ? 'desactived' : 'actived';
          // Se está mudando para de férias (actived) e não tem data, define a data atual
          let newDate = user.data;
          if (newStatus === 'actived' && (!user.data || user.data === null)) {
            newDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
          }
          return { ...user, ferias: newStatus, data: newDate };
        }
        return user;
      })
    );
  }, []);

  // Atualiza a data de férias de um usuário
  const updateUserDate = useCallback((userId: string, date: string) => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === userId
          ? { ...user, data: date }
          : user
      )
    );
  }, []);

  // Salva alterações
  const saveChanges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Identifica usuários que foram alterados
      const changedUsers = users.filter((user, index) => {
        const original = originalUsers[index];
        return original && (
          user.ferias !== original.ferias || 
          user.data !== original.data
        );
      });

      // Converte as datas de volta para o formato brasileiro antes de enviar
      const usersToSend = changedUsers.map(user => ({
        ...user,
        data: user.data ? convertISOToBrazilian(user.data) : user.data
      }));
      
      // Envia TODOS os usuários alterados para a webhook, independente do status
      await sendChanges(usersToSend);

      setOriginalUsers([...users]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }, [users, originalUsers]);

  // Verifica se há mudanças pendentes
  const hasChanges = users.some((user, index) => {
    const original = originalUsers[index];
    return original && (
      user.ferias !== original.ferias || 
      user.data !== original.data
    );
  });

  // Carrega dados na inicialização
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    users,
    loading,
    error,
    hasChanges,
    toggleUserStatus,
    updateUserDate,
    saveChanges,
    refreshData,
  };
}