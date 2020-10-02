import React from "react";
import { Text, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

export default class Component extends React.Component {
  onPress = async () => {

    // console.log("on press works!");

    const { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  };

  render() {
    return (
      <View style = {styles.container}>
        <TouchableOpacity onPress={this.onPress}>
          <Text>Enable background location</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    zIndex:10,
  }
});

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;

    // do something with the locations captured in the background
    console.log(locations);
  }
});
