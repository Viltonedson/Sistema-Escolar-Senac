import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import InformacoesAcademicasScreen from './screens/InformacoesAcademicasScreen';
import ConceitosScreen from './screens/ConceitosScreen';
import ComunicacoesScreen from './screens/ComunicacoesScreen';
import VisoesEstaticasScreen from './screens/VisoesEstaticasScreen';
import ContatoScreen from './screens/ContatoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Informações Acadêmicas" component={InformacoesAcademicasScreen} />
        <Stack.Screen name="Conceitos" component={ConceitosScreen} />
        <Stack.Screen name="Comunicações" component={ComunicacoesScreen} />
        <Stack.Screen name="Visões Estáticas" component={VisoesEstaticasScreen} />
        <Stack.Screen name="Contato" component={ContatoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
