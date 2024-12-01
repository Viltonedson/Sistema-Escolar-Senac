import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.7:3000'; // Altere para o IP da sua máquina

export default function InformacoesAcademicasScreen() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [turmaData, setTurmaData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarDadosAluno();
  }, []);

  const carregarDadosAluno = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        setError('Dados do usuário não encontrados');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      setUserData(userData);

      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/turmas/aluno/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados da turma');
      }

      const turmaData = await response.json();
      setTurmaData(turmaData);
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao carregar dados acadêmicos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={carregarDadosAluno}>
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Informações Acadêmicas</Text>

          {/* Dados do Aluno */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Nome:</Text> {userData?.name || 'N/A'}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Email:</Text> {userData?.email || 'N/A'}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Matrícula:</Text> {userData?.id || 'N/A'}
            </Text>
          </View>

          {/* Dados da Turma */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Dados da Turma</Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Turma:</Text> {turmaData?.turma?.nome || 'N/A'}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Ano:</Text> {turmaData?.turma?.ano || 'N/A'}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Semestre:</Text> {turmaData?.turma?.semestres || 'N/A'}
            </Text>
            <Text style={styles.item}>
              <Text style={styles.label}>Turno:</Text> {turmaData?.turma?.turno || 'N/A'}
            </Text>
          </View>

          {/* Disciplinas da Turma */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Disciplinas</Text>
            {turmaData?.disciplinas && turmaData.disciplinas.length > 0 ? (
              turmaData.disciplinas.map((disciplina, index) => (
                <View key={index} style={styles.disciplinaItem}>
                  <Text style={styles.disciplinaNome}>{disciplina.nome}</Text>
                  <Text style={styles.disciplinaHorario}>
                    <Text style={styles.label}>Horário:</Text> {disciplina.horario || 'Horário não definido'}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Nenhuma disciplina encontrada</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    flex: 1,
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
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#4467B0',
  },
  disciplinaItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    marginBottom: 8,
  },
  disciplinaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  disciplinaHorario: {
    fontSize: 14,
    color: '#666',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#4467B0',
    fontWeight: 'bold',
  },
});
