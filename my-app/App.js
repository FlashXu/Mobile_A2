import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {FriendsContext} from './components/FriendsContext';
import HomeScreen from './components/Home';
import PostResultScreen from './components/PostResult';
import GetResultScreen from './components/GetResult';

const Stack = createStackNavigator();


export default class APP extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      possibleFriends:['Alice','Bob','Sammy'],
      currentFriends:[],
    };
  }

  render() {
    return (

      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="GetResultScreen" component={GetResultScreen} />
        <Stack.Screen name="PostResultScreen" component={PostResultScreen} />
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
