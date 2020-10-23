import React from "react";
import {
  StyleSheet,
  Dimensions,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/Home';
import PostResultScreen from './components/PostResult';
import GetResultScreen from './components/GetResult';
import LocationDataScreen from './components/LocationData';
import SaveandUpload from './components/SaveandUpload';

const Stack = createStackNavigator();


export default class APP extends React.Component {


  render() {
    return (

      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="GetResultScreen" component={GetResultScreen} />
        <Stack.Screen name="PostResultScreen" component={PostResultScreen} />
        <Stack.Screen name="LocationDataScreen" component={LocationDataScreen} />
        <Stack.Screen name="SaveandUpload" component={SaveandUpload} />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    zIndex: 10,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
