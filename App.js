import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import * as Location from "expo-location";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "f3b963329fb0f9f11cb27f5740756622";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
  Mist: "fog",
  Smoke: "fog",
  Haze: "dat-haze",
  Dust: "fog",
  Fog: "fog",
  Sand: "fog",
  Dust: "cloudy-gusts",
  Ash: "fog",
  Squall: "wind",
  Tornado: "wind",
};

export default function App() {
  const [region, setRegion] = useState("Loading...");
  const [city, setCity] = useState("");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setRegion(location[0].region);
    setCity(location[0].district);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&lang=kr&units=metric&exclude=alerts&appid=${API_KEY}`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.regionName}>{region}</Text>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.indicator}>
            <ActivityIndicator
              color="black"
              size="large"
              style={{ marginTop: 100 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View style={styles.day} key={index}>
              <View>
                <Text style={{ textAlign: "left", fontSize: 24 }}>
                  {new Date(day.dt * 1000).toString().substring(0, 10)}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    width: "90%",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.temp}>
                      {parseFloat(day.temp.day).toFixed(1)}
                    </Text>
                    <View style={{}}>
                      <Text style={styles.degree}>ºC</Text>
                    </View>
                  </View>
                  <View>
                    <Fontisto
                      name={`${icons[day.weather[0].main]}`}
                      size={68}
                      style={{}}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.sub}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
  },
  city: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  regionName: {
    fontSize: 24,
    fontWeight: "300",
  },
  cityName: {
    fontSize: 48,
    fontWeight: "400",
  },
  weather: {},
  indicator: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    padding: 30,
  },
  temp: {
    fontWeight: "500",
    fontSize: 86,
  },
  degree: {
    marginTop: 12,
    fontSize: 32,
  },
  description: {
    fontSize: 48,
  },
  sub: {
    marginTop: 12,
    fontSize: 24,
  },
});
