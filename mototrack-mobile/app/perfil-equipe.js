import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Appbar, Avatar, Card, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PerfilEquipeScreen() {
  const router = useRouter();
  const theme = useTheme();
  
  // Recebe os parâmetros enviados pela tela anterior
  const params = useLocalSearchParams();
  
  // Se por algum motivo os dados não chegarem, usamos um valor padrão
  const nome = params.nome || 'Membro da Equipe';
  const papel = params.papel || 'Desenvolvedor(a)';
  
  // Pegar as iniciais para o Avatar (ex: "Pedro Henrique" -> "PH")
  const iniciais = nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Perfil" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerPerfil}>
          <Avatar.Text size={100} label={iniciais} style={{ backgroundColor: theme.colors.primary }} />
          <Text variant="headlineMedium" style={styles.nome}>{nome}</Text>
          <Text variant="titleMedium" style={styles.cargo}>{papel}</Text>
        </View>

        <Card style={styles.cardInfo}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.tituloSecao}>Sobre</Text>
            <Text variant="bodyMedium" style={styles.texto}>
              Estudante do 4º período na UNICAP e membro integrante do projeto MotoTrack.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.cardInfo}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.tituloSecao}>Responsabilidades no Projeto</Text>
            <Text variant="bodyMedium" style={styles.texto}>
              • Desenvolvimento e integração de funcionalidades.{"\n"}
              • Colaboração na arquitetura do sistema.{"\n"}
              • Participação ativa nas entregas da disciplina AOS.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerPerfil: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  nome: { color: '#fff', fontWeight: 'bold', marginTop: 15 },
  cargo: { color: '#a1a1aa' },
  cardInfo: { backgroundColor: '#18181b', marginBottom: 15 },
  tituloSecao: { color: '#2563eb', fontWeight: 'bold', marginBottom: 10 },
  texto: { color: '#e4e4e7', lineHeight: 24 }
});