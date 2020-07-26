import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { RectButton } from 'react-native-gesture-handler';
import { AntDesign as Icons } from '@expo/vector-icons';

export default function App() {
  //State para salvar o response da API
  const [weather, setWeather] = useState(false);

  //State para salvar a localização do usuário
  const [locationPosition, setLocationPosition] = useState([0, 0]);

  //State para salvar uma string que contem o dia da semana, a data o mes e ano do sistema 
  const [date, setDate] = useState(false);

  //Const que contem as informações de data em português para salvar na state date e exibir na tela
  const dayName = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"]
  const monName = ["janeiro", "fevereiro", "março", "abril", "Maio", "junho", "julho", "agosto", "outubro", "novembro", "dezembro"]

  let getApi = async (latitude, longitude) => {
    let res = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat: latitude,
        lon: longitude,
        appid: '<Adicione a sua API KEY>',
        lang: 'pt',
        units: 'metric'
      }
    })
    setWeather(res.data)
  }

  useEffect(() => {
    //Função assíncrona para pegar a localização do usuário
    async function position() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Olá", "Precisamos de sua permissão para obter a localização")
        return
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      getApi(latitude, longitude)
      setLocationPosition([
        latitude,
        longitude
      ])
    }
    position()
  }, [])

  useEffect(() => {
    const now = new Date;
    var day = dayName[now.getDay()];
    var date = now.getDate()
    var month = monName[now.getMonth()];
    var year = now.getFullYear();
    setDate(`${day}, ${date} de ${month} de ${year} `);
  }, [weather])

  if (weather == false) {
    return (
      <View style={styles.container} >
        <StatusBar barStyle="dark-content" translucent />
        <Text>Carregando .....</Text>

      </View>
    )
  }
  else if (locationPosition[0] !== 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent />
        <Text style={styles.title}>{weather["name"]}/{weather["sys"]["country"]}</Text>
        <Text style={styles.description}>{weather['weather'][0]['description']}</Text>
        <Image style={styles.image} source={{ uri: `http://openweathermap.org/img/wn/${weather['weather'][0]['icon']}@2x.png` }} />
        <View style={styles.temp}>
          <Text style={styles.weather}>{Math.trunc(weather['main']['temp'])}°C </Text>
          <View style={styles.maxMin}>
            <Text style={styles.max}>{Math.trunc(weather['main']['temp_max'])}°C </Text>
            <Text style={styles.min}>{Math.trunc(weather['main']['temp_min'])}°C</Text>
          </View>
        </View>
        <Text style={styles.info}>Humidade - {weather['main']['humidity']}%</Text>
        <Text style={styles.info}>{date} </Text>
        <RectButton style={styles.btn} onPress={() => { getApi(locationPosition[0], locationPosition[1]) }}>
          <View style={styles.btnIcon}>
            <Icons name="reload1" color="#fff" size={30} />
          </View>
          <Text style={styles.btnTxt}>Recarregar</Text>
        </RectButton>
      </View>
    );
  } else {
    return (
      <View style={styles.container} >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: "center",
    backgroundColor: "#FcFcFc"
  },
  title: {
    color: '#000',
    fontSize: 25,
    maxWidth: 260,
    marginTop: 64,
  },
  description: {
    fontSize: 15,
  },
  image: {
    width: 100,
    height: 100,
  },
  weather: {
    fontSize: 50,
  },
  temp: {
    position: "relative",
    marginTop: 20,
    marginBottom: 20
  },
  maxMin: {
    position: "absolute",
    right: -50
  },
  max: {
    color: "#a00",
    fontSize: 15,
    marginTop: 10
  },
  min: {
    color: "#00a",
    marginTop: 10,
    fontSize: 15
  },
  info: {
    fontSize: 15,
    marginTop: 10
  },
  btn: {
    backgroundColor: '#0006',
    height: 60,
    width: 180,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },

  btnIcon: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFF',
  },

  btnTxt: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    marginLeft: -20
  }
})