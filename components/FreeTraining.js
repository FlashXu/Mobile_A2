'use strict';
import React, { Component, useState } from 'react';
import Svg, { G,Path } from 'react-native-svg';
import { DangerZone } from 'expo';
import * as encoding from 'text-encoding';
import * as decoding from 'text-decoding';
import Moment from 'moment';
import {
    Dimensions,
    PanResponder,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Alert,
    AsyncStorage
} from 'react-native';
import MapView, { 
    Polyline,
  } from "react-native-maps";


import water from '../assets/water.png';
import salad from '../assets/salad.png';
import mushroom from '../assets/mushroom.png';
import strawberry from '../assets/strawberry.png';
import calculateCalories from '../components/CalculateCalories'
import haversine from "haversine";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;

class FreeTraining extends Component {
    
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = {
            distance: 0,
            time: '00:00:00',
            CurrentSpeed: 0.0,
            Calories: 0,
            coordinates: [],
            secs: 0,
            mins: 0,
            hrs: 0,
            startTime: "00:00:00",
            route: "",
            speed: 0,
            currSpeed: 0,
            test:"no text",
            startRun: true,
            paused: false,
            button: false,
            currentPosition : 0,
            initPosition: 0,
            loading: false,
            // startPos: {latitude: 35.72807531139474, longitude: 139.7671613636778},
        };
        this._panResponder = {};
        this._previousHeight = menuShowHeight;
        this._menuStyles = {};
        // this.menu = (null : ?{ setNativeProps(props) });
        this.show = true;
        
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState( {initPosition: {latitude: position.coords.latitude, longitude: position.coords.longitude} },()=>{
                    //update map here
                    //console.log(this.state.startPos)
                });
            }
        );

    }

        //获取ID
        async getID(){
            try {
                id = await AsyncStorage.getItem('@accountID');
                return id;
            }catch (e) {
                console.error(e);
                return null;
            }
          }
    
        //上传用的网络连接方法
        async bodyOperation(url, data, operation){
            var data = await fetch(url,{
            method: operation,
            body: data
            })
            .then((response) =>response.json())
            .catch((error) => {
                console.error(error);
            });
            return data;
        }
        //绑在按钮上的方法
        uploadRunningRecord = () => {
            let date = new Date();
            var current_time = Moment(date).format('YYYY-MM-DD HH:mm:ss');
            var pageObj = this;
            var opDBdata = this.bodyOperation;
            this.getID().then((id) => {
                if(id!=null){
                    var url = 'http://www.mobileappproj.ml:5000/running_record';
                    var data = JSON.stringify({
                        "distance": pageObj.state.distance.toFixed(2), // 总距离
                        "end_time":  current_time, // 结束时间
                        "start_time": pageObj.state.startTime, // 开始时间
                        "ave_speed": pageObj.state.speed.toFixed(2), // 平均速度
                        "user_id": id, // 用户id
                        "status": 'completed'// 完成情况
                        //附件的generated id？
                      });
                      //这里应该再保存每次跑完步的记录ID
                    opDBdata(url, data, 'POST').then((res) => {
                        if(res.resp == 406){
                          alert('Record is already existed!');
                        }else{
                            //此处调用上传附件的方法，上传对应running_record的系列坐标
                            //alert('success');
                            pageObj.upload_attachments('running_record',res.gen_id,'coordinate.json');
                            //alert('Success! The generated id is: ' + res.gen_id);
                        }
                      });
                  
                }

            }, current_time, pageObj, opDBdata);
        }
 
    
        // 上传json附件到db_name里的mount_id，并起名字为attachment_name
        async upload_attachments(db_name, mount_id, attachment_name){
            var coordinate = this.state.coordinates;
            //console.log("coor原始"+coordinate)
            var data = {'coordinate': coordinate}; // JSON obj
            //将 JSON obj转化为blob上传blob
            const str = JSON.stringify(data);
            //JSON解码 JSON.parse
            //console.log("JSON后"+str)
            const bytes = new encoding.TextEncoder().encode(str);
            //const t = new encoding.TextDecoder().decode(bytes);
            //decode 解码
            const blob = new Blob([bytes], {
                type: "application/json;charset=utf-8"
            });
            console.log("blob"+blob)
            var url = 'http://www.mobileappproj.ml:5000/attachments/' + db_name + '/' + mount_id + '/' + attachment_name;
            var resp = await fetch(url, {
            method: 'PUT',
            body: blob
            })
            .then((response) => alert(JSON.stringify(response.json())))
            .catch((error) => {
            console.error(error);
            });
            return resp;
        }
    
    
    formatStats = () => {
        var formatSec = "" + this.state.sec;
        formatSec = formatSec.padStart(2, '0');
        var formatMin = "" + this.state.min; 
        formatMin = formatMin.padStart(2, '0')

        var formatHour = "" + this.state.hour; 
        formatHour = formatHour.padStart(2, '0')
        var totalTimeSecs = (this.state.hour * 60 * 60) + (this.state.min * 60) + this.state.sec + (this.state.mili / 1000);
        if (totalTimeSecs !== 0) {
            var speed =  this.state.distance*1000/totalTimeSecs
            this.setState({ speed: speed })

        }
        this.setState({
            time:  formatHour + ":" + formatMin + ":" + formatSec,
        })
        this.setState({ test: "route"+this.state.route})

    }


    startButton() {
        //按键反馈
        this.setState({ loading: true });
        var startTime = new Date().getTime();
        let date = new Date();
        if(!this.state.startRun & this.state.paused){
            this.setState({ paused: false })
        }
        //startRun 表示最开始的准备工作
        if (this.state.startRun) {
            this.setState({ startTime: Moment(date).format('YYYY-MM-DD HH:mm:ss') })

            this.setState({ test: "Tracking Run1" })
            this.setState({ button: true,  startRun: false, loading:false })
            this.startTracking()
            setTimeout(() => this.intervalID = setInterval(() => {
                var diff = startTime - new Date().getTime();
                var hr = Math.floor(-diff / 3600000)
                var mili = -diff - 3600000 * hr
                var min = Math.floor(mili / 60000);
                mili = mili - 60000 * min;
                var sec = mili / 1000;
                mili = mili - 1000 & sec;
                min = min.toFixed(0);
                sec = sec.toFixed(0);
                this.setState({ hour: parseInt(hr), min: parseInt(min), sec: parseInt(sec), mili: parseInt(mili) })
                this.formatStats()
            }, 500), 1000 / 60);        
        }else{
            if (this.state.paused) {
                this.setState({ test: "Tracking Run2" })
                navigator.geolocation.getCurrentPosition(
                    position => {
                        var currentPosition = { latitude: position.coords.latitude,longitude:position.coords.longitude};
                        this.setState({ previousPosition: currentPosition })
                    }
                )
                this.startTracking()
                var pauseSec = this.state.sec;
                var pauseMin = this.state.min;
                var pauseHour = this.state.hour;
                setTimeout(() => this.intervalID = setInterval(() => {
                    this.setState({ button: true })
                    var diff = startTime - new Date().getTime();
                    var hr = Math.floor(-diff / 3600000)
                    var mili = -diff - 3600000 * hr
                    var min = Math.floor(mili / 60000);
                    mili = mili - 60000 * min;
                    var sec = mili / 1000;
                    mili = mili - 1000 & sec;
                    min = min.toFixed(0);
                    sec = sec.toFixed(0);
                    //Add new time differnce to old time differnce 

                    var newSec = pauseSec + parseInt(sec)
                    var newMin = pauseMin + parseInt(min)
                    var newHour = pauseHour + parseInt(hr)

                    while (newSec >= 60) {
                        newSec = newSec - 60;
                        newMin = newMin + 1;
                    }
                    while (newMin >= 60) {
                        newMin = newMin - 60;
                        newHour = newHour + 1;
                    }
                    this.setState({ hour: newHour, min: newMin, sec: newSec, mili: parseInt(mili)});
                    this.formatStats()
                }, 500), 500 / 60);

            }else{
                this.setState({ test: "Run Paused" })
                this.setState({ button: false, loading:false })
                this.setState({ paused: true })
                clearInterval(this.intervalID);
                clearInterval(this.intervalTrackingID)
            }            
        }
    }
    startTracking = () => {
        setTimeout(() => this.intervalTrackingID = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    var currentPosition = {latitude:position.coords.latitude,longitude:position.coords.longitude} ;
                    this.state.currentPosition = {latitude:position.coords.latitude,longitude:position.coords.longitude}
                    this.setState({ coordinates: this.state.coordinates.concat([currentPosition]) })

                    this.setState({ distance: this.state.distance + (this.coordDistance(currentPosition))* 1.609 })
                    this.setState({test:this.coordDistance(currentPosition)})
                    this.setState({ previousPosition: currentPosition })
                    //geopoint = new GeoPoint(currentPosition.latitude, currentPosition.longitude)
                    this.setState(prevState => ({
                        route: [...prevState.route]
                    }))
                    //this.setState({route:route})
                    this.setState({ test: "is tracking" })
                    this.setState({ currSpeed:  position.coords.speed })
                }

            )

            if (this.state.distance !== 0) {
                var totalTimeSecs = (this.state.hour * 60 * 60) + (this.state.min * 60) + this.state.sec + (this.state.mili / 1000);
                let kmPerHour = ((this.state.distance * 1.609)) / ((totalTimeSecs / 60) / 60)
                //这里将体重默认设置为60
                let cal = calculateCalories(( 60 * .435), kmPerHour, (totalTimeSecs / 60))
                this.setState({ Calories: cal })
            }

        }, 500), 300);
    }
    coordDistance = (position) => {
        return haversine(this.state.previousPosition, position, { unit: 'mile' }) || 0;
    }
    backButton1() {
        Alert.alert(
            "Finish?",
            "",
            [
                {
                    text: "Finish",
                    onPress: () => {
                        this.backButton2();
                    }
                },
                {
                    text: "Continue",
                    style: "cancel"
                }
            ],
            { cancelable: false })
    }
    backButton2() {
        Alert.alert(
            "Keep Record?",
            "",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        this.uploadRunningRecord(); 
                        this.navigation.navigate('MainMenuPage');}
                },
                {
                    text: "No",
                    onPress: () => this.navigation.navigate('MainMenuPage')
                }
            ],
            { cancelable: false })
    }

    componentWillMount() {
        clearInterval(this.intervalId, this.intervalTrackingID);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
        });
        this._previousHeight = menuShowHeight;
        this._menuStyles = {
            style: {
                height: this._previousHeight,
            }
        };
    }

    componentDidMount() {
        this._updateNativeStyles();
    }
    getMapRegion = () => ({
        latitude: this.state.currentPosition.latitude,
        longitude: this.state.currentPosition.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });

    render = (props) => {
 
        var distance = this.state.distance.toFixed(2);
        var time = this.state.time;
        var AvgSpeed = this.state.speed.toFixed(1);
        var CurrentSpeed = this.state.currSpeed.toFixed(1);
        var Calories = this.state.Calories.toFixed(1);

        var FoodImage = water;
        if (Calories > 4)
            FoodImage = salad;
        if (Calories > 15)
            FoodImage = mushroom;
        if (Calories > 53)
            FoodImage = strawberry;
            console.log("test render")

//
        return (
            <View style={{ flex: 1, backgroundColor: 'pink' }} >
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    style={{ flex: 2 }}
                    followsUserLocation={true}
                    region={{
                        latitude: this.state.initPosition.latitude,
                        longitude: this.state.initPosition.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                >
                <Polyline coordinates={this.state.coordinates} strokeWidth={5} strokeColor="#2A2E43"/>
                </MapView>

                <Svg onPress={this.backButton1.bind(this)} style={styles.backButton} width={21.213} height={21.213} viewBox="0 0 21.213 21.213" {...props}>
                    <G data-name="Group 2420" fill="#000000">
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

                <View style={styles.menu} {...this._panResponder.panHandlers}
                    ref={(menu) => {
                        this.menu = menu;
                    }}>
                    <View style={styles.box}>
                        <View style={{ height: menuHideHeight }}>
                            <View style={{ alignItems: 'center', margin: h * 0.01 }}>
                                <View style={styles.line} />
                            </View>
                            <View style={styles.textView}>
                                <Text style={styles.text}>Distance Run</Text>
                                <Text style={styles.text}>Time</Text>
                            </View>
                            <View style={styles.textView}>
                                <Text style={styles.text}>{distance} km</Text>
                                <Text style={styles.text}>{time}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginHorizontal: h * 0.02, justifyContent: 'space-between' }}>
                            <View>
                                <Text style={styles.text3}>You've burned:</Text>
                                <Image source={FoodImage} style={styles.image} />
                            </View>
                            <View>
                                <Text style={styles.text3}>Avg Speed: {AvgSpeed} m/s</Text>
                                <Text style={styles.text3}>Current Speed: {CurrentSpeed} m/s</Text>
                                <Text style={styles.text3}>Calories: {Calories} kj</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: "center" }}>
                                {
                                this.state.button ? 
                                    <TouchableOpacity onPress={this.startButton.bind(this)} style={styles.StartButton} >
                                         <Text style={ styles.text2}> Pause </Text>
                                    </TouchableOpacity>                                    
                                    :           
                                    <TouchableOpacity onPress={this.startButton.bind(this)} style={styles.StartButton} >
                                        <Text style={!this.state.loading ?  styles.text2 : {display:'none'}}> Start </Text>
                                        <ActivityIndicator 
                                            style={this.state.loading ?  styles.text2 : {display:'none'}}
                                            size="large" 
                                            color="white" 
                                        />
                                    </TouchableOpacity>              
                                }
                            </View>
                    </View>
                </View>
            </View>

        );
    }

    _highlight() {
        this._menuStyles.style.backgroundColor = 'rgba(0,0,0,0.03)';
        this._updateNativeStyles();
    }

    _unHighlight() {
        this._menuStyles.style.backgroundColor = 'transparent';
        this._updateNativeStyles();
    }

    _updateNativeStyles() {
        this.menu && this.menu.setNativeProps(this._menuStyles);
    }

    _handleStartShouldSetPanResponder = (e, gestureState) => {
        // Should we become active when the user presses down on the menu?
        return true;
    }

    _handleMoveShouldSetPanResponder = (e, gestureState) => {
        // Only move more than 5 pixels to respond to move
        let { dx, dy } = gestureState;
        if ((Math.abs(dx) > 5) || (Math.abs(dy) > 5)) {
            return true;
        } else {
            return false;
        }
    }

    _handlePanResponderGrant = (e, gestureState) => {
        this._highlight();
    }
    _handlePanResponderMove = (e, gestureState) => {
        if (this.show && gestureState.dy > 0 && gestureState.dy < (menuShowHeight - menuHideHeight)
            || !this.show && gestureState.dy < 0 && gestureState.dy > -(menuShowHeight - menuHideHeight)) {
            this._menuStyles.style.height = this._previousHeight - gestureState.dy;
            this._updateNativeStyles();
        }

    }
    _handlePanResponderEnd = (e, gestureState) => {
        this._unHighlight();

        if (gestureState.dy <= -50 && !this.show) {
            this._menuStyles.style.height = menuShowHeight;
            this.show = true;
            this._updateNativeStyles();
        } else if (gestureState.dy >= 50 && this.show) {
            this._menuStyles.style.height = menuHideHeight;
            this.show = false;
            this._updateNativeStyles();
        } else {
            this._menuStyles.style.height = this.show ? menuShowHeight : menuHideHeight;
            this._updateNativeStyles();
        }
        this._previousHeight = this._menuStyles.style.height;
    }
}

const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;
const menuShowHeight = 280;
const menuHideHeight = 85;
const buttonHeight = 45;
//
var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    menu: {
        position: 'absolute',
        bottom: 0,
    },
    // back button
    backButton: {
        marginTop: h * 0.07,
        marginHorizontal: w * 0.05,
        position: 'absolute',
    },

    line: {
        height: 5,
        width: w * 0.2,
        backgroundColor: "#555869",
        borderRadius: 3,
    },

    box: {
        bottom: 0,
        height: menuShowHeight,
        width: w,
        backgroundColor: "#2A2E43",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        shadowOffset: { width: 0, height: -5, },
        shadowColor: '#2A2E43',
        shadowOpacity: 0.6,
        shadowRadius: 6,
    },
    textView: {
        flexDirection: 'row',
        marginHorizontal: h * 0.02,
        justifyContent: 'space-between'
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
    text3: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Poppins_700Bold',
        marginTop: h * 0.01,
        // marginLeft: h * 0.02,
    },
    image: {
        width: w * 0.2,
        height: w * 0.2,
        resizeMode: 'contain',
        //position: 'absolute',
        marginLeft: h * 0.03,

    },
    StartButton: {
        backgroundColor: '#474BD9',
        justifyContent: 'center',
        borderRadius: 30,
        height: buttonHeight,
        width: w * 0.9,
        marginTop: 10,
    },

    StartButtonPress: {
        backgroundColor: '#595ef0',
        justifyContent: 'center',
        borderRadius: 15,
        height: buttonHeight,
        width: w * 0.9,
    },
    text2: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
});

export default FreeTraining;