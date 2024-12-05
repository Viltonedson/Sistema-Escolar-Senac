import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ConceitosScreen() {
  const [conceitos, setConceitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConceitos();
  }, []);

  const fetchConceitos = async () => {
    try {
      // Buscar dados do usuário do AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        setError('Usuário não encontrado. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const alunoId = parsedUserData._id || parsedUserData.id;

      if (!alunoId) {
        setError('ID do aluno não encontrado. Por favor, faça login novamente.');
        setLoading(false);
        return;
      }

      // Buscar conceitos do aluno
      const response = await axios.get(`https://sistema-escolar-senac.onrender.com/alunos/${alunoId}/conceitos`);
      setConceitos(response.data);
    } catch (err) {
      console.error('Erro ao buscar conceitos:', err);
      setError('Erro ao carregar conceitos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (conceito) => {
    switch (conceito) {
      case 'Desenvolvido':
        return '#4CAF50';
      case 'Em Desenvolvimento':
        return '#FFC107';
      case 'Não Desenvolvido':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#DF2F80', '#4467B0']} style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#DF2F80', '#4467B0']} style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Meus Conceitos</Text>
        
        {conceitos.length > 0 ? (
          conceitos.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.disciplina?.nome || 'Disciplina não encontrada'}
              </Text>
              <View style={styles.conceptContainer}>
                <Text style={[
                  styles.cardContent,
                  { color: getStatusColor(item.conceito) }
                ]}>
                  {item.conceito}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardContent}>
              Nenhum conceito registrado ainda
            </Text>
          </View>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  conceptContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
