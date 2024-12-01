import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.7:3000'; // Altere para o IP da sua máquina

export default function ConceitosScreen() {
  const [conceitos, setConceitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const carregarConceitos = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));
      const token = await AsyncStorage.getItem('userToken');

      if (!userData || !token) {
        setError('Dados do usuário não encontrados');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/alunos/${userData.id}/conceitos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar conceitos');
      }

      const data = await response.json();
      setConceitos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar conceitos. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarConceitos();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    carregarConceitos();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.container}>
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Conceitos</Text>
        {conceitos.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.noDataText}>Nenhum conceito encontrado</Text>
          </View>
        ) : (
          conceitos.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.disciplina.nome}</Text>
              <Text style={styles.cardContent}>
                Conceito: <Text style={styles.conceito}>{item.conceito}</Text>
              </Text>
              <Text style={styles.cardContent}>
                Situação Acadêmica: {item.conceito !== 'Não avaliado' ? 'Avaliado' : 'Pendente'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4467B0',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  conceito: {
    fontWeight: 'bold',
    color: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});
