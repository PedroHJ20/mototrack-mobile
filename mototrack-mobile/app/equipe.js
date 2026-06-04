import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Appbar, Avatar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function EquipeScreen() {
  const router = useRouter();
  const theme = useTheme();

  // Lista dos integrantes do projeto AOS 2026.1
  const membros = [
    { id: '1', nome: 'Pedro Henrique', papel: 'Full-Stack Developer' },
    { id: '2', nome: 'Miguel', papel: 'Desenvolvedor' },
    { id: '3', nome: 'Echilin', papel: 'Desenvolvedora' },
    { id: '4', nome: 'Maysa', papel: 'Desenvolvedora' },
    { id: '5', nome: 'Ludmylla', papel: 'Desenvolvedora' },
    { id: '6', nome: 'Matheus', papel: 'Desenvolvedor' },
    { id: '7', nome: 'Ygor', papel: 'Desenvolvedor' },
    { id: '8', nome: 'Gabriel', papel: 'Desenvolvedor' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: '#18181b' }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Nossa Equipe" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.headerContainer}>
        <Text variant="headlineMedium" style={styles.titulo}>Projeto MotoTrack</Text>
        <Text variant="bodyLarge" style={styles.subtitulo}>AOS - 2026.1 | Catholic University (UNICAP)</Text>
      </View>

      <FlatList
        data={membros}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Card 
            style={styles.card}
            // Agora enviamos os dados do item clicado através da rota!
            onPress={() => router.push({
              pathname: '/perfil-equipe',
              params: { nome: item.nome, papel: item.papel }
            })}
          >
            <Card.Title
              title={item.nome}
              subtitle={item.papel}
              titleStyle={{ color: '#fff', fontWeight: 'bold' }}
              subtitleStyle={{ color: '#a1a1aa' }}
              left={(props) => (
                <Avatar.Text 
                  {...props} 
                  label={item.nome.substring(0, 2).toUpperCase()} 
                  style={{ backgroundColor: theme.colors.primary }} 
                />
              )}
            />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#27272a' },
  titulo: { color: '#fff', fontWeight: 'bold' },
  subtitulo: { color: '#a1a1aa', marginTop: 5, textAlign: 'center' },
  lista: { padding: 15, paddingBottom: 50 },
  card: { backgroundColor: '#18181b', marginBottom: 10 },
});