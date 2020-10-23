import React from "react";
import { Text, TouchableOpacity, StyleSheet, View, Dimensions,AsyncStorage, Button } from "react-native";
import { Accelerometer } from 'expo-sensors';

export default class SaveandUpload extends React.Component {
    constructor(){
        super();
        this.state = {
            data: null,
        };
    };
    //For accelerometer

     _stopAcc = () => { 
       if(Accelerometer.hasListeners()){
      Accelerometer.removeAllListeners();
       }

    };

    _Upload = () => { 

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

  render() {
    return (
      <View style = {styles.container}>
        <TouchableOpacity onPress={this._stopAcc()} >
          <Text>Stop track accelerometer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._Upload()} >
          <Text>Post data to database</Text>
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