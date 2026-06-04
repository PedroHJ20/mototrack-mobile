import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, ActivityIndicator, Appbar, FAB, IconButton, useTheme } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import apiClient from '../src/api/client';

export default function GaragemScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const logoutAction = useAuthStore((state) => state.logout);

  // Busca as motos (READ)
  const { data: motos, isLoading, isError } = useQuery({
    queryKey: ['motos'],
    queryFn: async () => {
      const resposta = await apiClient.get('/motocicletas');
      return resposta.data.motos || [];
    },
  });

  // Exclui a moto (DELETE)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/motocicletas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motos'] });
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível excluir a moto.');
    }
  });

  const handleLogout = async () => {
    await logoutAction();
    router.replace('/');
  };

  const confirmarExclusao = (id, modelo) => {
    Alert.alert('Excluir Moto', `Tem certeza que deseja excluir a ${modelo}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteMutation.mutate(id) }
    ]);
  };

  const irParaEdicao = (moto) => {
    // Passa os dados da moto para a tela de edição usando a rota
    router.push({ pathname: '/editar-moto', params: moto });
  };

  if (isLoading) {
    return (
      <View style={[styles.centralizado, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: '#fff', marginTop: 10 }}>Abrindo a garagem...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centralizado, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: '#f87171' }}>Erro ao carregar suas motos.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        {/* Adiciona um menu ou botões diretos. Para simplicidade, botões diretos: */}
        <Appbar.Action icon="information-outline" color="#a1a1aa" onPress={() => router.push('/sobre')} />
        <Appbar.Action icon="wrench" color="#10b981" onPress={() => router.push('/oficinas')} />
        <Appbar.Action icon="account-group" color="#2563eb" onPress={() => router.push('/equipe')} />
        <Appbar.Action icon="logout" color="#f87171" onPress={handleLogout} />
      </Appbar.Header>

      <FlatList
        data={motos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Sua garagem está vazia.</Text>}
        renderItem={({ item }) => (
          <Card 
  style={styles.card} 
  onPress={() => router.push({ pathname: '/manutencoes', params: { motoId: item.id, modelo: item.modelo } })}
>
            <Card.Title 
              title={item.modelo} 
              subtitle={`${item.marca} • ${item.ano || 'N/A'} • ${item.placa || 'Sem placa'}`} 
              titleStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}
              subtitleStyle={{ color: '#a1a1aa' }}
              right={(props) => (
                <View style={{ flexDirection: 'row' }}>
                  <IconButton {...props} icon="pencil" iconColor="#2563eb" onPress={() => irParaEdicao(item)} />
                  <IconButton {...props} icon="delete" iconColor="#f87171" onPress={() => confirmarExclusao(item.id, item.modelo)} />
                </View>
              )}
            />
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        onPress={() => router.push('/nova-moto')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lista: { padding: 15, paddingBottom: 100 },
  card: { backgroundColor: '#18181b', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#2563eb' },
  vazio: { color: '#a1a1aa', textAlign: 'center', marginTop: 50, fontSize: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, borderRadius: 50 },
});