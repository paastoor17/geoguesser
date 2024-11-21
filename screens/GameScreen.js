import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Asegúrate de importar tu configuración de Firebase
import MapView, { Marker } from 'react-native-maps';

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [ubicaciones, setUbicaciones] = useState([]);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [preguntaIndex, setPreguntaIndex] = useState(0); // Obtener preguntaIndex desde la navegación
  const [loading, setLoading] = useState(true);
  const [puntuacion, setPuntuacion] = useState(0);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState(null);
  const [coordenadasCorrectas, setCoordenadasCorrectas] = useState(null);

  useEffect(() => {
    if (route.params?.reset) {
      // Reiniciar el juego
      setPreguntaIndex(0);
      setPuntuacion(0);
      setCoordenadasSeleccionadas(null);
      setCoordenadasCorrectas(null);
    }
  }, [route.params?.reset]);

  // Reiniciar las coordenadas seleccionadas cuando cambie la pregunta
  useEffect(() => {
    if (route.params?.preguntaIndex !== undefined) {
        setPreguntaIndex(route.params.preguntaIndex);
        setCoordenadasSeleccionadas(null);
    }
  }, [route.params?.preguntaIndex]);

  // Cargar preguntas desde Firestore y desordenarlas
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Ubicaciones'));
        const preguntasData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            titulo: data.nombre,
            lat: data.coordenadas.latitude,
            lon: data.coordenadas.longitude,
          };
        });

        // Desordenar las preguntas aleatoriamente (Fisher-Yates)
        for (let i = preguntasData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [preguntasData[i], preguntasData[j]] = [preguntasData[j], preguntasData[i]];
        }

        setUbicaciones(preguntasData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    };

    fetchQuestions();
  }, []); // Ejecutar cuando cambie el preguntaIndex

  // Calcular distancia en km entre dos puntos usando fórmula de Haversine
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Retorna la distancia en km
  };

  // Calcular la puntuación exponencial en función de la distancia
  const calcularPuntuacion = (distancia) => {
    const maxPuntaje = 1000; // Puntuación máxima
    const factorDeDecaimiento = 2000; // Factor de decaimiento

    // Calcular la puntuación usando la fórmula exponencial
    return Math.max(maxPuntaje * Math.exp(-distancia / factorDeDecaimiento), 0);
  };

  const manejarRespuesta = () => {
    if (!coordenadasSeleccionadas) {
      Alert.alert("Por favor, selecciona una ubicación en el mapa.");
      return;
    }

    const { longitude: lonUsuario, latitude: latUsuario } = coordenadasSeleccionadas;
    const preguntaActual = ubicaciones[preguntaIndex];

    // Calcular la distancia
    const distancia = calcularDistancia(preguntaActual.lat, preguntaActual.lon, latUsuario, lonUsuario);
    
    // Calcular la puntuación basada en la distancia
    const puntos = calcularPuntuacion(distancia);

    // Actualizar el puntaje acumulado
    const nuevaPuntuacion = puntuacion + puntos;

    // Navegar a la pantalla de resultados y pasar los datos necesarios
    navigation.navigate('PreguntaResultado', {
      distancia,
      puntos,
      puntuacion: nuevaPuntuacion,
      preguntaIndex,
      hayMasPreguntas: preguntaIndex < ubicaciones.length - 1,
      coordenadasCorrectas: { latitude: preguntaActual.lat, longitude: preguntaActual.lon },
      coordenadasSeleccionadas: { latitude: latUsuario, longitude: lonUsuario }
    });
    
    setPuntuacion(nuevaPuntuacion);
  };

  const manejarSeleccionUbicacion = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoordenadasSeleccionadas({ latitude, longitude });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const preguntaActual = ubicaciones[preguntaIndex];

  return (
    <View style={styles.container}>
          <Text style={styles.title}>Adivina: {preguntaIndex + 1}/{ubicaciones.length}</Text>
          <Text style={styles.title}>{preguntaActual.titulo}</Text>

        {/* Mapa donde el usuario puede seleccionar una ubicación */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 0, // Latitud en el centro del mapa (0,0)
            longitude: 0, // Longitud en el centro del mapa (0,0)
            latitudeDelta: 90, // Ajuste para que se vea una gran área
            longitudeDelta: 180, // Ajuste para que se vea una gran área
          }}
          onPress={manejarSeleccionUbicacion} // Manejar la selección del mapa
        >
          {/* Marcador para la ubicación seleccionada */}
          {coordenadasSeleccionadas && (
            <Marker
              coordinate={coordenadasSeleccionadas}
              title="Ubicación seleccionada"
              description="Tu respuesta"
            />
          )}
        </MapView>

        <Button title="Adivinar" onPress={manejarRespuesta} />
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
  map: {
    width: '100%',
    height: 400,
  },
});

export default GameScreen;
