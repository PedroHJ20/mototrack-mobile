import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Appbar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../src/api/client';

export default function CadastroScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const mutation = useMutation({
    mutationFn: async (novoUsuario) => {
      // Ajuste a rota '/auth/register' se o seu back-end usar outro nome para o cadastro
      const resposta = await apiClient.post('/auth/signup', novoUsuario);
      return resposta.data;
    },
    onSuccess: () => {
      Alert.alert('Sucesso', 'Conta criada! Faça login para acelerar.');
      router.replace('/'); // Volta para o Login
    },
    onError: (error) => {
      // Isso vai imprimir o erro verdadeiro e detalhado lá no terminal do VS Code!
      console.log("🚨 ERRO REAL DO BACKEND:", error.response?.data || error.message);
      
      // Tentamos pegar as variações mais comuns de mensagens de erro
      const msgErro = error.response?.data?.error || error.response?.data?.message || error.response?.data?.erro || 'Erro ao criar conta.';
      Alert.alert('Erro Detalhado', msgErro);
    }
  });

  const handleCadastrar = () => {
    if (!nome || !email || !senha) {
      return Alert.alert('Atenção', 'Preencha todos os campos.');
    }
    mutation.mutate({ nome, email, senha });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Criar Conta" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.form}>
        <TextInput label="Nome Completo" mode="outlined" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput label="E-mail" mode="outlined" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        <TextInput label="Senha" mode="outlined" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />

        <Button 
          mode="contained" 
          onPress={handleCadastrar} 
          style={styles.botao}
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          CADASTRAR
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