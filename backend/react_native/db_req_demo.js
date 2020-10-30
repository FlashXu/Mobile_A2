import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';

class App_frontpage extends Component {
  // Request with params. (Only GET)
  GET(url){
      fetch(url,{
        method: 'GET'
      })
        .then((response) => response.json())
        .then((response)=> alert(JSON.stringify(response)))
        .catch((error) => {
          console.error(error);
        });
  }

  // Request with params. (POST, DELETE and PUT)
  bodyOperation(url, data, operation){
    fetch(url,{
      method: operation,
      body: data
    })
      .then((response) => response.json())
      .then((response)=> alert(JSON.stringify(response)))
      .catch((error) => {
        console.error(error);
      });
}

  render(){
    return (
      <View style={styles.container}>
        <Text>This is an app for testing db link</Text>
        <View style={{flexDirection: 'row', marginTop: 64}}>

          {/* POST method demo. */}
          <View style={styles.btnstyle}>
            <Button 
              title="POST" 
              onPress = {() => 
                this.bodyOperation('http://www.mobileappproj.ml:5000/accounts',
                JSON.stringify({
                  pwd: '123456',
                  user_name: 'Yichao_Xu@gmail.com'
                }), 'POST')}
            />
          </View>
          
          {/* DELETE method demo. */}
          <View style={styles.btnstyle}>
            <Button 
              title="DELETE"
              onPress = {() => 
                this.bodyOperation('http://www.mobileappproj.ml:5000/accounts',
                JSON.stringify({
                  _id: '123456'
                }), 'DELETE')} 
            />
          </View>
          
          {/* PUT method demo. */}
          <View style={styles.btnstyle}>
            <Button 
              title="PUT" 
              onPress = {() => 
                this.bodyOperation('http://www.mobileappproj.ml:5000/accounts',
                JSON.stringify({
                  "_id": "139cead802d001cef8a21b6c76078470",
                  "pwd": "123456",
                  "user_name": "Yichao_Xu@gmail.com"
                }), 'PUT')} 
            />
          </View>
          
          {/* GET method demo. */}
          <View style={styles.btnstyle}>
            <Button 
            title ="GET" 
            onPress = {() => this.GET('http://www.mobileappproj.ml:5000/moments?id=139cead802d001cef8a21b6c760bd269')}
            />
          </View>
        </View>

      </View> 
    );
  }
}
export default App_frontpage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  btnstyle:{
    flex: 1, 
    width:70,
    marginRight:10

  }
});
 

