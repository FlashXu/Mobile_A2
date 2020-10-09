import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default class APP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
    };
  }

  componentDidMount() {
    return fetch(
      "http://www.mobileappproj.ml:5000/running_record?id=139cead802d001cef8a21b6c760a6e64"
    )
      .then((response) => response.json())
      .then((responseJSON) => {
        this.setState({
          isLoading: false,
          dataSource: responseJSON.record_detail,
        });
        console.log(this.state.dataSource);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }else {

      return (
        <View style={styles.container}>
          <FlatList 
          data = {this.state.dataSource}
          renderItem={({item}) => <Text>{item._id}</Text>}
          />
        </View>
      );
    }
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
  item:{
    flex:1,
    alignSelf:'stretch',
  },
});
