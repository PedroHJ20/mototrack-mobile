import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Appbar, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../src/api/client';

export default function EditarOficinaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const queryClient = useQueryClient();
  
  // Recebe os dados enviados pela tela de listagem
  const params = useLocalSearchParams();

  // Inicializa os estados já com os dados atuais da oficina
  const [nome, setNome] = useState(params.nome || '');
  const [cnpj, setCnpj] = useState(params.cnpj || '');
  const [endereco, setEndereco] = useState(params.endereco || '');
  const [especialidade, setEspecialidade] = useState(params.especialidade || '');

  // Mutação para atualizar (PUT)
  const updateMutation = useMutation({
    mutationFn: async (dadosAtualizados) => {
      await apiClient.put(`/oficinas/${params.id}`, dadosAtualizados);
    },
    onSuccess: () => {
      // Força a tela de listagem a buscar os dados novos no banco
      queryClient.invalidateQueries({ queryKey: ['oficinas'] });
      Alert.alert('Sucesso', 'Oficina atualizada com sucesso!');
      router.back();
    },
    onError: (error) => {
      console.error("Erro ao atualizar:", error);
      Alert.alert('Erro', 'Não foi possível atualizar a oficina.');
    }
  });

  const handleSalvar = () => {
    if (!nome || !endereco) {
      Alert.alert('Aviso', 'Os campos Nome e Endereço são obrigatórios.');
      return;
    }
    
    // Envia os dados para o Back-end
    updateMutation.mutate({ nome, cnpj, endereco, especialidade });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Editar Oficina" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          label="Nome da Oficina *"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          mode="outlined"
          textColor="#fff"
          theme={{ colors: { onSurfaceVariant: '#a1a1aa' } }}
        />
        <TextInput
          label="CNPJ"
          value={cnpj}
          onChangeText={setCnpj}
          style={styles.input}
          mode="outlined"
          textColor="#fff"
          theme={{ colors: { onSurfaceVariant: '#a1a1aa' } }}
        />
        <TextInput
          label="Endereço *"
          value={endereco}
          onChangeText={setEndereco}
          style={styles.input}
          mode="outlined"
          textColor="#fff"
          theme={{ colors: { onSurfaceVariant: '#a1a1aa' } }}
        />
        <TextInput
          label="Especialidade"
          value={especialidade}
          onChangeText={setEspecialidade}
          style={styles.input}
          mode="outlined"
          textColor="#fff"
          theme={{ colors: { onSurfaceVariant: '#a1a1aa' } }}
        />

        <Button 
          mode="contained" 
          onPress={handleSalvar} 
          style={styles.botao}
          loading={updateMutation.isPending}
          disabled={updateMutation.isPending}
        >
          Salvar Alterações
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  input: { backgroundColor: '#27272a', marginBottom: 15 },
  botao: { marginTop: 10, paddingVertical: 8, backgroundColor: '#2563eb' }
});