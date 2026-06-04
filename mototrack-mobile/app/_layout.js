import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../src/store/useAuthStore';

// Instância do TanStack Query para gerenciar o cache das motos e manutenções
const queryClient = new QueryClient();

// Tema escuro padrão da disciplina/projeto
const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#2563eb', // Azul do botão Acelerar
    background: '#09090b', // Fundo Zinc-950
  },
};

export default function Layout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Verifica se o usuário tem token salvo ao abrir o app
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="garagem" />
          <Stack.Screen name="equipe" />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
}