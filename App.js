import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import GameScreen from './screens/GameScreen';
import PreguntaResultadoScreen from './screens/PreguntaResultadoScreen';
import FinalResultadoScreen from './screens/FinalResultadoScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Inicio' }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Juego' }} />
        <Stack.Screen name="PreguntaResultado" component={PreguntaResultadoScreen} options={{ title: 'Resultado de la Pregunta' }} />
        <Stack.Screen name="FinalResultado" component={FinalResultadoScreen} options={{ title: 'Resultado Final' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
