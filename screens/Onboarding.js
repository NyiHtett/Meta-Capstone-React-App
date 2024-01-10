import React, { useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react/cjs/react.development";
const Onboarding = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkStatus = async () => {
      const status = await AsyncStorage.getItem("loggedIn");
      if (status) {
        navigation.navigate("Profile");
      }
    };
    checkStatus();
  }, []);
  return (
    <View style={style.container}>
      <Text> Little Lemon 🍋 </Text>
      <TextInput
        style={style.inputBox}
        onChangeText={setName}
        placeholder="Insert First Name ..."
      />
      <TextInput
        style={style.inputBox}
        onChangeText={setEmail}
        placeholder="Insert Email ..."
      />
      <Pressable
        style={style.button}
        disabled={name == "" && email == "" ? true : false}
        onPress={async () => {
          if (name.length == 8 && email.length == 8) {
            await AsyncStorage.multiSet([
              ['loggedIn', 'true'],
              ['fname', name],
              ['email', email]
            ]);
            navigation.navigate("Profile");
          }
        }}
      >
        <Text> Sign Up </Text>
      </Pressable>
    </View>
  );
};

export default Onboarding;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    display: "flex",
    margin: 30,
    borderWidth: 5,
    borderRadius: 20,
    padding: 20,
    width: 300,
  },
  button: {
    backgroundColor: "#F4CE14",
    color: "black",
    padding: 20,
    borderRadius: 10,
  },
});
