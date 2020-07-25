import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { RectButton } from 'react-native-gesture-handler';
import { AntDesign as Icons } from '@expo/vector-icons'
// import { KEY_API } from 'react-native-dotenv'

export default function App() {
  const [weather, setWeather] = useState(false);
  const [locationPositon, setLocationPositon] = useState([0, 0]);
  const [date, setDate] = useState(false);
  const dayName = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"]
  const monName = ["janeiro", "fevereiro", "março", "abril", "Maio", "junho", "julho", "agosto", "outubro", "novembro", "dezembro"]

  let getApi = async (latitude, longitude) => {
    let res = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat: latitude,
        lon: longitude,
        appid: '',
        lang: 'pt',
        units: 'metric'
      }
    })
    setWeather(res.data)
  }

  useEffect(() => {
    async function position() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Olá", "Precisamos de sua permissão para obter a localização")
        return
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      getApi(latitude, longitude)
      setLocationPositon([
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
    var year = new Date().getFullYear();
    setDate(`${day}, ${date} de ${month} de ${year}`);
  }, [])

  if (weather == false) {
    return (
      <View >
        <StatusBar barStyle="dark-content" backgroundColor="trasnparent" translucent />
        <Text>Carregando .....</Text>
      </View>
    )
  }
  else if (locationPositon[0] !== 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="trasnparent" translucent />
        <Text style={styles.title}>{weather["name"]}/{weather["sys"]["country"]}</Text>
        <Text style={styles.description}>{weather['weather'][0]['description']}</Text>
        <View style={styles.temp}>
          <Text style={styles.weather}>{Math.trunc(weather['main']['temp'])}°C </Text>
          <View style={styles.maxMin}>
            <Text style={styles.max}>{Math.trunc(weather['main']['temp_max'])}°C </Text>
            <Text style={styles.min}>{Math.trunc(weather['main']['temp_min'])}°C </Text>
          </View>
        </View>
        <Text style={styles.info}>Umidade: {weather['main']['humidity']}%</Text>
        <Text style={styles.info}>{date} </Text>
        <RectButton style={styles.btn} onPress={() => { getApi(locationPositon[0], locationPositon[1]) }}>
          <View style={styles.btnIcon}>
            <Icons name="reload1" color="#fff" size={30} />
          </View>
          <Text style={styles.btnTxt}>Recarregar</Text>
        </RectButton>
      </View>
    );
  } else {
    return (
      <View >
        <StatusBar barStyle="dark-content" backgroundColor="trasnparent" translucent />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  title: {
    color: '#322153',
    fontSize: 25,
    maxWidth: 260,
    marginTop: 64,
  },
  description: {
    fontSize: 15,
  },
  weather: {
    fontSize: 40,
  },
  temp: {
    position: "relative",
    marginTop: 20
  },
  maxMin: {
    position: "absolute",
    right: -50
  },
  max: {
    color: "#f00",
    fontSize: 15,
    marginTop: 4
  },
  min: {
    color: "#00f",
    marginTop: 10,
    fontSize: 15
  },
  btn: {
    backgroundColor: '#0005',
    height: 60,
    width: 180,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 50,
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