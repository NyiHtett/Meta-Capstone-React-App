import React from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import {
  useLayoutEffect,
  useState,
  useEffect,
} from "react/cjs/react.development";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Form = ({ navigation }) => {
  const [fname, setFname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [order, setOrder] = useState(false);
  const [password, setPassword] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setFname(await AsyncStorage.getItem("fname"));
      setlname(await AsyncStorage.getItem("lname"));
      setEmail(await AsyncStorage.getItem("email"));
      setNumber(await AsyncStorage.getItem("number"));
      const status = await AsyncStorage.getItem("Order Statuses");
      console.log(status);
      if(status === 'true'){
        setOrder(true);
      }
      else if(status === 'false') {
        setOrder(false);
      }
      else {
        setOrder(false);
      }
    };
    fetchData();
  }, [order]);
  onSelectionsChange = (selectedChoices) => {
    // selectedFruits is array of { label, value }
    this.setState({ selectedChoices })
  }
  return (
    <View style={style.formContainer}>
      <View>
        <Text>First name</Text>
        <TextInput
          style={style.textBox}
          onChangeText={setFname}
          value={fname}
        />
      </View>

      <View>
        <Text>Last name</Text>
        <TextInput
          style={style.textBox}
          onChangeText={setlname}
          value={lname}
        />
      </View>

      <View>
        <Text>Email</Text>
        <TextInput
          style={style.textBox}
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View>
        <Text>Phone number</Text>
        <TextInput
          style={style.textBox}
          onChangeText={setNumber}
          value={number}
        />
      </View>

      <Text style={{...style.textHeader, marginVertical: 20}}>Email Notifications</Text>
      <BouncyCheckbox
  size={25}
  fillColor="#495E57"
  unfillColor="#FFFFFF"
  text="Order Statuses"
  isChecked={true}
  iconStyle={{ borderColor:"" }}
  innerIconStyle={{ borderWidth: 2 }}
  textStyle={{ fontFamily: "JosefinSans-Regular" }}
  onPress={(isChecked) => {
    const update = async () => {
    if(isChecked) {
      await AsyncStorage.setItem("Order Statuses", 'true');
      setOrder(isChecked)
    }
    else {
      await AsyncStorage.setItem("Order Statuses", 'false');
    }
  }
  update();
  }}
  
/>
<BouncyCheckbox
  size={25}
  fillColor="#495E57"
  unfillColor="#FFFFFF"
  text="Password Changes"
  isChecked={true}
  iconStyle={{ borderColor:"" }}
  innerIconStyle={{ borderWidth: 2 }}
  textStyle={{ fontFamily: "JosefinSans-Regular" }}
  onPress={(isChecked: boolean) => {}}
/>
      <View>
        <Pressable
          onPress={() => {
            handleLogOut;
            navigation.goBack();
          }}
          style={style.logoButton}
        >
          <Text>Log out</Text>
        </Pressable>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            style={style.defaultButton}
            onPress={() => {
              AsyncStorage.clear();
              setFname("");
              setlname("");
              setEmail("");
              setNumber("");
            }}
          >
            <Text>Discard changes</Text>
          </Pressable>

          <Pressable
            style={{ ...style.defaultButton, backgroundColor: "#495E57" }}
            onPress={() => {
              const saveData = async () => {
                const keyPairs = [
                  ["fname", `${fname}`],
                  ["lname", `${lname}`],
                  ["email", `${email}`],
                  ["number", `${number}`],
                ];
                await AsyncStorage.multiSet(keyPairs);
                console.log("all the data stored");
              };
              saveData();
            }}
          >
            <Text style={{ color: "white" }}>Save changes</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const handleLogOut = async () => {
  await AsyncStorage.setItem("image", "");
  console.log("deleted the storage");
};

const Avatar = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const getImage = async () => {
      const result = await AsyncStorage.getItem("image");
      if (result != "") {
        setImage(result);
        console.log("here");
      }
    };
    getImage();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await AsyncStorage.setItem("image", result.assets[0].uri);
      console.log("setted in the storage");
    }
  };

  return (
    <Pressable onPress={pickImage}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={{ width: 35, height: 35, borderRadius: "50%" }}
        />
      ) : (
        <Image
          source={require("../assets/profile.jpeg")}
          style={{ width: 35, height: 35, borderRadius: "50%" }}
        />
      )}
    </Pressable>
  );
};

const Profile = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "🍋",
      headerRight: () => <Avatar />,
    });
  }, [navigation]);

  return (
    <View style={style.container}>
      <Text style={style.textHeader}> Personal Information </Text>
      <Form navigation={navigation} />
    </View>
  );
};

export default Profile;

const style = StyleSheet.create({
  container: {
    padding: 20,
  },
  logo: {
    width: 30,
    height: 30,
  },
  header: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F4CE14",
    alignSelf: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
  },
  defaultButton: {
    width: "40%",
    borderWidth: 3,
    borderColor: "#495E57",
    alignItems: "center",
    margin: 20,
    height: 40,
    justifyContent: "center",
    borderRadius: 8,
    color: "#495E57",
  },
  textBox: {
    borderWidth: 3,
    borderRadius: 8,
    borderColor: "#495E57",
    height: 40,
    padding: 10,
    marginTop: 10,
  },
  formContainer: {
    marginVertical: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
});
