import React from "react";
import { Text, TouchableOpacity, StyleSheet, View, Dimensions,AsyncStorage, Button } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

export default class Component extends React.Component {
    constructor(){
        super();
        this.state = {
            LocationsGet: null,
        };
    }
/*
    _storeData = async () => {
        try {
          const jsonValue = String(JSON.stringify(this.state.LocationsGet));
          await AsyncStorage.setItem('@location', jsonValue);
          console.log('Saving Done');
        } catch (e) {
          // saving error
          console.log('Fail to save item');
        }
      };
    _getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@location');
          if(jsonValue !=null ){
            console.log(jsonValue != null ? JSON.parse(jsonValue) : null);
            }        
        } catch(e) {
          // error reading value
          console.log('Fail to load item');
        }
      };
*/



  onPress = async () => {

    console.log("on press works!");

    const { status } = await Location.requestPermissionsAsync();
    if (status === "granted") {
        console.log("status granted!");
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        showsBackgroundLocationIndicator: true,
        foregroundService:{
            notificationTitle:"GeoLocation tacking:",
            notificationBody:"Tracking enabled"
        }
      });
      //console.log("Task registere info: ");
      //console.log(await TaskManager.getRegisteredTasksAsync());
      //console.log(await TaskManager.isTaskRegisteredAsync("background-location-task"));
      //console.log(TaskManager.isTaskDefined("background-location-task"));
      //console.log(await Location.hasStartedLocationUpdatesAsync("background-location-task"));

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
    console.log("Something wrong with locations.");
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
    //console.log(locations);
    const _storeData = async (name) => {
        try {
          const jsonValue = String(JSON.stringify(name));
          await AsyncStorage.setItem('@location', jsonValue);
          console.log("Location Saved into storage. ");
        } catch (e) {
          // saving error
          console.log('Fail to save item');
        }
      };
    const _getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('@location');
          if(jsonValue !=null ){
            console.log(jsonValue != null ? JSON.parse(jsonValue) : null);
            }
          console.log("Load finished. Location from storage. ");        
        } catch(e) {
          // error reading value
          console.log('Fail to load item');
        }
      };
      console.log(_storeData(locations));
      console.log(_getData());


  }else if(data == null){
    console.log("No new data returned.");
  }
});