import React, { Component }  from 'react';
import { Alert, Dimensions } from 'react-native';
import {Image, ScrollView, StyleSheet, Text, View, TouchableOpacity,ActivityIndicator  } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons';
import DialogInput from 'react-native-dialog-input';
import { AntDesign } from '@expo/vector-icons';


class FriendsBody extends Component {
  constructor(props) {
    super(props)
    this.navigation = props.navigation;
    this.handler = props.handler;

    //-------------如遇到页面不更新的问题，建议在componentDidMount()中发请求加载数据,不需要设置pageObj-----------------------------
    //--------------not recommand to put request and setState here--------------------------------------
    this.state = {
      totalDistance:20.8,
      avgSpeed:6.2,
      totalSessions:5,
      showAddDialog:false,
      showDeleteButton:false,
      friends:[
        {Id:"123", totalDistance:6,avgSpeed:5,sessionsComplete:3,name:'Frend1',status:'online'},
        {Id:"1234", totalDistance:6,avgSpeed:5,sessionsComplete:3,name:'Frend2',status:'running'},
        {Id:"12345", totalDistance:6,avgSpeed:5,sessionsComplete:3,name:'Frend3',status:'offline'},
        {Id:"123456", totalDistance:6,avgSpeed:5,sessionsComplete:3,name:'Frend4',status:'running'},
        {Id:"1234567", totalDistance:6,avgSpeed:5,sessionsComplete:3,name:'Frend5',status:'online'},
      ]
    }
}
// Delete a friend
deleteFriend(i) {
  let friendName = this.state.friends[i].name
  let Id = this.state.friends[i].Id
  //promt user to comfirm
  Alert.alert(
    "Delete",
    `Do you want to delete ${friendName} ?`,
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "OK", onPress: () => {

        this.setState((prev)=>{
          prev.friends[i].status = 'removed';
          return {friends: prev.friends}
        }, ()=>{
          this.confirmDeleteFriend(Id)
        })
        
      }}
    ],
    { cancelable: false }
  );
}

//send query to delete this friend
confirmDeleteFriend(Id) {
  //test only 模拟两秒延迟
  setTimeout(()=> {
    //remove UI element after deletion success (callback from request)
    this.removeUI(Id);
  }, 2000)
  //test only


}

removeUI(Id) {
  let newFriendList = this.state.friends.filter( (f)=> {return (f.Id !== Id); } );
  this.setState({
    friends: newFriendList
  })
}



//action after user submit friend name
addFriend(friendName) {
  console.log(friendName);
  let emailFound = false;
  //send query to find the user


  //if a friend's email is found, perform add friend request
  if (emailFound) {





    this.setState({showAddDialog:false})
  }
  


  //if the email is not found
  if (!emailFound) {
    alert("Email not found");
  }
}

navRanking() {
  this.setState({showDeleteButton:false});
  this.handler('ranking')
}

//display all sessions that a user has
RenderSessions(props) {
  let context = props.context;
  let friends = context.state.friends;
  var rows = [];
  let RunnerIcon = <FontAwesome5 name="running" size={24} color="black" />;


  
  return (
    <View>
      {
        friends.map((value,i)=>{
          return (
              <TouchableOpacity style={styles.mainTab} key={i}>
              {/* <View style={styles.sessionBox}> */}
                <View style={{flex:1}}>
                <Image source={require('../assets/man-user.png')} style={styles.image} />
                </View>
                <View style={{flex:2}}>
                  <View style={styles.sessionBox}> 
                    <Text style={styles.sessionTitleLarge}> {friends[i].name} </Text>
                    <Text style={context.state.showDeleteButton ? styles.onlineTitle : styles.onlineTitleActive}> {friends[i].status === 'online' ? 'online' : (friends[i].status === 'offline' ? '':<MaterialCommunityIcons name="run-fast" size={30} color="red" />)} </Text>
                    <AntDesign 
                      name="deleteuser" 
                      size={44} 
                      color="red" 
                      style={context.state.showDeleteButton && context.state.friends[i].status!=='removed' ? styles.deleteActive : styles.delete} 
                      onPress={() => context.deleteFriend(i)}
                    />
                    <ActivityIndicator 
                      style={context.state.friends[i].status==='removed' ?  styles.deleteActive : styles.delete}
                      size="large" 
                      color="black" 
                    />
                  </View>
                  
                  <Text style={styles.sessionTitle}>Total Distance: {friends[i].totalDistance} km</Text>
                  <Text style={styles.sessionTitle}>Average Speed: {friends[i].avgSpeed} m/s</Text>
                  <Text style={styles.sessionTitle}>Sessions Complete: {friends[i].sessionsComplete} </Text>
                </View>
                
              {/* </View> */}
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
        
        <Text style = {styles.title}>Friends</Text>

        <View style={styles.sessionBox}>
          <TouchableOpacity onPress={()=>this.setState({showAddDialog:true,showDeleteButton:false})} style={this.state.LogInButton ? styles.buttonPress : styles.button}>
              <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> this.setState((state) => { return {showDeleteButton: !state.showDeleteButton }}) } style={this.state.showDeleteButton ? styles.buttonPress : styles.button}>
              <Text style={ this.state.showDeleteButton ? styles.buttonTextActive : styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> this.navRanking()} style={this.state.LogInButton ? styles.button2Press : styles.button2}>
              <Text style={styles.buttonText}>Ranking</Text>
          </TouchableOpacity>
        </View>

        <DialogInput isDialogVisible={this.state.showAddDialog}
            title={"Add a friend"}
            message={"Enter your friend's Email"}
            hintInput ={"Email"}
            submitInput={ (inputText) => {this.addFriend(inputText)} }
            closeDialog={ () => {this.setState({showAddDialog:false})}}>
            
        </DialogInput>

        <ScrollView>
          

          <this.RenderSessions context = {this} />
            
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
  color: 'green',
  fontSize:20,
  fontFamily: 'Poppins_700Bold'
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
// button text
buttonText: {
  color: '#3E67D6',
  fontSize: 25,
  fontFamily: 'Poppins_300Light',
  paddingTop: "1%",
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
  justifyContent: 'space-between'
},
// Big button with purple background
button: {
  backgroundColor: '#474BD9',
  alignItems: "center",
  justifyContent: 'center',
  borderRadius: 50,
  height: 38,
  marginHorizontal: w * 0.02,
  marginBottom:15,
  paddingHorizontal: 20,
  flex:1

},
buttonPress: {
  backgroundColor: '#7276F4',
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
  backgroundColor: '#E3A42D',
  alignItems: "center",
  justifyContent: 'center',
  borderRadius: 50,
  height: 38,
  marginHorizontal: w * 0.02,
  marginBottom:15,
  paddingHorizontal: 20,
  flex:1

},
button2Press: {
  backgroundColor: '#E3A42D',
  alignItems: "center",
  justifyContent: 'center',
  borderRadius: 50,
  height: 38,
  marginHorizontal: w * 0.02,
  marginBottom:15,
  paddingHorizontal: 20,
  flex:1,
  transform: [{ scale: 1.1 }]

},
// button text
buttonText: {
  color: '#FFFFFF',
  fontSize: 15,
  fontFamily: 'Poppins_700Bold',
},
buttonTextActive: {
  color: '#E3A42D',
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

});

export default FriendsBody;