import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Appbar, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../src/api/client';

export default function EditarMotoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  
  // Recebe os dados da moto que vieram da garagem
  const params = useLocalSearchParams();

  const [marca, setMarca] = useState(params.marca || '');
  const [modelo, setModelo] = useState(params.modelo || '');
  const [ano, setAno] = useState(params.ano || '');
  const [placa, setPlaca] = useState(params.placa || '');

  // Mutation para ATUALIZAR (PUT)
  const mutation = useMutation({
    mutationFn: async (motoAtualizada) => {
      const resposta = await apiClient.put(`/motocicletas/${params.id}`, motoAtualizada);
      return resposta.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motos'] });
      Alert.alert('Sucesso', 'Moto atualizada!');
      router.back();
    },
    onError: (error) => {
      const msgErro = error.response?.data?.erro || 'Erro ao atualizar a moto.';
      Alert.alert('Erro', msgErro);
    }
  });

  const handleAtualizar = () => {
    if (!marca || !modelo) return Alert.alert('Atenção', 'Marca e modelo são obrigatórios.');
    mutation.mutate({ marca, modelo, ano, placa });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Editar Moto" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.form}>
        <TextInput label="Marca" mode="outlined" value={marca} onChangeText={setMarca} style={styles.input} />
        <TextInput label="Modelo" mode="outlined" value={modelo} onChangeText={setModelo} style={styles.input} />
        <TextInput label="Ano" mode="outlined" keyboardType="numeric" value={ano} onChangeText={setAno} style={styles.input} />
        <TextInput label="Placa" mode="outlined" autoCapitalize="characters" value={placa} onChangeText={setPlaca} style={styles.input} />

        <Button 
          mode="contained" 
          onPress={handleAtualizar} 
          style={styles.botao}
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          SALVAR ALTERAÇÕES
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  input: { marginBottom: 15, backgroundColor: '#18181b' },
  botao: { marginTop: 10, paddingVertical: 5 }
});