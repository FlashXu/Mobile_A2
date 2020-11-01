'use strict';
import React, { Component,useState } from 'react';
import Svg, { G, Circle, Rect, Path } from 'react-native-svg';
import { DangerZone } from 'expo';
import {
    Dimensions,
    PanResponder,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
} from 'react-native';
import MapView, { 
    Polyline,
  } from "react-native-maps";

import Food1 from '../assets/Food1.png';
import Food2 from '../assets/Food2.png';
import Food3 from '../assets/Food3.png';
import Food4 from '../assets/Food4.png';
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
            currentPosition : 0
        };
        this._panResponder = {};
        this._previousHeight = menuShowHeight;
        this._menuStyles = {};
        // this.menu = (null : ?{ setNativeProps(props) });
        this.show = true;
        
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
            var speed =  this.state.distance*1600/totalTimeSecs
            this.setState({ speed: speed })

        }
        this.setState({
            time:  formatHour + ":" + formatMin + ":" + formatSec,
        })
        this.setState({ test: "format" })

    }


    startButton() {
        //按键反馈
        this.setState({ startPressed: true });
        var startTime = new Date().getTime()
        if(!this.state.startRun & this.state.paused){
            this.setState({ paused: false })
        }
        //startRun 表示最开始的准备工作
        if (this.state.startRun) {
            this.setState({ startTime: new Date() })

            this.setState({ test: "Tracking Run1" })
            this.setState({ button: true,  startRun: false })
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
                        var currentPosition = position.coords;
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
                    this.setState({ hour: newHour, min: newMin, sec: newSec, mili: parseInt(mili) });
                    this.formatStats()
                }, 500), 500 / 60);

            }else{
                this.setState({ test: "Run Paused" })
                this.setState({ button: false })
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
                    var currentPosition = position.coords;
                    this.state.currentPosition = currentPosition
                    this.setState({ coordinates: this.state.coordinates.concat([currentPosition]) })

                    this.setState({ distance: this.state.distance + (this.coordDistance(currentPosition))* 1.609 })
                    this.setState({test:this.coordDistance(currentPosition)})
                    this.setState({ previousPosition: currentPosition })
                    //geopoint = new firebase.firestore.GeoPoint(currentPosition.latitude, currentPosition.longitude)
                    this.setState(prevState => ({
                        route: [...prevState.route]
                    }))
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

        }, 5000), 1000);
    }
    coordDistance = (position) => {
        return haversine(this.state.previousPosition, position, { unit: 'mile' }) || 0;
    }
    backButton() {
        this.navigation.goBack();
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

        var FoodImage = Food1;
        if (Calories > 200)
            FoodImage = Food2;
        if (Calories > 500)
            FoodImage = Food3;
        if (Calories > 1000)
            FoodImage = Food4;

//
        return (
            <View style={{ flex: 1, backgroundColor: 'pink' }} >
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    style={{ flex: 2 }}
                    followsUserLocation={true}
                    //region={this.getMapRegion()}
                >
                <Polyline coordinates={this.state.coordinates} strokeWidth={5} strokeColor="#2A2E43"/>
                </MapView>

                <Svg onPress={this.backButton.bind(this)} style={styles.backButton} width={21.213} height={21.213} viewBox="0 0 21.213 21.213" {...props}>
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
                                <Text style={styles.text}>Distance Ran</Text>
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
                                    <TouchableOpacity onPress={this.startButton.bind(this)} style={this.state.startPressed ? styles.StartButtonPress : styles.StartButton} >
                                         <Text style={ styles.text2}> Pause </Text>
                                    </TouchableOpacity>                                    
                                    :           
                                    <TouchableOpacity onPress={this.startButton.bind(this)} style={this.state.startPressed ? styles.StartButtonPress : styles.StartButton} >
                                        <Text style={ styles.text2}> Start </Text>
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
        fontSize: 18,
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