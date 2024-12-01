import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { name } = JSON.parse(userData);
          setUserName(name);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    carregarDadosUsuario();
  }, []);

  return (
    <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.container}>
      
      <Image
        source={require('../img/mtlogo.png')}
        style={styles.logo}
      />

      <View style={styles.iconContainer}>
        <Icon name="user-circle" size={70} color="#FFF" />
      </View>
      <Text style={styles.title}>Olá, {userName}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Informações Acadêmicas')}
      >
        <Text style={styles.buttonText}>Informações Acadêmicas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Conceitos')}
      >
        <Text style={styles.buttonText}>Conceitos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Comunicações')}
      >
        <Text style={styles.buttonText}>Comunicados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Visões Estáticas')}
      >
        <Text style={styles.buttonText}>Financeiro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Contato')}
      >
        <Text style={styles.buttonText}>Contato</Text>
      </TouchableOpacity>

      {/* Ícone e texto "Sair" */}
      <TouchableOpacity
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }}
        style={styles.logoutContainer}
      >
        <Icon name="sign-out" size={20} color="#FFF" />
        <Text style={styles.logoutText}> Sair</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#4467B0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
