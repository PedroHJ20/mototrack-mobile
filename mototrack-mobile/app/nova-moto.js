import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Appbar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../src/api/client';

export default function NovaMotoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [placa, setPlaca] = useState('');

  // TanStack Query: Mutation para criar a moto e atualizar a garagem
  const mutation = useMutation({
    mutationFn: async (novaMoto) => {
      const resposta = await apiClient.post('/motocicletas', novaMoto);
      return resposta.data;
    },
    onSuccess: () => {
      // Invalida o cache antigo, forçando a garagem a buscar os dados novos
      queryClient.invalidateQueries({ queryKey: ['motos'] });
      Alert.alert('Sucesso', 'Moto adicionada à sua garagem!');
      router.back(); // Volta para a tela anterior
    },
    onError: (error) => {
      const msgErro = error.response?.data?.erro || 'Erro ao salvar a moto.';
      Alert.alert('Erro', msgErro);
    }
  });

  const handleSalvar = () => {
    if (!marca || !modelo) {
      return Alert.alert('Atenção', 'Marca e modelo são obrigatórios.');
    }
    mutation.mutate({ marca, modelo, ano, placa });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Nova Moto" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.form}>
        <TextInput
          label="Marca (ex: Honda, Yamaha)"
          mode="outlined"
          value={marca}
          onChangeText={setMarca}
          style={styles.input}
        />
        
        <TextInput
          label="Modelo (ex: CG 160, MT-07)"
          mode="outlined"
          value={modelo}
          onChangeText={setModelo}
          style={styles.input}
        />

        <TextInput
          label="Ano"
          mode="outlined"
          keyboardType="numeric"
          value={ano}
          onChangeText={setAno}
          style={styles.input}
        />

        <TextInput
          label="Placa (Opcional)"
          mode="outlined"
          autoCapitalize="characters"
          value={placa}
          onChangeText={setPlaca}
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleSalvar} 
          style={styles.botao}
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          SALVAR MOTO
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  input: {
    marginBottom: 15,
    backgroundColor: '#18181b',
  },
  botao: {
    marginTop: 10,
    paddingVertical: 5,
  }
});