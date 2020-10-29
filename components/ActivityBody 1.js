import React, { Component }  from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons , FontAwesome5 } from '@expo/vector-icons';


class ActivityBody extends Component {
  constructor(props) {
      super(props)
      this.navigation = props.navigation;
      
  }

    toChooseRoute() {
      this.navigation.navigate('ChooseRoute');
    }

    toFreeTraining() {
      this.navigation.navigate('FreeTraining');
    }

    // Choose options for different sub pages
    handler(newOption) {
      let value = newOption;
      this.setState({
        option: value
      })
    }

    render= (props) => {
      return (
        <View style={styles.body}>
            <Text style = {styles.title}>Start Activity</Text>
            
            <TouchableOpacity onPress={this.toChooseRoute.bind(this)} style={styles.mainTab}>
                <MaterialCommunityIcons name="run-fast" size={45} color="#3E67D6" /> 
                <Text style={styles.buttonText}>Assign Task</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toFreeTraining.bind(this)} style={styles.mainTab}>
                <FontAwesome5 name="running" size={45} color="#3E67D6"  />
                <Text style={styles.buttonText}>Free Training</Text>
            </TouchableOpacity>
        </View> 
      );
    }
}

// Not used yet
const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    flex:6,
    marginTop:0.07*h
  },
  title: {
    color: 'white',
    fontSize:32,
    fontFamily: 'Poppins_700Bold',
    marginBottom:0.01 * h
  },
  mainTab: {
    alignItems: 'center',
    backgroundColor:'#EFF3FF',
    width: 0.96 * w,
    height:0.19*h,
    // paddingHorizontal:0.24 * w,
    paddingVertical: 0.03 * h,
    borderRadius:10,
    marginTop:0.02 * h
  },
  // button text
  buttonText: {
    color: '#3E67D6',
    fontSize: 25,
    fontFamily: 'Poppins_300Light',
    paddingTop: "1%",
  }
});

export default ActivityBody;