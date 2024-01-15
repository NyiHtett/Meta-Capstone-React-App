import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { useLayoutEffect, useState } from "react/cjs/react.development";
import { Avatar } from "./Profile";
import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = SQLite.openDatabase("little-lemon.db");

const Home = ({ navigation }) => {
  const [data, setData] = useState("");
  const [image, setImage] = useState("");
  const [filter, setFilter] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "🍋 little lemon",
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: image ? image : "../assets/profile.jpeg" }}
            style={{ width: 35, height: 35, borderRadius: 50 }}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const result = await AsyncStorage.getItem("image");
      if (result != "") {
        setImage(result);
        console.log("lol");
      }
    };
    fetchProfileImage();
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, image TEXT, price REAL, category TEXT DEFAULT NULL)",
        [],
        (_, result) => {
          checkDatabaseAndFetch();
          fetchData();
        },
        (_, error) => {
          Alert.alert("error occurred");
        }
      );
    });
  }, []);

  const checkDatabaseAndFetch = () => {
    db.transaction((tx) => {
      //tx.executeSql("DROP MENU") testing for fresh start
      tx.executeSql(
        "SELECT * FROM menu",
        [],
        (_, result) => {
          // Check if there are rows in the result
          if (result.rows.length === 0) {
            // If no rows, fetch data from the server
            fetchData();
          } else {
            // If rows exist, use the data from the database
            const dataFromDatabase = result.rows._array; // Modify this based on your data structure
            setData(dataFromDatabase);
            console.log(data);
            console.log("you got it");
          }
        },
        (_, error) => {
          Alert.alert("error occurred while checking database");
        }
      );
    });
  };

  const fetchData = async () => {
    try {
      const result = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
      );
      const resultJSON = await result.json();
      const target = resultJSON.menu;
      setData(target);
      storeDataInDatabase(target);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const storeDataInDatabase = (target) => {
    //array of objects = data
    if (target) {
      db.transaction((tx) => {
        target.forEach((data) => {
          tx.executeSql(
            "INSERT INTO menu (name, description, image, price, category) VALUES (?,?,?,?,?)",
            [
              data.name,
              data.description,
              data.image,
              data.price,
              data.category || null,
            ],
            (_, result) => {},
            (_, error) => {
              console.error("error occurred during insertion", error);
            }
          );
        });
      });
    }
  };

  const Separator = () => <View style={styles.separator} />;

  const renderItem = ({ item }) => {
    const status = (filter == "")||(item.category == filter);
    return (status && <View
      style={{
        padding: 30,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxHeight: 200,
      }}
    >
      <Text> {item.name} </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ width: "70%" }}> {item.description} </Text>
        <Image
          source={{
            uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
          }}
          style={{ width: 80, height: 80, resizeMode: "contain" }}
        />
      </View>
      <Text> ${item.price} </Text>
    </View>)
  }

  return (
    <View>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={{ fontSize: 40, color: "#F4CE14" }}>Little Lemon</Text>
        <Text style={{ fontSize: 30, color: "white" }}>Chicago</Text>
        <View style={{ paddingVertical: 30 }}>
          <Text style={{ color: "white", width: "60%" }}>
            A family owned Mediterranean restaurant
          </Text>
          <Image
            style={{ width: 35, height: 35, borderRadius: 50 }}
            source={{ uri: "../assets/restauranfood.jpg" }}
          />
        </View>
        <Pressable
          onPress={() => {
            Alert.alert("You are searching !");
          }}
        >
          <Image
            style={{ width: 50, height: 50, backgroundColor: "white" }}
            source={{
              uri: "https://img.icons8.com/pastel-glyph/64/search--v2.png",
            }}
          />
        </Pressable>
      </View>

      {/* horizontal flatlist for filtering the items */}
      <Text style={{ fontSize: 16, padding: 10, fontWeight: 'bold'}}> Order for delivery! </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        <FlatList
          data={data}
          horizontal={true}
          renderItem={({ item }) => (
            <Pressable onPress={()=> setFilter(item.category)}>
              <View style={{
                margin: 10,
                borderWidth: 2,
                padding: 10,
                borderRadius: 16,
                backgroundColor: '#495E57',
              }}>
            <Text style={{color: 'white'}}>
              {item.category}
            </Text>
            </View>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  heroSection: {
    backgroundColor: "#495E57",
    display: "flex",
    flexDirection: "column",
    padding: 40,
  },
  separator: {
    height: 1,
    backgroundColor: "black",
  },
});
