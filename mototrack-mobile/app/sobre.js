import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Appbar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function SobreScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Sobre o App" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.titulo}>MotoTrack</Text>
        <Text variant="bodyLarge" style={styles.texto}>
          Versão 1.0.0
        </Text>
        <Text variant="bodyMedium" style={styles.textoSecundario}>
          O MotoTrack foi desenvolvido como projeto final para a disciplina de Arquitetura Orientada a Serviços (AOS) no período de 2026.1. O objetivo principal é demonstrar o consumo de APIs REST, roteamento avançado e gerenciamento de estado global.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, alignItems: 'center', marginTop: 50 },
  titulo: { color: '#fff', fontWeight: 'bold', marginBottom: 10 },
  texto: { color: '#fff', marginBottom: 20 },
  textoSecundario: { color: '#a1a1aa', textAlign: 'center', lineHeight: 24 }
});