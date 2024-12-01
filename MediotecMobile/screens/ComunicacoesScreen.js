import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Importe o LinearGradient

export default function ComunicacoesScreen() {
  return (
    <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.container}>
      <Text style={styles.title}>Comunicados</Text>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>Aula Remota</Text>
        <Text style={styles.cardContent}>Devido as fortes chuvas, as aulas do dia 07/11 serão remotas!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>Entrega de atividades</Text>
        <Text style={styles.cardContent}>Ultimos dias para entregar as atividades.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>Feriado</Text>
        <Text style={styles.cardContent}>Devido ao feriado do dia 20/11 não teremos aula. </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
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
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 16,
    color: '#000',
  },
});
