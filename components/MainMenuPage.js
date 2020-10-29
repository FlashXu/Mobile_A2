import { StatusBar } from 'expo-status-bar';
import React, { Component }  from 'react';
import { Dimensions} from 'react-native';
import {StyleSheet, View} from 'react-native';
import FooterMenu from './FooterMenu';
import ActivityBody from './ActivityBody';
import ProfileBody from './ProfileBody';
import ShareBody from './ShareBody';
import FriendsBody from './FriendsBody';
import RankingBody from './RankingBody';


class MainMenuPage extends Component {
  constructor(props) {
      super(props)
      this.navigation = props.navigation;
      this.data = props.route.params;
      //Page default option is profile
      this.state = { option:"profile", postId:''}; 
  }

    // Choose options for different sub pages
    handler(newOption) {
      let value = newOption;
      this.setState({
        option: value
      })
    }

    DisplayBody(props) {
      if (props.option === 'activity') {
        return <ActivityBody navigation={props.navigation} />

      } else if (props.option === 'profile')  {
        return <ProfileBody navigation={props.navigation} />

      } else if (props.option === 'friends')  {
        return <FriendsBody navigation={props.navigation} handler={props.handler} />

      } else if (props.option === 'share')  {
        return <ShareBody navigation={props.navigation} postHandler={props.postHandler} handler={props.handler} />

      } else if (props.option === 'ranking')  {
        console.log("b")
        return <RankingBody navigation={props.navigation} handler={props.handler} />

      } 
    }

    render= (props) => {
      return (
        <View style={styles.container}>
          <this.DisplayBody 
            option={this.state.option} 
            navigation={this.navigation} 
            handler={this.handler.bind(this)}
          ></this.DisplayBody>
          <FooterMenu yPosition={1.1} option={this.state.option} handler={this.handler.bind(this)} />
            
          <StatusBar style="auto" />
        </View>
      );
    }
}

// Not used yet
const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2E43',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    alignItems: 'center',
    flex:6,
    marginTop:0.07*h
  },
  footer: {
    // alignItems: 'center',
    flex:1.1
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
  },
  footerMenuTab: {
    alignItems: 'center',
    backgroundColor:'#EFF3FF',
    // width:20,
    height:0.13*h,
    // paddingHorizontal:0.02 * w,
    paddingVertical: 0.02 * h,
    marginHorizontal:0.015 * w,
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

export default MainMenuPage;