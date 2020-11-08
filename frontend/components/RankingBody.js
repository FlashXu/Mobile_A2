import { StatusBar } from 'expo-status-bar';
import React, { Component }  from 'react';
import { Alert, Dimensions, AsyncStorage} from 'react-native';
import {Animated, Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity,ActivityIndicator  } from 'react-native';
import forgotPassword1 from '../assets/ForgotPassword1.png';
import { MaterialCommunityIcons ,Entypo, FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import DialogInput from 'react-native-dialog-input';
import { AntDesign } from '@expo/vector-icons';
import Svg, { G, Circle, Rect, Path } from 'react-native-svg';

class RankingBody extends Component {
  constructor(props) {
    super(props)
    this.navigation = props.navigation;
    this.handler = props.handler;
    this.state = {
      totalDistance:20.8,
      avgSpeed:6.2,
      totalSessions:5,

      //default value, friends ranking
      showFriendsRanking:true,
      showCityRanking:false,

      //default value, today ranking
      showToday:true,
      showWeek:false,
      showMonth:false,
      friendsRanking:[],
      cityRanking:[]
    }

    //不要在这发送请求，在showToday(), showWeek(), showMonth()中发请求
    //dont put request and setState here

}

async storeData(key, item){
  try {
      await AsyncStorage.setItem(key, item);
    } catch (e){
      console.log(e);
    }
}

async GET(url){
  const results = await fetch(url,{
    method: 'GET'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
  });
  return results;
}

// Request with params. (POST, DELETE and PUT)
async bodyOperation(url, data, operation){
  const results = await fetch(url,{
  method: operation,
  body: data
  })
  .then((response) => response.json())
  .catch((error) => {
      console.error(error);
      alert(error);
  });
  return results;
}

// 获取当前id
async getID(){
  try {
      id = await AsyncStorage.getItem('@accountID');
      return id;
  }catch (e) {
      console.error(e);
      return null;
  }
}

componentDidMount() {
    this.showToday();
}

showToday() {
    
    if(this.state.showFriendsRanking) {
        //show friends ranking

        //-------put request here--------------------------
        //request from server for the data for Today's ranking for friends
        //Pass value into setState()
        var getDBdata = this.GET;
        var pageObj = this;
        var storeinfo = this.storeData;
        // 先获取用户id
        this.getID().then(function(id){
          if (id != null){
            var url = 'http://www.mobileappproj.ml:5000/distance/ranking/daily?id=' + id;
            getDBdata(url).then(function(res){
                if(res.resp == 404){
                  alert('There is no such a user!');
                }else{
                  // 更新state
                  var rank = res.rank;
                  var rank_info = [];
                  for (let i = 0; i < rank.length; i++){
                    var info_dict = {};
                    var user_id = rank[i][0];
                    var user_info = rank[i][1];
                    info_dict.Id = user_id;
                    info_dict.totalDistance = user_info.distance;
                    info_dict.avgSpeed = user_info.ave_speed;
                    info_dict.name = user_info.first_name + ' ' + user_info.last_name;
                    info_dict.rank = (i + 1).toString();
                    rank_info.push(info_dict); 
                  }
                  pageObj.setState({friendsRanking:rank_info});
                  // 更新数据库
                  storeinfo('@friendsDailyRanking', JSON.stringify(rank_info));
                  // 更新信息
                }
            });
          }
        }, getDBdata, storeinfo, pageObj);
    } else {
        //show city ranking
        //-------put request here--------------------------
        this.setState({
            cityRanking:[
                {Id:"123", totalDistance:6,avgSpeed:5,name:'name1',rank:'1'},
                {Id:"1234", totalDistance:6,avgSpeed:5,name:'name2',rank:'2'},
                {Id:"12345", totalDistance:6,avgSpeed:5,name:'name3',rank:'3'},
                {Id:"123456", totalDistance:6,avgSpeed:5,name:'name4',rank:'4'},
            ]
        })    
    }
}

showWeek() {
    if(this.state.showFriendsRanking) {
        //friends ranking
        var getDBdata = this.GET;
        var pageObj = this;
        var storeinfo = this.storeData;
        // 先获取用户id
        this.getID().then(function(id){
          if (id != null){
            var url = 'http://www.mobileappproj.ml:5000/distance/ranking/weekly?id=' + id;
            getDBdata(url).then(function(res){
                if(res.resp == 404){
                  alert('There is no such a user!');
                }else{
                  // 更新state
                  var rank = res.rank;
                  var rank_info = [];
                  for (let i = 0; i < rank.length; i++){
                    var info_dict = {};
                    var user_id = rank[i][0];
                    var user_info = rank[i][1];
                    info_dict.Id = user_id;
                    info_dict.totalDistance = user_info.distance;
                    info_dict.avgSpeed = user_info.ave_speed;
                    info_dict.name = user_info.first_name + ' ' + user_info.last_name;
                    info_dict.rank = (i + 1).toString();
                    rank_info.push(info_dict); 
                  }
                  pageObj.setState({friendsRanking:rank_info});
                  // 更新数据库
                  storeinfo('@friendsWeekRanking', JSON.stringify(rank_info));
                  // 更新信息
                }
            });
          }
        }, getDBdata, storeinfo, pageObj);

    } else {
        //show city ranking
        
    }


}

showMonth() {
    if(this.state.showFriendsRanking) {
        //friends ranking
        var getDBdata = this.GET;
        var pageObj = this;
        var storeinfo = this.storeData;
        // 先获取用户id
        this.getID().then(function(id){
          if (id != null){
            var url = 'http://www.mobileappproj.ml:5000/distance/ranking/monthly?id=' + id;
            getDBdata(url).then(function(res){
                if(res.resp == 404){
                  alert('There is no such a user!');
                }else{
                  // 更新state
                  var rank = res.rank;
                  var rank_info = [];
                  for (let i = 0; i < rank.length; i++){
                    var info_dict = {};
                    var user_id = rank[i][0];
                    var user_info = rank[i][1];
                    info_dict.Id = user_id;
                    info_dict.totalDistance = user_info.distance;
                    info_dict.avgSpeed = user_info.ave_speed;
                    info_dict.name = user_info.first_name + ' ' + user_info.last_name;
                    info_dict.rank = (i + 1).toString();
                    rank_info.push(info_dict); 
                  }
                  pageObj.setState({friendsRanking:rank_info});
                  // 更新数据库
                  storeinfo('@friendsMonthRanking', JSON.stringify(rank_info));
                  // 更新信息
                }
            });
          }
        }, getDBdata, storeinfo, pageObj);

    } else {
        //show city ranking
        
    }

}


//display all sessions that a user has
RenderSessions(props) {
  let context = props.context;
  let rankOption = props.rankOption;
  let rank = [];
  if (rankOption === "friends") {
    rank = context.state.friendsRanking;
  } else {
    rank = context.state.cityRanking;
  }


  return (
    <View>
      {
        rank.map((value,i)=>{
          return (
              <TouchableOpacity style={styles.mainTab} key={i}>
                <View style={{flex:1}}>
                <Image source={require('../assets/man-user.png')} style={styles.image} />
                </View>
                <View style={{flex:2}}>
                  <View style={styles.sessionBox}> 
                    <Text style={styles.sessionTitleLarge}> {rank[i].name} </Text>
                    <Text style={context.state.showDeleteButton ? styles.onlineTitle : styles.onlineTitleActive}> 
                    {
                        rank[i].rank == 1 ? <Image source={require("../assets/1stplace.png")} style={{resizeMode:'stretch'}} /> : 
                        (rank[i].rank == 2 ? <Image source={require("../assets/2ndplace.png")} style={{resizeMode:'stretch'}} />: 
                        (rank[i].rank == 3 ? <Image source={require("../assets/3rdplace.png")} style={{resizeMode:'stretch'}} /> : rank[i].rank))
                    } 
                    </Text>
                  </View>
                  
                  <Text style={styles.sessionTitle}>Total Distance: {rank[i].totalDistance} km</Text>
                  <Text style={styles.sessionTitle}>Average Speed: {rank[i].avgSpeed} m/s</Text>
                </View>
                
            </TouchableOpacity>
            );
        })
      }
    </View>
  )
}

render= (props) => {
  return (
    <View style={styles.body}>
        <TouchableOpacity style={{position:"relative",right:"37%",width:100}} onPress={()=>this.handler('friends')}>
            <Svg  style={{left:'20%'}} width={21.213} height={21.213} viewBox="0 0 21.213 21.213" {...props}>
            <G data-name="Group 2420" fill="#fff">
                <Path
                data-name="Rectangle 2287"
                opacity={0}
                d="M0 0h21.21v21.21H0z"
                />
                <Path
                data-name="Path 1768"
                d="M2.83 10.607l8.48-8.48A1 1 0 109.895.711L.708 9.9a1 1 0 000 1.414L9.895 20.5a1 1 0 101.415-1.414z"
                fillRule="evenodd"
                />
            </G>
            </Svg>

        </TouchableOpacity>
        
        
        <Text style = {styles.title}>Ranking</Text>

        <View style={styles.sessionBox2}>
          <TouchableOpacity onPress={()=> {this.setState({showFriendsRanking:true,showCityRanking:false,showToday:true,showWeek:false,showMonth:false}, ()=>this.showToday()) }} style={this.state.showFriendsRanking ? styles.buttonPress : styles.button}>
              <Text style={ this.state.showFriendsRanking ? styles.buttonTextActive : styles.buttonText}>Friends Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {this.setState({showCityRanking:true,showFriendsRanking:false,showToday:true,showWeek:false,showMonth:false}, ()=>this.showToday()) }} style={this.state.showCityRanking ? styles.buttonPress : styles.button}>
              <Text style={ this.state.showCityRanking ? styles.buttonTextActive : styles.buttonText}>City Ranking</Text>
          </TouchableOpacity>
        </View>  

        <View style={styles.sessionBox3}>
          <TouchableOpacity onPress={()=> {this.setState({showToday:true,showWeek:false,showMonth:false}); this.showToday(); }} style={this.state.showToday ? styles.button2Press : styles.button2}>
              <Text style={ this.state.showToday ? styles.buttonTextFilterActive : styles.buttonTextFilter}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {this.setState({showToday:false,showWeek:true,showMonth:false}); this.showWeek();}} style={this.state.showWeek ? styles.button2Press : styles.button2}>
              <Text style={ this.state.showWeek ? styles.buttonTextFilterActive : styles.buttonTextFilter}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.setState({showToday:false,showWeek:false,showMonth:true}); this.showMonth();}} style={this.state.showMonth ? styles.button2Press : styles.button2}>
              <Text style={ this.state.showMonth ? styles.buttonTextFilterActive : styles.buttonTextFilter}>Month</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>

            {(() => {
                if (this.state.showFriendsRanking) {
                    return <this.RenderSessions context = {this} rankOption = "friends"/>;
                } else {
                    return <this.RenderSessions context = {this} rankOption = "city"/>;
                }
            })()}

          <View style={{paddingBottom:10}}></View>
        </ScrollView>

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
  // paddingBottom:0.07*h
},

title: {
  color: 'white',
  fontSize:32,
  fontFamily: 'Poppins_700Bold',
},
subtitle1: {
  color: 'white',
  fontSize:22,
  fontFamily: 'Poppins_700Bold'
},
subtitle2: {
  color: '#009BDB',
  fontSize:21,
  fontFamily: 'Poppins_700Bold',
  marginTop:-10
},
sessionTitleLarge: {
  color: '#3E67D6',
  fontSize:25,
  fontFamily: 'Poppins_700Bold'
},
sessionTitle: {
  color: '#3E67D6',
  fontSize:17,
  fontFamily: 'Poppins_300Light',
  marginTop:0
},
onlineTitleActive: {
  color: 'black',
  fontSize:20,
  fontFamily: 'Poppins_700Bold',
  marginRight:0.08*w
},

onlineTitle: {
  display:'none'
},

deleteActive: {
  display:'flex'
},

delete: {
  display:'none'
},

mainTab: {
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems: 'center',
  backgroundColor:'#EFF3FF',
  width: 0.96 * w,
  height:127,
  // paddingHorizontal:0.05 * w,
  // paddingVertical: 0.03 * h,
  borderRadius:10,
  marginTop:0.02 * h,
  
},
icon: {
  resizeMode:'stretch',
  flex:1
},
userStatusBox: {
  flexDirection:'row', 
  backgroundColor:"#2A2E43",
  // marginTop:10, 
  paddingHorizontal:0.05*w,
  justifyContent: 'space-between'
},
sessionBox: {
    flexDirection:'row', 
    justifyContent: 'space-between',
},
sessionBox2: {
  flexDirection:'row', 
  justifyContent: 'space-between',
  backgroundColor: '#EFF3FF',
  borderRadius: 50,
  height: 48,
  marginHorizontal: w * 0.02,
  paddingVertical:5,
},
sessionBox3: {
    flexDirection:'row', 
    justifyContent: 'space-between',
    height: 48,
    marginHorizontal: w * 0.05,
    paddingVertical: h*0.02,
  },
// Big button with purple background
button: {
//   backgroundColor: '#474BD9',
  alignItems: "center",
  justifyContent: 'center',
  borderRadius: 50,
  height: 38,
  marginHorizontal: w * 0.02,
  marginBottom:15,
//   paddingHorizontal: 20,
  flex:1

},
buttonPress: {
  backgroundColor: '#474BD9',
  alignItems: "center",
  justifyContent: 'center',
  borderRadius: 50,
  height: 38,
  marginHorizontal: w * 0.02,
  marginBottom:15,
  paddingHorizontal: 20,
  flex:1
  // transform: [{ scale: 1.1 }]

},
button2: {
    alignItems: "center",
    justifyContent: 'center',
    height: 38,
    marginHorizontal: w * 0.05,
    marginBottom:15,
    flex:1,
},
button2Press: {
    // backgroundColor: '#474BD9',
    borderBottomWidth: 3,
    borderColor: "#474BD9",
    alignItems: "center",
    justifyContent: 'center',
    height: 38,
    marginHorizontal: w * 0.05,
    marginBottom:15,
    flex:1,
    // transform: [{ scale: 1.1 }]

},
// button text
buttonText: {
  color: '#A8A8A8',
  fontSize: 15,
  fontFamily: 'Poppins_700Bold',
},
//the one for "today" "week" "month"
buttonTextFilter: {
    color: '#A8A8A8',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
},
buttonTextFilterActive: {
    color: '#474BD9',
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
},
buttonTextActive: {
  color: '#EFF3FF',
  fontSize: 15,
  fontFamily: 'Poppins_700Bold',
},
rankingText: {
    color: '#EFF3FF',
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
},
image: {
  width:"100%",
  height:"auto",
  transform: [{ scale: 0.9 }],
  // height:50,
  resizeMode:'stretch',
  flex:1,
  marginLeft:0
},
friendsContainer: {
  display:"none" 
},
friendsContainerActive: {
    
},
cityContainer: {
    display:"none" 
},

cityContainerActive: {
    
}


});

export default RankingBody;