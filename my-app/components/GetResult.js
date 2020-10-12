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


export default class GetResult extends React.Component {

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.container}>
            <Button 
              title = "Home"
              onPress = {() => this.props.navigation.navigate("HomeScreen")}
            />
            <Text>11</Text>
          </View>
      </View>

      
      
    )
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
