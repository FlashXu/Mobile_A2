import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet, View, Dimensions,AsyncStorage, Button } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { Accelerometer } from 'expo-sensors';

const LOCATION_TASK_NAME = "background-location-task";


export default class LocationData extends React.Component {
    constructor(){
        super();
        this.state = {
            LocationsGet: null,
            data: null,
        };
    };
    //For accelerometer

    _toggle = () => { 
      if (this._subscription) {
        console.log("Accelerometer already subscripted.");
        this._subscription && this._subscription.remove();
        this._subscription = null;
        Accelerometer.removeAllListeners();
      } else {
        Accelerometer.removeAllListeners();
        this._subscription = Accelerometer.addListener(accelerometerData => {
          this.setData(accelerometerData);
        console.log(Accelerometer.getListenerCount());  
        });
      }
      Accelerometer.setUpdateInterval(1600);
    };

    setData = async (accelerometerData) => {
      this.data = accelerometerData;
      console.log(accelerometerData);
      try {
        const jsonValue = String(JSON.stringify(accelerometerData));
        await AsyncStorage.setItem('@accelerometer', jsonValue);
        console.log("accelerometer data Saved into storage. ");
      } catch (e) {
        // saving error
        console.log('Fail to save item');
      }
    };

    _getAccData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@accelerometer');
        if(jsonValue !=null ){
          console.log(jsonValue != null ? JSON.parse(jsonValue) : null);
          }
        console.log("Load finished. accelerometer data loaded from storage. ");        
      } catch(e) {
        // error reading value
        console.log('Fail to load item');
      }
    };

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
        <Text >Accelerometer: (in Gs where 1 G = 9.81 m s^-2)</Text>
      <Text >
        x: {this._getAccData().x} y: {this._getAccData().y} z: {this._getAccData().z}
      </Text>
      <TouchableOpacity onPress={this._toggle()} >
          <Text>Start track accelerometer</Text>
        </TouchableOpacity>
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
  TouchableOpacity: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
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

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}