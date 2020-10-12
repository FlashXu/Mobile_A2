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

function Item({ gen_id }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{gen_id}</Text>
    </View>
  );
}

const coordinate= [[1,2],[3,4]]
const distance = 6
const end_time = "2020-09-21 16:36:00"
const start_time = "2020-09-20 16:36:00"
const user_id = "139cead802d001cef8a21b6c76078470"


export default class PostResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: null,
    };
  }

  componentDidMount() {
    fetch('https://mywebsite.com/endpoint/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            coordinate: coordinate,
            distance: distance,
            end_time:end_time,
            start_time:start_time,
            user_id:user_id,
          })
        })
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
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => <Item coordinate={item.gen_id} />}
            keyExtractor={item => item.gen_id}
          />

          <View style={styles.container}>
            <Button 
              title = "Back"
              onPress = {() => this.props.navigation.navigate("HomeScreen")}
            />
            <Text>11</Text>
          </View>
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
