'use strict';
import React, { Component } from 'react';
import Svg, { G, Circle, Rect, Path, Marker } from 'react-native-svg';
import {
    Dimensions,
    PanResponder,
    StyleSheet,
    View,
    Button,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native';
import { RadioButtons } from 'react-native-radio-buttons';
import { interpolate, multiply } from 'react-native-reanimated';
import Food1 from '../assets/Food1.png';
import Food2 from '../assets/Food2.png';
import Food3 from '../assets/Food3.png';
import Food4 from '../assets/Food4.png';
import { MaterialIcons } from '@expo/vector-icons';

import MapView, { 
    Polyline,
  } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';

const origin = {latitude: 35.72807531139474, longitude: 139.7671613636778};
const destination = {latitude: 35.728075, longitude: 139.767161};
const google_api = "AIzaSyAEdYRovFA01ytQ3bu0mbkwOTsehMv7lv8";

class AssignTask extends Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = {
            selectedLengthOption: this.props.selectedLengthOption || "Short",
            selectedRouteOption: this.props.selectedRouteOption || "Route 1",
            startPos: 0,
            origin: {latitude: 35.72807531139474, longitude: 139.7671613636778},
            destination: {latitude: 35.72807531139474, longitude: 139.7671613636778},
            path:[],
            totalDistance: 6,
            distance: 4,
            time: '00:00:00',
            AvgSpeed: 2.0,
            CurrentSpeed: 1.0,
            Calories: 600,

            startPressed: false,
            displayStart: 'flex',
            displayDetail: 'none',
        };


        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState( {startPos: {lat: position.coords.latitude, lng: position.coords.longitude} },()=>{
                    //update map here
                    
                    console.log(this.state.startPos)
                
                
                });
            }
        );

        this._panResponder = {};
        this._previousHeight = menuShowHeight;
        this._menuStyles = {};
        // this.menu = (null : ?{ setNativeProps(props): void });
        this.show = true;
    }

    startButton() {
        //按键反馈
        this.setState({ startPressed: true, displayStart: 'none', displayDetail: 'flex' });
        //this.navigation.navigate('AssignTask');
    }

    backButton() {
        if (this.state.displayStart == 'flex')
            this.navigation.goBack();
        else {
            Alert.alert(
                "Pause",
                "",
                [
                    {
                        text: "Terminate",
                        onPress: () => this.navigation.navigate('MainMenuPage')
                    },
                    {
                        text: "Continue",
                        onPress: () => console.log("Continue Pressed"),
                        style: "cancel"
                    }
                ],
                { cancelable: false })
        }
    }

    componentWillMount() {
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

        // navigator.geolocation.getCurrentPosition(
            
        //     position => {
        //         console.log("test2    " + position.coords.latitude)
        //         this.setState( {startPos: {lat: position.coords.latitude, lng: position.coords.longitude} },()=>console.log(this.state.startPos));
        //     }
        // );
    }



    generateRoute(path) {
        var pathValues = [];
        for (var i = 0; i < path.length; i++) {
            var str = path[i].lat + "," + path[i].lng;
            pathValues.push(str);
        }
        

        var url = 'https://roads.googleapis.com/v1/nearestRoads?points=' + pathValues.join("|") + '&key=' + google_api; 
        // console.log(url);
        // this.GET(url).then((res) => console.log(JSON.stringify(res)));
        this.GET(url).then((res) => this.processNearestRoadsResponse(res));
        
    }

    processNearestRoadsResponse(data) {
        var placeIdArray = [];
        var wayPointsArray = [];
        let indexCount = 0;
        
        for (let i = 0; i < data.snappedPoints.length; i++) {
            let originalIndex = data.snappedPoints[i].originalIndex;
            if (originalIndex == indexCount) {
                placeIdArray.push(data.snappedPoints[i].placeId);
                if (originalIndex > 0 && originalIndex < 4) {
                    wayPointsArray.push(data.snappedPoints[i].placeId);
                }
                indexCount++;
            }
        }
        

        var origin = 'place_id:' + placeIdArray[0];
        var destination = 'place_id:' + placeIdArray[4];
        var waypoints = 'place_id:' + wayPointsArray.join('|place_id:');
        var mode = 'WALKING';

        var url = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + origin + '&destination=' + destination + '&mode=' + mode + '&waypoints=' + waypoints + '&key=' + google_api;
        // this.GET(url).then((res) => console.log(JSON.stringify(res)));

        this.GET(url).then((res) => this.decodingLine(res));
        
    }

    decodingLine(line){
        var overview = line.routes[0].overview_polyline.points;
        // console.log(overview);
        var directs = this.decode(overview);
        // console.log(directs);
        this.setState({path: directs})
    }

    getPoints(startLatLng, difficulty, route_num) {
        let step;
        let path = [startLatLng];
        let curLat = startLatLng.lat;
        let curLng = startLatLng.lng;
        
        //根据难度调节step
        switch (difficulty) {
          case "Short":
            step = 0.0025;
            break;
          case "Medium":
            step = 0.0075;
            break;
          case "Long":
            step = 0.0125;
            break;
          default:
            break;
        }
        
        //从初始点向四个方向形成四个路线
        switch (route_num) {
          case "Route 1":
            curLat += step;
            path.push({ lat: curLat, lng: curLng });
      
            curLng += step;
            path.push({ lat: curLat, lng: curLng });
      
            curLat -= step;
            path.push({ lat: curLat, lng: curLng });
      
            curLng -= step;
            path.push({ lat: curLat, lng: curLng });
      
            break;
      
          case "Route 2":
            curLat += step;
            path.push({ lat: curLat, lng: curLng });
      
            curLng -= step;
            path.push({ lat: curLat, lng: curLng });
      
            curLat -= step;
            path.push({ lat: curLat, lng: curLng });
      
            curLng += step;
            path.push({ lat: curLat, lng: curLng });
      
            break;
      
          case "Route 3":
            curLat -= step;
            path.push({ lat: curLat, lng: curLng });
      
            curLng += step;
            path.push({ lat: curLat, lng: curLng });
      
            curLat += step;
            path.push({ lat: curLat, lng: curLng });
      
            curLng -= step;
            path.push({ lat: curLat, lng: curLng });
      
            break;
      
          case "Route 4":
            curLat -= step;
            path.push({ lat: curLat, lng: curLng });
      
            curLng -= step;
            path.push({ lat: curLat, lng: curLng });
      
            curLat += step;
            path.push({ lat: curLat, lng: curLng });
      
            curLng += step;
            path.push({ lat: curLat, lng: curLng });
      
            break;
      
          default:
            break;
        }
        return path;
      }


    decode(t, e) {
    for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
        a = null, h = 0, i = 0;
        do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
        n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
        do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
        o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c])
    }
    return d = d.map(function (t) {
        return {
        latitude: t[0],
        longitude: t[1]
        }
    })
    }

    async GET(url){ 
        var data = await fetch(url,{
          method: 'GET'
        })
          .then((response) => response.json())
          .catch((error) => {
            console.error(error);
        });
        return data;
    }

    
    render = (props) => {
        // get the length
        var length = this.state.selectedLengthOption;
        // get the route
        var route = this.state.selectedRouteOption;
        // Print
        // console.log(length + " " + route);

        const lengthOptions = [
            "Short",
            "Medium",
            "Long"
        ];

        const routeOptions = [
            "Route 1",
            "Route 2",
            "Route 3",
            "Route 4"
        ];
        var totalDistance = this.state.totalDistance;
        var distance = this.state.distance;
        var time = this.state.time;
        var AvgSpeed = this.state.AvgSpeed;
        var CurrentSpeed = this.state.CurrentSpeed;
        var Calories = this.state.Calories;
        var prograss = distance / totalDistance;
        var FoodImage = Food1;
        if (Calories > 200)
            FoodImage = Food2;
        if (Calories > 500)
            FoodImage = Food3;
        if (Calories > 1000)
            FoodImage = Food4;

        
        var length = this.state.selectedLengthOption;
        var route = this.state.selectedRouteOption;
        var points = this.getPoints(this.state.startPos, length, route);
        this.generateRoute(points);

        // Circular progress bar data
        const α = interpolate(prograss, {
            inputRange: [0, 1],
            outputRange: [0, Math.PI * 2]
        });
        const strokeDashoffset = multiply(α, radius);

        function setSelectedLengthOption(selectedLengthOption) {
            this.setState({
                selectedLengthOption,
            });
        }

        function renderLengthOption(option, selected, onSelect, index) {
            var LengthStyle;
            if (index == 0) {
                LengthStyle = selected ? styles.buttonShortPress : styles.buttonShort;
            }
            if (index == 1) {
                LengthStyle = selected ? styles.buttonMediumPress : styles.buttonMedium;
            }
            if (index == 2) {
                LengthStyle = selected ? styles.buttonLongPress : styles.buttonLong;
            }
            return (
                <TouchableWithoutFeedback onPress={onSelect} key={index}>
                    <View style={LengthStyle}>
                        <Text style={styles.text}>{option}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        function setSelectedRouteOption(selectedRouteOption) {
            this.setState({
                selectedRouteOption,
            });
        }

        function renderRouteOption(option, selected, onSelect, index) {
            var RouteStyle;
            if (length == "Short") {
                RouteStyle = selected ? styles.routeShortPress : styles.routeShort;
            }
            if (length == "Medium") {
                RouteStyle = selected ? styles.routeMediumPress : styles.routeMedium;
            }
            if (length == "Long") {
                RouteStyle = selected ? styles.routeLongPress : styles.routeLong;
            }

            return (
                <TouchableWithoutFeedback onPress={onSelect} key={index}>
                    <View style={RouteStyle}>
                        <Text style={styles.text}>{option}</Text>
                        <Text style={styles.text}>information</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }


        function renderContainer(optionNodes) {
            return <View>{optionNodes}</View>;
        }

        return (
            <View style={{ flex: 1, backgroundColor: 'pink' }} >
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    style={{ flex: 2 }}
                    followsUserLocation={true}
                    //region={this.getMapRegion()}
                >
                <Polyline coordinates={this.state.path} strokeWidth={5} strokeColor="#5DA6FE"/>
                <MapView.Marker coordinate={origin} />
                <MapView.Marker coordinate={destination} />
                </MapView>

                <View style={{
                    marginTop: h * 0.07,
                    marginHorizontal: w * 0.05,
                    position: this.state.displayStart!='none'?'absolute':'relative',
                    display: this.state.displayStart
                }}>
                    <Svg onPress={this.backButton.bind(this)} width={21.213} height={21.213} viewBox="0 0 21.213 21.213" {...props}>
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
                </View>

                <TouchableOpacity onPress={this.backButton.bind(this)}
                    style={{
                        display: this.state.displayDetail,
                        marginTop: h * 0.05,
                        marginHorizontal: w * 0.03,
                        position: this.state.displayDetail!='none'?'absolute':'relative',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <MaterialIcons name="pause" size={24} color="red" />
                    <Text style={styles.textPause}>Pause</Text>
                </TouchableOpacity>

                <View style={styles.menu} {...this._panResponder.panHandlers}
                    ref={(menu) => {
                        this.menu = menu;
                    }}>
                    <View style={styles.box}>
                        <View style={{ display: this.state.displayStart }}>
                            <View style={{ height: menuHideHeight }}>
                                <View style={{ alignItems: 'center', margin: h * 0.01 }}>
                                    <View style={styles.line} />
                                </View>
                                <Text style={styles.text3}>Choose a Route</Text>
                            </View>

                            <RadioButtons
                                options={lengthOptions}
                                onSelection={setSelectedLengthOption.bind(this)}
                                selectedOption={this.state.selectedLengthOption}
                                renderOption={renderLengthOption}
                                renderContainer={RadioButtons.getViewContainerRenderer({
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: w * 0.05,
                                    marginBottom: h * 0.01
                                })}
                            />
                            <RadioButtons
                                options={routeOptions}
                                onSelection={setSelectedRouteOption.bind(this)}
                                selectedOption={this.state.selectedRouteOption}
                                renderOption={renderRouteOption}
                                renderContainer={RadioButtons.getViewContainerRenderer({
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    marginHorizontal: w * 0.05,
                                    marginBottom: h * 0.01,
                                })}
                            />
                            <View style={{ alignItems: "center" }}>
                                <TouchableOpacity onPress={this.startButton.bind(this)} style={this.state.startPressed ? styles.StartButtonPress : styles.StartButton}>
                                    <Text style={styles.text2}>Start</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ display: this.state.displayDetail }}>
                            <View style={{ height: menuHideHeight }}>
                                <View style={{ alignItems: 'center', margin: h * 0.01 }}>
                                    <View style={styles.line} />
                                </View>
                                <View style={styles.textView}>
                                    <Text style={styles.text4}>Total Distance</Text>
                                    <Text style={styles.text4}>Time</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text style={styles.text4}>{totalDistance} km</Text>
                                    <Text style={styles.text4}>{time}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginHorizontal: h * 0.02, marginTop: h * 0.02 }}>
                                <View>
                                    <Svg width={size} height={size}>
                                        <Circle
                                            stroke="#505465"
                                            fill="none"
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            strokeDasharray={circumference}
                                            {...{ strokeWidth, strokeDashoffset }}
                                        />
                                        <Circle
                                            stroke="#5773FB"
                                            fill="none"
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            strokeDasharray={circumference * prograss}
                                            {...{ strokeWidth, strokeDashoffset }}
                                        />
                                        <View>
                                            <Text style={styles.text5}>{distance} / {totalDistance} km</Text>
                                        </View>
                                    </Svg>
                                </View>
                                <View>
                                    <Text style={styles.text6}>Avg Speed: {AvgSpeed} m/s</Text>
                                    <Text style={styles.text6}>Current Speed: {CurrentSpeed} m/s</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.text6}>Calories: {Calories} kj</Text>
                                        <Image source={FoodImage} style={styles.image} />
                                    </View>
                                </View>
                            </View>

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
// const menuShowHeight = h * 0.35;
const menuHideHeight = 80;
// const buttonHeight = h * 0.05;
// const routeButtonWidth = w * (1-0.15) / 2;
// const menuHideHeight = 30;
const menuShowHeight = 300;
const buttonHeight = 45;
const routeButtonWidth = w * (1 - 0.15) / 2;

const size = w * 0.37;
const strokeWidth = 8;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

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
        fontSize: 14,
        fontFamily: 'Poppins_300Light',
        textAlign: 'center',
    },
    text2: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
    text3: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
    text4: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
    text5: {
        color: '#fff',
        fontSize: 23,
        fontFamily: 'Poppins_700Bold',
        textAlign: "center",
        top: size / 2.5,
    },
    text6: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        marginTop: h * 0.02,
        marginLeft: h * 0.02,
    },
    textPause: {
        color: 'red',
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
    buttonShort: {
        borderColor: '#0DAC00',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 30,
        height: buttonHeight,
        width: w * 0.25,
        //marginLeft: w * 0.25 / 4
    },

    buttonShortPress: {
        backgroundColor: '#0DAC00',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 30,
        height: buttonHeight,
        width: w * 0.25,
        //marginLeft: w * 0.25 / 4
    },

    buttonMedium: {
        borderColor: '#F8AC1B',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 30,
        height: buttonHeight,
        width: w * 0.25,
        //marginLeft: w * 0.25 / 4
    },

    buttonMediumPress: {
        backgroundColor: '#F8AC1B',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 30,
        height: buttonHeight,
        width: w * 0.25,
        //marginLeft: w * 0.25 / 4
    },

    buttonLong: {
        borderColor: '#FC0000',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 30,
        height: buttonHeight,
        width: w * 0.25,
        //marginLeft: w * 0.25 / 4
    },

    buttonLongPress: {
        backgroundColor: '#FC0000',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 30,
        height: buttonHeight,
        width: w * 0.25,
        //marginLeft: w * 0.25 / 4
    },

    routeShort: {
        borderColor: '#0DAC00',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'center',
        height: buttonHeight,
        width: routeButtonWidth,
        marginBottom: h * 0.01
    },

    routeShortPress: {
        backgroundColor: '#0DAC00',
        alignItems: "center",
        justifyContent: 'center',
        height: buttonHeight,
        width: routeButtonWidth,
        marginBottom: h * 0.01
    },

    routeMedium: {
        borderColor: '#F8AC1B',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'center',
        height: buttonHeight,
        width: routeButtonWidth,
        marginBottom: h * 0.01
    },

    routeMediumPress: {
        backgroundColor: '#F8AC1B',
        alignItems: "center",
        justifyContent: 'center',
        height: buttonHeight,
        width: routeButtonWidth,
        marginBottom: h * 0.01
    },

    routeLong: {
        borderColor: '#FC0000',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'center',
        height: buttonHeight,
        width: routeButtonWidth,
        marginBottom: h * 0.01
    },

    routeLongPress: {
        backgroundColor: '#FC0000',
        alignItems: "center",
        justifyContent: 'center',
        height: buttonHeight,
        width: routeButtonWidth,
        marginBottom: h * 0.01
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
    image: {
        width: w * 0.1,
        height: w * 0.1,
        resizeMode: 'contain',
        // position: 'absolute',
        // left: 160,
        marginTop: h * 0.01
    },
});

export default AssignTask;