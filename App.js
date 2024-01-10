import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, Image, Platform, Button, Alert, TouchableOpacity } from "react-native";
import Onboarding from "./screens/Onboarding";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import { useEffect, useState } from "react/cjs/react.development";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Stack = createNativeStackNavigator();





export default function App() {
  const [loggedIn, setLoggedIn] = useState("false");

  useEffect(() => {
    const checkStatus = async () => {
      const status = await AsyncStorage.getItem("loggedIn");
      setLoggedIn(status);
    };
    checkStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={(loggedIn) ? "Onboarding" : "Profile"}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const style = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  logo: {
      width: 30,
      height: 30
  },
})
