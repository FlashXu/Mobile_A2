import React, { Component }  from 'react';
import { Dimensions } from 'react-native';
import { Image, Modal, StyleSheet,Text, View, TouchableOpacity } from 'react-native';
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

        //Request User Info from server
        userFirstName:'Minghui',
        userProfileImg: require('../assets/man-user.png'),

        //Request All Posts created by the friend of this user from server
        trainingSessions: [
          { postId:'123',
            dateOfPost:'25/10',
            userName:'Minghui',
            content:'This is my favourate route.',
            thumbUp:true,
            thumbUps:23, 
            mapImage:require('../assets/map1.png'),
            comments:[{date:'25/10',name:'Minghui',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Minghui',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
          },
          { postId:'1234',
            dateOfPost:'25/10',
            userName:'Jiawei',
            content:'This is my favourate route.',
            thumbUp:false,
            thumbUps:23, 
            mapImage:require('../assets/map1.png'),
            comments:[{date:'25/10',name:'Minghui',content:'I like this, very nice1!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
          },
          { postId:'12345',
            dateOfPost:'25/10',
            userName:'Yangye',
            content:'This is my favourate route.',
            thumbUp:true,
            thumbUps:23, 
            mapImage:require('../assets/map1.png'),
            comments:[{date:'25/10',name:'Yizi',content:'I like this, very nice2!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
          },
          { postId:'123456',
            dateOfPost:'25/10',
            userName:'Ruocheng',
            content:'This is my favourate route.',
            thumbUp:false,
            thumbUps:23, 
            mapImage:require('../assets/map1.png'),
            comments:[{date:'25/10',name:'Yizi',content:'I like this, very nice3!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Jiawei',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')},{date:'25/10',name:'Yichao',content:'I like this, very nice!',profileImg:require('../assets/man-user.png')}]
          },
        ]
      } 
  }

  //submit comment
  submitComment() {
    //append comment to array
    let postId = this.state.currentOverlayPostId;
    let posts = this.state.trainingSessions;
    let post = this.state.trainingSessions.filter( (e) => {return (e.postId===postId);} )[0];

    //format today's date
    let date = new Date();
    let formattedDate = Moment(date).format('DD/MM');

    //content of comment
    let newCommentContent = '';
    
    if (this.state.newCommentContent) {
      //push comment into comments
      let newComment = {
        content:this.state.newCommentContent,
        date:formattedDate,
        name:this.state.userFirstName,
        profileImg:this.state.userProfileImg
      }
      post.comments.push(newComment);
    }

    for (let i in posts) {
      if (posts[i].postId === postId) {
        posts[i] = post;
      }
    }

    // save comment into the list
    this.setState({trainingSessions:posts}, ()=>{
        
        //this.state.trainingSessions Object is updated, send request to update server database
        //-------------------------------Request----------------------------------





        //-------------------------------Request----------------------------------

        this.setState({newCommentContent:'',showCommentEditor:false});
      }
    )
  }

  //Function for each tab being pressed
  sessionOnPress() {

  }

  thumbUpAnimation(i) {
    this.setState({thumbUpIndex:i});
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
                  <Text style={styles.sessionTitle}>{trainingSessions[i].content}</Text>

                  <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:2}}>

                    <TouchableOpacity 
                      style={{flex:1,justifyContent:'center',flexDirection:'row',alignItems:'center'}} 
                      onPress={()=> { 
                        if (postId) {
                          context.setState(()=>{return {showCommentEditor:!context.state.showCommentEditor}})
                        } else {
                          context.setState({currentOverlayPostId:trainingSessions[i].postId,modalVisible:true});
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
          <ScrollView>
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
                            <FontAwesome onPress={()=>this.submitComment()} style={styles.sendButton} name="send" size={26} color="rgba(74, 74, 74, 0.9)" />
                          </View>
                        );
                    } 
                })()}

                <ScrollView>
                  <this.RenderComments context = {this} postId={this.state.currentOverlayPostId} />
                  <View style={{paddingBottom:10}}></View>
                </ScrollView>
              </View>
            </View>
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
      flex: 1
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
    marginTop:0
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
    height:145,
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
    fontSize: 14,
    color: '#333'
  },
  sendButton:{
    position:'absolute',
    bottom:5,
    left:5
  }
  


});

export default ShareBody;