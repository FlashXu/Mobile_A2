import React, { Component }  from 'react';
import { Dimensions, AsyncStorage} from 'react-native';
import { Image, Modal, StyleSheet, Alert, Text, View,ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import Textarea from 'react-native-textarea';
import Moment from 'moment';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import * as Permissions from 'expo-permissions';
import MapView, { 
  Polyline,
} from "react-native-maps";
class ProfileBody extends Component {
    constructor(props) {
        super(props)
        this.navigation = props.navigation;
        var getDBdata = this.GET;
        var opDBdata = this.bodyOperation;
        var storeinfo = this.storeData;
        var pageObj = this;
        
        
        // var downloadImg = this.downloadPhoto;
        
        // 获取personal info并保存
        //-------------如遇到页面不更新的问题，建议在componentDidMount()中发请求,不需要设置pageObj-----------------------------
        //--------------not recommand to put request and setState here--------------------------------------
        this.getID().then(function(id){
          if(id!=null){
            var url = 'http://www.mobileappproj.ml:5000/personal_info?id=' + id;
            getDBdata(url).then(function(res){
              if(res.resp == 404){
                alert('There is no such profile!');
              }else{
                var profile_list = res.list_info;
                if(profile_list.length > 0 ){
                  var profile = JSON.stringify(profile_list[0]);
                  var user_id = profile_list[0]._id;
                  var user_gender = profile_list[0].gender;
                  var user_email = profile_list[0].email;
                  var user_first_name = profile_list[0].first_name;
                  var user_last_name = profile_list[0].last_name;
                  var imgUri = 'http://www.mobileappproj.ml:5000/attachments/personal_info/' + user_id + '/photo.jpg';
                  if(profile_list[0].hasOwnProperty('photoURL')){
                    var profile_img = {uri: profile_list[0].photoURL}
                  }else{
                    var profile_img = profile_list[0].hasOwnProperty('_attachments')? {uri:imgUri}:require("../assets/runningguys-v1.png");
                  }
                  
                  pageObj.setState({
                    id:user_id,
                    email:user_email,
                    gender:user_gender,
                    first_name:user_first_name,
                    last_name:user_last_name,
                    profile_img: profile_img
                  });
                  storeinfo('@profile', profile);
                }
              }
            })
          }}, storeinfo, getDBdata, pageObj);

        // 获取running distance并保存
        this.getID().then(function(id){
          if(id!=null){
            var url = 'http://www.mobileappproj.ml:5000/distance?id=' + id;
            getDBdata(url).then(function(res){
              if(res.resp == 404){
                alert('There is no such a distance record!');
              }else{
                var distance_list = res.record_detail;
                if(distance_list.length > 0){
                  var distance = JSON.stringify(distance_list[0]);
                  var user_completed_sessions = distance_list[0].completed_sessions;
                  var user_total_sessions = distance_list[0].total_sessions;
                  var user_total_distance= distance_list[0].total_distance;
                  var user_daily_distance = distance_list[0].daily_distance;



                  pageObj.setState({
                    completed_sessions:user_completed_sessions,
                    totalSessions:user_total_sessions,
                    totalDistance:user_total_distance,
                    daily_distance:user_daily_distance
                  });
                  // 测试是否已成功存入state
                  // alert(pageObj.state.total_distance);
                  storeinfo('@running_distance', distance);
                }
              }
            })
          }}, storeinfo, getDBdata, pageObj);

        // 获取running record并保存
        this.getID().then(function(id){
          if(id!=null){
            var url = 'http://www.mobileappproj.ml:5000/running_record/query';
            var data = JSON.stringify({
              "query_key":[[id], [id +'CHANGE']]
            }); 

            opDBdata(url, data,'POST').then(function(res){
              if(res.resp == 404){
                alert('There is no running records!');
              }else{
                var record_list = res.record_detail;

                if(record_list.length > 0){
                  // Set ave speed to be the latest ave. speed.
                  pageObj.setState({avgSpeed: record_list[0].ave_speed});
                  var record = JSON.stringify(record_list);
                  storeinfo('@running_record', record);
                  var user_running_records = [];
                  for(let i = 0; i < record_list.length; i++){
                    var running_record_item = record_list[i];
                    var record_structure = {
                      id: record_list[i]._id,
                      totalDistance:record_list[i].distance,
                      avgSpeed:record_list[i].ave_speed,
                      time:record_list[i].start_time,
                      status:record_list[i].status,
                      mapImage:require('../assets/map1.png'),

                    }
                    user_running_records.push(record_structure);
                  }
                  pageObj.setState({trainingSessions: user_running_records})
                  // 测试是否已成功存入state
                  //alert(JSON.stringify(pageObj.state.running_records[0]));

                }
              }
            })
          }}, storeinfo, opDBdata, pageObj);
        
        
        
          this.state = {
          postSessionEditor: false,
          totalDistance:0,
          avgSpeed:0,
          totalSessions:0,
          trainingSessions:[
            {id:'None', totalDistance:'None',avgSpeed:'None',dateOfCompletion:'None',mapImage:require('../assets/map1.png')}
          ],
          coordinates :[],
          coordinatesLoaded : false,
          showMap :false,
          loadingMap: false,
        }
    }

    popUpMap(value) {

      // alert("Map for " + value.id);
      this.setState({loadingMap:true})
      
      this.get_attachments('running_record', value.id, 'coordinate.json').then((res) => {
        if(res == null){
          alert('There is no coordinate data.');
          this.setState({loadingMap:false});
        }else if(res.hasOwnProperty('resp')){
          alert('There is no coordinate data.');
          this.setState({loadingMap:false});
        }else{
          for(i=0;i<res.coordinate.length;i++){
            var currentPosition = {latitude:res.coordinate[i][1],longitude:res.coordinate[i][0]} ;
            this.setState({coordinates: this.state.coordinates.concat([currentPosition])})
          }
          this.setState({coordinatesLoaded: true, loadingMap:false, showMap: true});
        }
      });
      
    }

    // // 图片存至本机相册
    // saveFile = async (fileUri) => {
    //   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //   if (status === "granted") {
    //       const asset = await MediaLibrary.createAssetAsync(fileUri)
    //       await MediaLibrary.createAlbumAsync("Download", asset, false)
    //   }
    // }

    // // 下载文件
    // async downloadPhoto(id){
    //   // Downloading the file
    //   let fileLocation = FileSystem.documentDirectory + "user_photo.jpg";
    //   var fileUri = await FileSystem.downloadAsync(
    //     'http://www.mobileappproj.ml:5000/attachments/personal_info/' + id + '/photo.jpg',
    //     fileLocation
    //   ).then(({ uri }) => { 
    //       return uri;
    //   }).catch(error => {
    //       console.log(error);
    //   })
    //   return fileUri;
    // }

    // Submit post 
    submitPost() {

      //format today's date
      let date = new Date();
      // let formattedDate = Moment(date).format('DD/MM');

      // let post = { 
      //       dateOfPost:formattedDate,
      //       userName:this.state.first_name,
      //       content:this.state.newPostContent,
      //       thumbUp:false,
      //       thumbUps:0, 
      //       mapImage:require('../assets/map1.png'),
      //       comments:[]
      // }

      //发送moment到服务器
      var current_time = Moment(date).format('YYYY-MM-DD HH:mm:ss');
      var pageObj = this;
      var opDBdata = this.bodyOperation;
      
      this.getID().then((id) => {
        if(id != null){
          var data = JSON.stringify({
            "user_id": id,
            "comments": [],
            "time":current_time,
            "bind_record_id": pageObj.state.currentSessionId,
            "contents":pageObj.state.newPostContent
          });
          var url = 'http://www.mobileappproj.ml:5000/moments';
          opDBdata(url, data, 'POST').then((res) => {
            this.setState({postSessionEditor:false,currentSessionId:'',newPostContent:'',sendingRequest:false});
            alert('Having successfully sent the moment.')});
        }
      }, opDBdata, current_time, pageObj);

      this.setState({sendingRequest:true});
      //Seed request to store data in server
      

      //模拟两秒延迟
      // setTimeout(()=>{
      //   this.setState({postSessionEditor:false,currentSessionId:'',newPostContent:'',sendingRequest:false});
      // },2000)

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
    async getID(){
      try {
          id = await AsyncStorage.getItem('@accountID');
          return id;
      }catch (e) {
          console.error(e);
          return null;
      }
    }
    async get_attachments(db_name, mount_id, attachment_name){
      var url = 'http://www.mobileappproj.ml:5000/attachments/' + db_name + '/' + mount_id + '/' + attachment_name;
      var file = await fetch(url, {
        method: 'GET',
      })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });  
      if (file==null){
        alert(url);
      }
      return file;
    }

    async removeProfile(){
      try {
           // Update online info.
           var url = 'http://www.mobileappproj.ml:5000/online_info';
           var opDBdata = this.bodyOperation;
           await this.getID().then((id) => {
             if(id!=null){
               var data = JSON.stringify({
                 "_id": id,
                 "status": 'offline'
               });
               opDBdata(url, data, 'PUT');
             }
           }, url, opDBdata);
          // 删除所有信息
          await AsyncStorage.removeItem('@accountID');
          await AsyncStorage.removeItem('@profile');
          await AsyncStorage.removeItem('@running_record');
          await AsyncStorage.removeItem('@running_distance');  
      }catch (e) {
          console.error(e);
      }
  }

    logOutUser() {
      //log out user
      this.removeProfile();
      this.navigation.navigate('FrontPage');
    }
    
    logOut() {
      //promt user to comfirm
      Alert.alert(
        "Log Out",
        "Do you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "OK", onPress: () => {
            this.logOutUser();
          }}
        ],
        { cancelable: false }
      );
    }

    // Choose options for different sub pages
    handler(newOption) {
      let value = newOption;
      this.setState({
        option: value
      })
    }

    //display all sessions that a user has
    RenderSessions(props) {
      let context = props.context;
      let trainingSessions = []
      let postId = props.postId;
      let coordinates = []
      
      if (postId) {
        trainingSessions = context.state.trainingSessions.filter( (e) => {return (e.id===postId);});
      } else {
        trainingSessions = context.state.trainingSessions;
      }
      


      return (
        <View>
          <ActivityIndicator 
              style={context.state.loadingMap && !postId ?  styles.text2 : {display:'none'}}
              size="large" 
              color="white" 
          />
          {
            trainingSessions.map((value,i)=>{
              return (
                <TouchableOpacity onPress={()=>context.setState({postSessionEditor:true,currentSessionId:context.state.trainingSessions[i].id})} style={styles.mainTab} key={i}>
                      <View style={{flex:2}}>
                        <Text style={styles.sessionTitleLarge}>Record {(i+1).toString()}</Text>
                        <Text style={styles.sessionTitle}>Total Distance: {trainingSessions[i].totalDistance} km</Text>
                        <Text style={styles.sessionTitle}>Average Speed: {trainingSessions[i].avgSpeed} m/s</Text>
                        <Text style={styles.sessionTitle}>Time: {trainingSessions[i].time}</Text>
                        <Text style={styles.sessionTitle}>Status: {trainingSessions[i].status}</Text>
                      </View>
                      <TouchableOpacity onPress={()=>context.popUpMap(value)} style={{flex:1, alignItems:"center"}}>
                        <Image  source={trainingSessions[i].mapImage} style={styles.image} />
                      </TouchableOpacity>
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
            
            {/* <Text style = {{position:'absolute',color:'white',fontFamily: 'Poppins_300Light',top:5,right:40}}>Logout</Text> */}
            <Ionicons onPress={() => this.logOut()} style={{left:'43%'}} name="md-exit" size={35} color="white" />
            
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10}}>
                <Image source={this.state.profile_img} style={styles.profileImage} />
                <Text style = {styles.title}>{this.state.first_name}</Text>
                {/* <Image source={this.state.profile_image} style={styles.profileImage} /> */}
            </View>
            

            <ScrollView>
              <View style={styles.userStatusBox}>
                  <View style={{flex:1, alignItems:"flex-start", padding:10}}>
                    <Image source={require("../assets/totaldistance2.png")} style={styles.icon,{resizeMode:'stretch',width: 55,height: 50,flex:1}} />

                  </View>

                  <View style={{flex:2,alignItems:"flex-end"}}>
                    <Text style={styles.subtitle1}>Total Distance</Text>
                    <Text style={styles.subtitle2}>{this.state.totalDistance.toFixed(2)} Km</Text>
                  </View>
              </View>

              <View style={styles.userStatusBox}>
                  <View style={{flex:1, alignItems:"flex-start", padding:10}}>
                    <Image source={require("../assets/speedometer2.png")} style={styles.icon} />

                  </View>

                  <View style={{flex:2,alignItems:"flex-end"}}>
                    <Text style={styles.subtitle1}>Average Speed</Text>
                    <Text style={styles.subtitle2}>{this.state.avgSpeed} m/s</Text>
                  </View>
              </View>

              <View style={styles.userStatusBox}>
                  <View style={{flex:1, alignItems:"flex-start", padding:10}}>
                    <Image source={require("../assets/trophy2.png")} style={styles.icon} />

                  </View>

                  <View style={{flex:2,alignItems:"flex-end"}}>
                    <Text style={styles.subtitle1}>Total Sissions</Text>
                    <Text style={styles.subtitle2}> {this.state.totalSessions} </Text>
                  </View>
              </View>

              <this.RenderSessions context = {this} />
                
              <View style={{paddingBottom:10}}></View>
            </ScrollView>


          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.postSessionEditor}
            onRequestClose={() => {
              this.setState({postSessionEditor:false})
            }}
          >
             <TouchableOpacity 
              style={styles.container} 
              activeOpacity={1} 
              onPress={() => this.setState({postSessionEditor:false})}
            >
            </TouchableOpacity>

              
            <View style={styles.centeredView}>


              <View style={styles.modalView}>
              
                <View style={styles.topBar}>
                  <Text style={styles.text2}>
                    Share with friends
                  </Text>
                  <TouchableOpacity style={styles.deleteIcon} onPress={() => this.setState({postSessionEditor: false})} >
                    <FontAwesome name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>


                <this.RenderSessions context = {this} postId={this.state.currentSessionId} />
                
                <View style={{alignItems:'flex-start'}}  >
                
                  <Textarea
                    containerStyle={styles.textareaContainer}
                    style={styles.textarea}
                    onChangeText={text => this.setState({newPostContent:text})}
                    defaultValue={this.state.newPostContent}
                    maxLength={50}
                    placeholder={'Enter Comment here'}
                    placeholderTextColor={'#c7c7c7'}
                    underlineColorAndroid={'transparent'}
                  />
                  <FontAwesome onPress={()=>this.submitPost()} style={this.state.sendingRequest ? styles.hide : styles.sendButton} name="send" size={32} color="rgba(74, 74, 74, 0.9)" />
                  <ActivityIndicator 
                      style={this.state.sendingRequest ?  styles.sendButton : styles.hide}
                      size="large" 
                      color="black" 
                  />
                  
                </View>
              </View>
            </View>







            <TouchableOpacity 
              style={styles.container} 
              activeOpacity={1} 
              onPress={() => this.setState({postSessionEditor:false})}
            >
            </TouchableOpacity>
          </Modal>
          

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showMap}
            onRequestClose={() => {
              this.setState({showMap:false})
            }}
          >

            

            {(() => {
                if (this.state.coordinatesLoaded) {
                    return <TouchableOpacity onPress={()=>this.setState({showMap:false})}>

                        <MapView
                        style={styles.map}
                        region={{
                            latitude: this.state.coordinates[0].latitude,
                            longitude: this.state.coordinates[0].longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                            // latitudeDelta: Math.abs(this.state.coordinates[Math.floor((this.state.coordinates.length)/2)].latitude - this.state.coordinates[0].latitude) * 8,
                            // longitudeDelta: Math.abs(this.state.coordinates[Math.floor((this.state.coordinates.length)/2)].longitude - this.state.coordinates[0].longitude) * 8,
                          
                        }}
                        >
                        <MapView.Marker coordinate={this.state.coordinates[0]} />
                        <MapView.Marker coordinate={this.state.coordinates[this.state.coordinates.length-1]} />
                        <Polyline coordinates={this.state.coordinates} strokeWidth={5} strokeColor="#474BD9"/>
                        </MapView> 

                    </TouchableOpacity>
                  

                } 
            })()}

            <TouchableOpacity 
              style={styles.exitZoom} 
              activeOpacity={1} 
              onPress={() => this.setState({showMap:false})}
            >
            </TouchableOpacity>



          </Modal>

          

        </View> 
      );
    }
}

// Not used yet
const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex:1,
    zIndex:0
  },
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
    flex:4,
    marginLeft:30
    // marginBottom:0.005 * h,
    // flex:4
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
    fontSize:24,
    fontFamily: 'Poppins_700Bold'
  },
  sessionTitle: {
    color: '#3E67D6',
    fontSize:16,
    fontFamily: 'Poppins_300Light',
    marginTop:0
  },

  
  profileImage: {
    alignItems: 'center',
    width: 0.26 * w,
    height:0.26 * w,
    // paddingHorizontal:0.24 * w,
    paddingVertical: 0.03 * h,
    borderRadius: 10,
    borderWidth:2,
    borderColor:'#EFF3FF',
    marginBottom:0.02 * h,
    flex:2,
    // position:'relative',
    // right:'30%'
  },
  mainTab: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#EFF3FF',
    width: 0.96 * w,
    height:145,
    paddingHorizontal:0.05 * w,
    // paddingVertical: 0.03 * h,
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
  icon: {
    resizeMode:'stretch',
    width: 55,
    height: 45,
    flex:1
  },
  image: {
    resizeMode:'stretch',
    flex:1
  },
  userStatusBox: {
    flexDirection:'row', 
    backgroundColor:"#2A2E43",
    // marginTop:10, 
    // paddingHorizontal:0.05*w,
    justifyContent: 'space-between'
  },
  deleteIcon: {
    width:100,
    alignItems:'flex-end',
    position:'relative',
    flex:1
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:0.45*h,
    marginTop:0.1*h
  },
  modalView: {
    backgroundColor: "#EFF3FF",
    borderRadius: 20,
    padding: 5,
    alignItems: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textareaContainer: {
    height: 0.2 * h,
    width:0.95*w,
    padding: 5
    // backgroundColor: '#F5FCFF'
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
    // height: 170,
    fontSize: 20,
    color: '#333'
  },
  sendButton:{
    position:'absolute',
    bottom:5,
    left:5
  },
  topBar:{
    width:0.95*w,
    // backgroundColor:'black'
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:10,
    marginBottom:-10,
    paddingHorizontal:10
  },
  hide:{
    display:'none'
  },
  map: {
    position: 'relative',
    alignItems: "center",
    height: 0.85*h,
  },
  exitZoom: {
    height:0.2 * h
  }

});

export default ProfileBody;