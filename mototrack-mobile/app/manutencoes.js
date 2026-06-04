import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Appbar, TextInput, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../src/api/client';

export default function ManutencoesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams(); // Recebe o motoId e modelo da tela anterior

  const [descricao, setDescricao] = useState('');
  const [dataServico, setDataServico] = useState('');
  const [custo, setCusto] = useState('');

 // Busca as manutenções apenas da moto selecionada
  const { data: manutencoes, isLoading } = useQuery({
    queryKey: ['manutencoes', params.motoId],
    queryFn: async () => {
      try {
        const resposta = await apiClient.get(`/manutencoes/moto/${params.motoId}`);
        console.log("Resposta do Back-end:", resposta.data); // <-- Isso vai imprimir no seu terminal do VS Code!
        
        // Se a API devolver dentro de "manutencoes", ele pega. Se devolver a lista direto, ele pega também.
        return resposta.data.manutencoes || resposta.data || [];
      } catch (error) {
        console.log("Erro ao buscar manutenções:", error);
        return [];
      }
    },
  });

  // Salva uma nova manutenção atrelada à moto
  const mutation = useMutation({
    mutationFn: async (novaManutencao) => {
      const resposta = await apiClient.post('/manutencoes', novaManutencao);
      return resposta.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manutencoes', params.motoId] });
      setDescricao('');
      setDataServico('');
      setCusto('');
      Alert.alert('Sucesso', 'Serviço registado na ficha da moto!');
    },
    onError: (error) => {
      Alert.alert('Erro', 'Não foi possível registar o serviço.');
    }
  });

  const handleSalvar = () => {
    if (!descricao || !dataServico) {
      return Alert.alert('Atenção', 'Descrição e Data são obrigatórios.');
    }
    mutation.mutate({
      moto_id: params.motoId,
      descricao,
      data_servico: dataServico,
      custo: parseFloat(custo || 0)
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title={`Ficha: ${params.modelo}`} titleStyle={{ color: '#fff', fontSize: 18 }} />
      </Appbar.Header>

      <View style={styles.form}>
        <Text style={{ color: '#fff', marginBottom: 10, fontWeight: 'bold' }}>Novo Registo</Text>
        <TextInput
          label="Serviço (ex: Troca de pastilhas de freio, embreagem...)"
          mode="outlined"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            label="Data (DD/MM/AAAA)"
            mode="outlined"
            value={dataServico}
            onChangeText={setDataServico}
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            label="Custo (R$)"
            mode="outlined"
            keyboardType="numeric"
            value={custo}
            onChangeText={setCusto}
            style={[styles.input, { flex: 1 }]}
          />
        </View>
        <Button 
          mode="contained" 
          onPress={handleSalvar} 
          loading={mutation.isPending}
          disabled={mutation.isPending}
          style={{ marginTop: 10 }}
        >
          REGISTAR SERVIÇO
        </Button>
      </View>

      <View style={{ flex: 1, padding: 15 }}>
        <Text style={{ color: '#fff', marginBottom: 10, fontWeight: 'bold' }}>Histórico de Manutenções</Text>
        {isLoading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <FlatList
            data={manutencoes}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={{ color: '#a1a1aa' }}>Nenhum serviço registado.</Text>}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Title 
  title={item.descricao} 
  subtitle={`Data: ${item.data_servico.split('T')[0].split('-').reverse().join('/')} | Custo: R$ ${Number(item.custo).toFixed(2).replace('.', ',')}`}
  titleStyle={{ color: '#fff', fontSize: 16 }}
  subtitleStyle={{ color: '#a1a1aa' }}
/>
              </Card>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 15, backgroundColor: '#18181b', borderBottomWidth: 1, borderColor: '#27272a' },
  input: { marginBottom: 10, backgroundColor: '#09090b' },
  card: { backgroundColor: '#18181b', marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#f59e0b' },
});