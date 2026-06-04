import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Appbar, FAB, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import apiClient from '../src/api/client';

export default function OficinasScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();

 // Busca as oficinas (GET)
  const { data: oficinas, isLoading, isError } = useQuery({
    queryKey: ['oficinas'],
    queryFn: async () => {
      try {
        const resposta = await apiClient.get('/oficinas');
        return resposta.data.oficinas || resposta.data || [];
      } catch (error) {
        // A fofoca acontece aqui! Vai imprimir no terminal o erro real:
        console.log("🚨 ERRO GET OFICINAS:", error.response?.data || error.message);
        throw error; 
      }
    },
  });

  // Exclui a oficina (DELETE)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/oficinas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oficinas'] });
    },
    onError: () => Alert.alert('Erro', 'Não foi possível excluir a oficina.')
  });

  const confirmarExclusao = (id, nome) => {
    Alert.alert('Excluir', `Deseja excluir a oficina ${nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteMutation.mutate(id) }
    ]);
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1, backgroundColor: '#09090b' }} color="#2563eb" size="large" />;
  if (isError) return <Text style={{ color: '#f87171', padding: 20 }}>Erro ao carregar oficinas.</Text>;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Oficinas Parceiras" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <FlatList
        data={oficinas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma oficina cadastrada.</Text>}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title 
              title={item.nome} 
              subtitle={`${item.endereco || 'Sem endereço'} • Tel: ${item.telefone || 'N/A'}`} 
              titleStyle={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}
              subtitleStyle={{ color: '#a1a1aa' }}
              right={(props) => (
                <View style={{ flexDirection: 'row' }}>
                  <IconButton {...props} icon="pencil" iconColor="#2563eb" onPress={() => router.push({ pathname: '/editar-oficina', params: item })} />
                  <IconButton {...props} icon="delete" iconColor="#f87171" onPress={() => confirmarExclusao(item.id, item.nome)} />
                </View>
              )}
            />
          </Card>
        )}
      />

      <FAB icon="plus" style={[styles.fab, { backgroundColor: theme.colors.primary }]} color="#fff" onPress={() => router.push('/nova-oficina')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lista: { padding: 15, paddingBottom: 100 },
  card: { backgroundColor: '#18181b', marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#10b981' }, // Cor verde para oficinas
  vazio: { color: '#a1a1aa', textAlign: 'center', marginTop: 50 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, borderRadius: 50 },
});