import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PreguntaResultado = () => {
    const navigation = useNavigation();
    const route = useRoute();
  const { distancia, puntos, puntuacion, preguntaIndex, hayMasPreguntas } = route.params;

  // Mostrar la distancia calculada y la puntuación
  const mensajeDistancia = `Distancia: ${distancia.toFixed(2)} km`;
  const mensajePuntuacion = `Puntuación: ${puntos.toFixed(0)}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado de la pregunta</Text>
      <Text>{mensajeDistancia}</Text>
      <Text>{mensajePuntuacion}</Text>
      <Text>Total Puntuación: {puntuacion.toFixed(0)}</Text>

      <Button
        title={hayMasPreguntas ? "Continuar a la siguiente pregunta" : "Ver resultados finales"}
        onPress={() => {
          if (hayMasPreguntas) {
            navigation.navigate('Game', { preguntaIndex: preguntaIndex + 1 }); // Continuar a la siguiente pregunta
          } else {
            navigation.navigate('FinalResultado', { puntuacion }); // Mostrar resultados finales
          }
        }}
      />
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
});

export default PreguntaResultado;
