import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://sistema-escolar-senac.onrender.com';  // Using the public API URL

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, insira e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login/mobile`, {
        email: email,
        password: senha
      });

      const { user, token } = response.data;

      if (!user) {
        Alert.alert('Erro', 'Usuário não encontrado');
        return;
      }

      // Salvar dados do usuário no AsyncStorage com o _id correto
      const userData = {
        _id: user.id, // Convertendo id para _id
        name: user.name,
        email: user.email,
        token: token
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Navegar para o Dashboard passando os dados do usuário
      navigation.navigate('Dashboard', { userData });
    } catch (error) {
      let message = 'Erro ao fazer login. Tente novamente.';
      if (error.response) {
        message = error.response.data.msg || message;
      }
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#DF2F80', '#4467B0']} style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../img/mtlogo.png')}
                style={styles.logo}
              />
              <Icon name="user-circle" size={60} color="#FFF" style={styles.icon} />
            </View>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#FFF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#FFF"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  icon: {
    marginBottom: 40,
  },
  formContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 50,
  },
  input: {
    height: 40,
    borderColor: '#FFF',
    borderWidth: 1,
    color: '#FFF',
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 15,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#4467B0',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
