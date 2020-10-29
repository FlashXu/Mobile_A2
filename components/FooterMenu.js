import React, { Component }  from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Entypo, FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import { Poppins_300Light } from '@expo-google-fonts/poppins';


class FooterMenu extends Component {
  constructor(props) {
      super(props)
      this.option = props.option;
      this.flex = props.yPosition;
      this.handler = props.handler;

      //Page default option is profile as Tab1
      this.state = { tab1Pressed:true, tab2Pressed:false, tab3Pressed:false, tab4Pressed:false }; 
  }
    // Switch Options
    switch(newOption) {
        //set parent component state
        this.handler(newOption);

        //set this component state
        if (newOption==='profile') {
            this.setState({tab1Pressed:true, tab2Pressed:false, tab3Pressed:false, tab4Pressed:false})
        } else if (newOption==='activity') {
            this.setState({tab1Pressed:false, tab2Pressed:true, tab3Pressed:false, tab4Pressed:false})
        } else if (newOption==='friends') {
            this.setState({tab1Pressed:false, tab2Pressed:false, tab3Pressed:true, tab4Pressed:false})
        } else if (newOption==='share') {
            this.setState({tab1Pressed:false, tab2Pressed:false, tab3Pressed:false, tab4Pressed:true})
        }
    }



    render= (props) => {
      return (
        <View style={{flex:this.flex,flexDirection:'row', backgroundColor:"rgba(42, 46, 67, 1)",paddingTop:7,
        justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={()=>this.switch('profile')} style={this.state.tab1Pressed?styles.footerMenuTabActive:styles.footerMenuTab}>
                <Ionicons name="md-person" size={30} color={this.state.tab1Pressed ? "#3E67D6" : "#8B8E95"} />
                <Text style={this.state.tab1Pressed?styles.footerMenuTabTextActive:styles.footerMenuTabText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>this.switch('activity')} style={this.state.tab2Pressed?styles.footerMenuTabActive:styles.footerMenuTab}>
                <Feather name="activity" size={30} color={this.state.tab2Pressed ? "#3E67D6" : "#8B8E95"} />    
                <Text style={this.state.tab2Pressed?styles.footerMenuTabTextActive:styles.footerMenuTabText}>Activity</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>this.switch('friends')} style={this.state.tab3Pressed?styles.footerMenuTabActive:styles.footerMenuTab}>
                <FontAwesome5 name="user-friends" size={30} color={this.state.tab3Pressed ? "#3E67D6" : "#8B8E95"} />
                <Text style={this.state.tab3Pressed?styles.footerMenuTabTextActive:styles.footerMenuTabText}>Friends</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>this.switch('share')} style={this.state.tab4Pressed?styles.footerMenuTabActive:styles.footerMenuTab}>
                <Entypo name="share" size={30} size={30} color={this.state.tab4Pressed ? "#3E67D6" : "#8B8E95"} />
                <Text style={this.state.tab4Pressed?styles.footerMenuTabTextActive:styles.footerMenuTabText}>Share</Text>
            </TouchableOpacity>
        </View>
      );
    }
}



const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

const styles = StyleSheet.create({
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerMenuTabActive: {
    alignItems: 'center',
    backgroundColor:'white',
    height:85,
    paddingVertical: 14,
    marginHorizontal:5,
    borderRadius:10,
    flex:1

  },
  footerMenuTab: {
    alignItems: 'center',
    backgroundColor:'#EFF3FF',
    height:85,
    width:30,
    paddingVertical: 14,
    marginHorizontal:5,
    borderRadius:10,
    flex:1
  },
  footerMenuTabTextActive: {
    color: '#3E67D6',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    marginTop:"5%"
  },
  footerMenuTabText: {
    color: '#8B8E95',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    marginTop:"5%"
  }
});



export default FooterMenu;