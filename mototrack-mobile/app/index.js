import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import apiClient from '../src/api/client';

export default function LoginScreen() {
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      return Alert.alert('Atenção', 'Preencha e-mail e senha.');
    }

    setLoading(true);
    try {
      // Usando o nosso cliente Axios configurado!
      const resposta = await apiClient.post('/auth/login', { email, senha });
      
      // Guarda o token no Zustand e vai para a Garagem
      await loginAction(resposta.data.token);
      router.replace('/garagem');
      
    } catch (error) {
      const msgErro = error.response?.data?.error || 'Erro ao conectar com o servidor.';
      Alert.alert('Acesso Negado', msgErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.titulo}>MotoTrack</Text>
      
      <TextInput
        label="E-mail"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      
      <TextInput
        label="Senha"
        mode="outlined"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />
      
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.botao}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'ACELERAR'}
      </Button>

      {/* NOVO BOTÃO ADICIONADO DENTRO DA VIEW */}
      <Button 
        mode="text" 
        onPress={() => router.push('/cadastro')} 
        style={{ marginTop: 10 }}
        textColor="#a1a1aa"
      >
        Não tem conta? Cadastre-se
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#09090b', // Fundo escuro do tema
  },
  titulo: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#18181b', // Fundo dos inputs
  },
  botao: {
    marginTop: 10,
    paddingVertical: 5,
  }
});