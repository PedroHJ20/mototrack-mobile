import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Appbar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../src/api/client';

export default function NovaOficinaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');

  const mutation = useMutation({
    mutationFn: async (novaOficina) => {
      const resposta = await apiClient.post('/oficinas', novaOficina);
      return resposta.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oficinas'] });
      router.back();
    },
    onError: () => Alert.alert('Erro', 'Não foi possível salvar a oficina.')
  });

  const handleSalvar = () => {
    if (!nome) return Alert.alert('Atenção', 'O nome da oficina é obrigatório.');
    mutation.mutate({ nome, endereco, telefone });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Nova Oficina" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.form}>
        <TextInput label="Nome da Oficina" mode="outlined" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput label="Endereço" mode="outlined" value={endereco} onChangeText={setEndereco} style={styles.input} />
        <TextInput label="Telefone" mode="outlined" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" style={styles.input} />

        <Button mode="contained" onPress={handleSalvar} style={styles.botao} loading={mutation.isPending} disabled={mutation.isPending}>
          CADASTRAR OFICINA
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