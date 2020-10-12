import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Button,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FriendsContext } from "./FriendsContext";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
    };
  }

  render() {

    //navigation
      return (
          <View style={styles.container}>

      <Text>Current friends in list : {this.context.currentFriends.length}</Text>
          <Button 
            title = "GetResult"
            onPress = {() => this.props.navigation.navigate("GetResultScreen")}
          />
          <Button 
            title = "PostResultScreen"
            onPress = {() => this.props.navigation.navigate("PostResultScreen")}
          />
          <Text>11</Text>
          </View>

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
