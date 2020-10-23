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

export default class Home extends React.Component {

  onPress = async () => {

    console.log("on press works!");

    this.props.navigation.navigate("GetResultScreen")
  };

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
          <Button 
            title = "GetResult"
            onPress = {this.onPress}
          />
          <Text>11</Text>
          <Button 
            title = "PostResultScreen"
            onPress = {() => this.props.navigation.navigate("PostResultScreen")}
          />
          <Text>11</Text>
          <Button 
            title = "LocationDataScreen"
            onPress = {() => this.props.navigation.navigate("LocationDataScreen")}
          />
          <Button 
            title = "accelerometer"
            onPress = {() => this.props.navigation.navigate("accelerometer")}
          />
          <Button 
            title = "SaveandUpload"
            onPress = {() => this.props.navigation.navigate("SaveandUpload")}
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
