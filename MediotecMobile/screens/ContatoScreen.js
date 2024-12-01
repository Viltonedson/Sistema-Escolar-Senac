import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ContatoScreen() {
  const handlePhonePress = () => {
    Linking.openURL('tel:8134136666');
  };

  const handleEmailPress = () => {
    Alert.alert(
      'Abrir E-mail',
      'Deseja abrir o cliente de e-mail para enviar uma mensagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir', onPress: () => Linking.openURL('mailto:cas@pe.senac.br') },
      ]
    );
  };

  const handleAddressPress = () => {
    Linking.openURL('https://www.google.com/maps?q=Av.+Visconde+de+Suassuna,+500,+Santo+Amaro');
  };

  return (
    <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Contato</Text>

        {/* Card com todas as informações */}
        <View style={styles.card}>
          <View style={styles.item}>
            <Text style={styles.label}>CAS - Central de Atendimento Senac</Text>
            <TouchableOpacity onPress={handlePhonePress}>
              <Text style={styles.link}>(81) 3413-6666</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>E-mail:</Text>
            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={styles.link}>cas@pe.senac.br</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Endereço:</Text>
            <TouchableOpacity onPress={handleAddressPress}>
              <Text style={styles.link}>Av. Visconde de Suassuna, 500, Santo Amaro</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    width: '100%',
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'flex-start',
  },
  item: {
    marginBottom: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4467B0',
    marginBottom: 5,
  },
  link: {
    fontSize: 20,
    color: '#DF2F80',
    textDecorationLine: 'underline',
  },
});
