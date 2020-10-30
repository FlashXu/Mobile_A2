import React, { Component }  from 'react';
import { Dimensions, AsyncStorage } from 'react-native';
import { Image, ActivityIndicator, Modal, StyleSheet,Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import Textarea from 'react-native-textarea';
import Moment from 'moment';


class ShareBody extends Component {
  constructor(props) {
      super(props)
      this.navigation = props.navigation;
      this.handler = props.handler;

      //-------------如遇到页面不更新的问题，建议在componentDidMount()中发请求加载数据,不需要设置pageObj-----------------------------
      //--------------not recommand to put request and setState here--------------------------------------
      this.state = {
        modalVisible: false,
        currentOverlayPostId: '',
        newCommentContent:'',
        thumbUpIndex:-1,
        showAddCommentDialog:false,
        showCommentEditor:false,
        pageLoading:true,

        //Request User Info from server
        userName:'',
        userProfileImg: require('../assets/man-user.png'),

        //Request All Posts created by the friend of this user from server
        trainingSessions:[]
        // trainingSessions: [
        //   { postId:'123',
        //     dateOfPost:'25/10',
        //     userName:'Minghui',
        //     content:'This is my favourate route.',
        //     thumbUp:true,
        //     thumbUps:23, 
        //     mapImage:require('../assets/map1.png'),
        //     comments:[{date:'25/10',name:'Minghui',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Minghui',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
        //   },
        //   { postId:'1234',
        //     dateOfPost:'25/10',
        //     userName:'Jiawei',
        //     content:'This is my favourate route.',
        //     thumbUp:false,
        //     thumbUps:23, 
        //     mapImage:require('../assets/map1.png'),
        //     comments:[{date:'25/10',name:'Minghui',content:'I like this, very nice1!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
        //   },
        //   { postId:'12345',
        //     dateOfPost:'25/10',
        //     userName:'Yangye',
        //     content:'This is my favourate route.',
        //     thumbUp:true,
        //     thumbUps:23, 
        //     mapImage:require('../assets/map1.png'),
        //     comments:[{date:'25/10',name:'Yizi',content:'I like this, very nice2!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
        //   },
        //   { postId:'123456',
        //     dateOfPost:'25/10',
        //     userName:'Ruocheng',
        //     content:'This is my favourate route.',
        //     thumbUp:false,
        //     thumbUps:23, 
        //     mapImage:require('../assets/map1.png'),
        //     comments:[{date:'25/10',name:'Yizi',content:'I like this, very nice3!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
        //   },
        // ]
      } 
      this.componentDidMount();
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

  componentDidMount(){
    var getDBdata = this.GET;
    var pageObj = this;
    // 先获取用户id
    this.getID().then(function(id){
      if (id != null){
        var url_personal_info = 'http://www.mobileappproj.ml:5000/personal_info?id=' + id;
        getDBdata(url_personal_info).then(function(res){
          if(res.resp == 200){
            var user_name = res.list_info[0].first_name + ' ' + res.list_info[0].last_name;
            pageObj.setState({userName: user_name});
          }
        });
        var url = 'http://www.mobileappproj.ml:5000/moments/friends_moments?id=' + id;
        getDBdata(url).then(function(res){
          // 更新state
          // { postId:'123456',
          //   dateOfPost:'25/10',
          //   userName:'Ruocheng',
          //   content:'This is my favourate route.',
          //   thumbUp:false,
          //   thumbUps:23, 
          //   mapImage:require('../assets/map1.png'),
          //   comments:[{date:'25/10',name:'Yizi',content:'I like this, very nice3!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
          // }
          var moments_list = res.moments_list;
          var moments_info = [];
          for (let i = 0; i < moments_list.length; i++){
            var info_dict = {};
            var moment = moments_list[i];
            info_dict.postId = moment._id;
            info_dict.dateOfPost = moment.time;
            info_dict.userName = moment.first_name + ' ' + moment.last_name;
            info_dict.content = moment.contents;
            var like_list =  moment.like_list;
            if(like_list.indexOf(id) != -1){
              info_dict.thumbUp = true;
            }else{
              info_dict.thumbUp = false;
            }
            info_dict.thumbUps = moment.like_num;
            info_dict.mapImage = require('../assets/map1.png');
            info_dict.comments = [];
            if (moment.comments.length > 0){

              for(let j = 0; j < moment.comments.length; j++){
                //   comments:[{date:'25/10',name:'Yizi',
                // content:'I like this, very nice3!',
                // profileImg:require('../assets/man-user.png')}
                var user_comment = {};
                user_comment.date = moment.comments[j].time;
                user_comment.name = moment.comments[j].first_name + ' ' + moment.comments[j].last_name;
                user_comment.content = moment.comments[j].contents;
                user_comment.profileImg = require('../assets/man-user.png');
                info_dict.comments.push(user_comment);
              }
            }
            moments_info.push(info_dict)   
          }
          pageObj.setState({trainingSessions:moments_info,pageLoading:false});          
        });
      }
    }, getDBdata, pageObj);

  }

  //submit comment
  submitComment() {
    //append comment to array
    let postId = this.state.currentOverlayPostId;
    let postIndex = this.state.currentPostIndex;
 
    //format today's date
    let date = new Date();

    // 发送comment到服务器
    var current_time = Moment(date).format('YYYY-MM-DD HH:mm:ss');
    var pageObj = this;
    var opDBdata = this.bodyOperation;
    this.getID().then((id) => {
      if(id != null){
        var data = JSON.stringify({
          "_id": postId,
          "user_id": id,
          "time":current_time,
          "contents":pageObj.state.newCommentContent
        });
        var url = 'http://www.mobileappproj.ml:5000/moments/comment';
        opDBdata(url, data, 'POST').then((res) => {
          if(res == 404){
            alert('There is no such a moment, please fresh again!');
          }else{
            alert('Having successfully sent the comment.');
            // 更新state
            var current_posts = pageObj.state.trainingSessions;
            var user_comment = {};
            user_comment.date = current_time;
            user_comment.name = pageObj.state.userName;
            user_comment.content = pageObj.state.newCommentContent;
            user_comment.profileImg = require('../assets/man-user.png');
            current_posts[postIndex].comments.push(user_comment);
            pageObj.setState({trainingSessions: current_posts, showCommentEditor: false, newCommentContent: ''});
          }
        });
      }
    }, opDBdata, postIndex, postId, current_time, pageObj);
  }

  //Function for each tab being pressed
  sessionOnPress() {

  }

  // Like operation
  thumbUpAnimation(i) {
    this.setState({thumbUpIndex:i});

    var moment_id = this.state.trainingSessions[i].postId;
    var opDBdata = this.bodyOperation;
    var pageObj = this;
    var type = '';

    if(this.state.trainingSessions[i].thumbUp){
      // dislike
      type = 'dislike';
      
    }else{
      // like
      type = 'like';
    }

    this.getID().then(function(id){
      if (id != null){
        var url = 'http://www.mobileappproj.ml:5000/moments/like';
        var data = JSON.stringify({
              "_id": moment_id,
              "user_id": id,
              "type": type
          });
        opDBdata(url, data, 'POST');
      }
    }, moment_id, type, opDBdata, pageObj); 


    setTimeout(()=>this.setState({thumbUpIndex:-1}),100);
  }

  //display all sessions that a user has
  RenderSessions(props) {
    let context = props.context;
    let trainingSessions = [];
    let postId = props.postId;
    if (postId) {
      trainingSessions = context.state.trainingSessions.filter( (e) => {return (e.postId===postId);} );
    } else {
      trainingSessions = context.state.trainingSessions;
    }
    return (
      <View>
        {
          trainingSessions.map((value,i)=>{
            return (
              <TouchableOpacity onPress={context.sessionOnPress.bind(context)} style={styles.mainTab} key={i}>
                <View style={{flex:1, alignItems:"center"}}>
                  <Image source={trainingSessions[i].mapImage} style={styles.image} />
                </View>
                
                <View style={{flex:2,marginLeft:20}}>
                  <Text style={styles.sessionTitleLarge}>{trainingSessions[i].userName}</Text>
                  <Text style={styles.date}>{trainingSessions[i].dateOfPost}</Text>

                  <View style={{flex:1}}>
                    <ScrollView nestedScrollEnabled = {true}>
                    <Text style={styles.sessionTitle}>{trainingSessions[i].content}</Text>
                  </ScrollView>
                  </View>

                  <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:2}}>

                    <TouchableOpacity 
                      style={{flex:1,justifyContent:'center',flexDirection:'row',alignItems:'center'}} 
                      onPress={()=> { 
                        if (postId) {
                          context.setState(()=>{return {showCommentEditor:!context.state.showCommentEditor}})
                        } else {
                          context.setState({currentOverlayPostId:trainingSessions[i].postId,modalVisible:true, currentPostIndex:i});
                        }
                      }}>
                      <MaterialCommunityIcons style={{flex:1}} name="comment-text-outline" size={30} color={context.state.showCommentEditor? 'rgba(74, 74, 74, 0.9)' :'black'} />
                      <Text style={styles.text}>{trainingSessions[i].comments.length}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={{flex:1,justifyContent:'center',flexDirection:'row',alignItems:'center'}} 
                      onPress={(prev)=> {context.setState(()=>{ 
                        let postId = trainingSessions[i].postId;
                        let sessions = context.state.trainingSessions;
                        if (trainingSessions[i].thumbUp) {
                          for (let i in sessions) {
                            if (sessions[i].postId === postId) {
                                sessions[i].thumbUp = false;
                                sessions[i].thumbUps -= 1;
                                break;
                            }
                          }
                        } else {
                          for (let i in sessions) {
                            if (sessions[i].postId === postId) {
                                sessions[i].thumbUp = true;
                                sessions[i].thumbUps += 1;
                                break;
                            }
                          }
                        }
                        return {trainingSessions: sessions} 
                      }); context.thumbUpAnimation(i)}}
                    >
                      <MaterialCommunityIcons 
                        style={context.state.thumbUpIndex === i ? styles.thumbActive : styles.thumb} 
                        name="thumb-up-outline" 
                        size={30} 
                        color={trainingSessions[i].thumbUp ? '#FAAC2E' : 'black'} 
                      />
                      <Text style={context.state.thumbUpIndex === i ? styles.textActive : styles.text}>{trainingSessions[i].thumbUps}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
              );
            })
          }
        </View>
      )
  }


  //display all Comments that a session contains
  RenderComments(props) {
    let context = props.context;
    let session = {};
    let comments = [];
    let postId = props.postId;

    session = context.state.trainingSessions.filter((e) => {return (e.postId===postId);})[0];
    comments = session.comments;
    return (
      <View>
        {
          comments.map((value,i)=>{
            return (
              <TouchableOpacity style={styles.commentTab} key={i}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}> 
                  <View style={{flex:1,alignItems:'center'}}>
                    <Image source={comments[i].profileImg} style={styles.avatar} />
                  </View>
                  <View style={{flex:2}}>
                    <Text style={styles.commentPerson}>{comments[i].name}</Text>
                    <Text style={styles.commentContent}>{comments[i].content}</Text>
                    <Text style={styles.date}>{comments[i].date}</Text>
              </View>

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

          <Text style = {styles.title}>Share</Text>

          <ActivityIndicator 
                      style={this.state.pageLoading ?  {display:'flex',marginTop:'20%'} : {display:'none',marginTop:'20%'}}
                      size="large" 
                      color="white" 
          />

          <ScrollView nestedScrollEnabled = {true}>
            <this.RenderSessions context = {this} postId='' />
            <View style={{paddingBottom:10}}></View>
          </ScrollView>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible:false})
            }}
            style={{backgroundColor:'black'}}
          >
            <TouchableOpacity 
            style={styles.container} 
            activeOpacity={1} 
            onPress={() => this.setState({modalVisible:false})}
          >
          </TouchableOpacity>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>

                <View style={styles.topBar}>
                  <Text style={styles.text2}>
                    Latest Comments
                  </Text>
                  <TouchableOpacity style={styles.deleteIcon} onPress={() => this.setState({modalVisible: false, showCommentEditor:false})} >
                    <FontAwesome name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <this.RenderSessions context = {this} postId={this.state.currentOverlayPostId} />

                {(() => {
                    if (this.state.showCommentEditor) {
                        return (
                          <View style={{alignItems:'flex-start'}}  >
                            <Textarea
                              containerStyle={styles.textareaContainer}
                              style={styles.textarea}
                              onChangeText={text => this.setState({newCommentContent:text})}
                              defaultValue={this.state.newCommentContent}
                              maxLength={50}
                              placeholder={'Enter Comment here'}
                              placeholderTextColor={'#c7c7c7'}
                              underlineColorAndroid={'transparent'}
                            />
                            <FontAwesome onPress={()=>this.submitComment()} style={styles.sendButton} name="send" size={32} color="rgba(74, 74, 74, 0.9)" />
                          </View>
                        );
                    } 
                })()}

                <ScrollView nestedScrollEnabled = {true}>
                  <this.RenderComments context = {this} postId={this.state.currentOverlayPostId} />
                  <View style={{paddingBottom:10}}></View>
                </ScrollView>
              </View>
            </View>
            <TouchableOpacity 
            style={styles.container} 
            activeOpacity={1} 
            onPress={() => this.setState({modalVisible:false})}
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
  container : {
      flex: 0.15,
      // height:30
  },
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
  commentTab: {
    alignItems: 'center',
    backgroundColor:'#EFF3FF',
    width: 0.96 * w,
    height:110,
    paddingVertical:10,
  },
  // button text
  buttonText: {
    color: '#3E67D6',
    fontSize: 25,
    fontFamily: 'Poppins_300Light',
    paddingTop: "1%",
  },
  sessionTitle: {
    color: '#3E67D6',
    fontSize:16,
    fontFamily: 'Poppins_300Light',
    marginTop:0,
    // height:100
    // overflow:'scroll',
    // maxHeight:50
    // flexWrap:'wrap'
  },
  sessionTitleLarge: {
    color: '#3E67D6',
    fontSize:24,
    fontFamily: 'Poppins_700Bold',
    marginBottom:-5
  },
  mainTab: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#EFF3FF',
    width: 0.96 * w,
    height:175,
    paddingHorizontal:0.05 * w,
    // paddingVertical: 0.03 * h,
    borderRadius:10,
    marginTop:0.02 * h
  },
  image: {
    resizeMode:'stretch',
    flex:1
  },
  thumb: {
    flex:1
  },
  thumbActive: {
    flex:1,
    transform: [{ scale: 1.3 }]
  },
  text: {
    flex:2,
    fontSize: 17,
    fontFamily: 'Poppins_300Light',

  },
  textActive: {
    flex:2,
    fontSize: 17,
    fontFamily: 'Poppins_300Light',
    backgroundColor:'transparent',
    left:15,
    transform: [{ scale: 1.3 }]

  },
  text2: {
    fontSize: 17,
    fontFamily: 'Poppins_700Bold',
    flex:1
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:98,
    marginTop:25,
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  deleteIcon: {
    width:100,
    alignItems:'flex-end',
    position:'relative',
    flex:1
  },
  topBar:{
    width:0.95*w,
    // backgroundColor:'black'
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:10,
    paddingHorizontal:10,
    marginBottom:-10
  },
  overlay:{
  },
  avatar: {
    width: 80,
    height: 80,
    transform: [{ scale: 1 }],
    // height:50,
    resizeMode:'stretch',
    flex:1,
    marginLeft:0
  },
  commentPerson: {
    color:'#474BD9',
    fontFamily: 'Poppins_700Bold',
    fontSize:17
  },
  commentContent: {
    fontFamily:'Poppins_300Light',
    fontSize:14
  },
  date: {
    fontFamily:'Poppins_300Light',
    fontSize:14
  },
  textareaContainer: {
    height: 0.12 * h,
    width:0.95*w,
    padding: 5,
    // backgroundColor: '#F5FCFF'
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
    height: 70,
    fontSize: 20,
    color: '#333'
  },
  sendButton:{
    position:'absolute',
    bottom:5,
    left:5
  }
  


});

export default ShareBody;