import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FinanceiroScreen() {
  const handleGenerateBoleto = () => {
    Linking.openURL(
      'https://pt.wikipedia.org/wiki/Boleto_banc%C3%A1rio#/media/Ficheiro:BoletoBancario.png'
    ).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Financeiro</Text>

        {/* Mensalidades */}
        <Text style={styles.item}>
          <Text style={styles.label}>Mensalidade:</Text> Fechadas
        </Text>
        <Text style={styles.item}>
          <Text style={styles.label}>Mensalidade:</Text> Abertas
        </Text>

        {/* Botão para gerar boleto */}
        <TouchableOpacity
          onPress={handleGenerateBoleto}
          style={styles.generateBoletoButton}
        >
          <Text style={styles.generateBoletoText}>Gerar boleto</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4467B0',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  generateBoletoButton: {
    marginTop: 20,
    backgroundColor: '#DF2F80',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  generateBoletoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
