// FinalResultadoScreen.js
import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const FinalResultadoScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { puntuacion } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resultado Final</Text>
            <Text style={styles.puntuacion}>Tu puntuación total es: {puntuacion} puntos</Text>

            <Button title="Volver a jugar" onPress={() => navigation.navigate('Game', { reset: true })} />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  puntuacion: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default FinalResultadoScreen;
