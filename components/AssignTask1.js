'use strict';
import React, { Component } from 'react';
import Svg, { G, Circle, Rect, Path } from 'react-native-svg';
import { DangerZone } from 'expo';
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
} from 'react-native';
import { RadioButtons } from 'react-native-radio-buttons';
import { interpolate, multiply } from 'react-native-reanimated';
import Food1 from '../assets/Food1.png';
import Food2 from '../assets/Food2.png';
import Food3 from '../assets/Food3.png';
import Food4 from '../assets/Food4.png';

class AssignTask extends Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = {
            totalDistance: 6,
            distance: 4,
            time: '00:00:00',
            AvgSpeed: 2.0,
            CurrentSpeed: 1.0,
            Calories: 600,
        };
        this._panResponder = {};
        this._previousHeight = menuShowHeight;
        this._menuStyles = {};
        // this.menu = (null : ?{ setNativeProps(props): void });
        this.show = true;
    }

    startButton() {
        //按键反馈
        this.setState({ startPressed: true });
    }

    backButton() {
        this.navigation.goBack();
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
    }

    render = (props) => {
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

        const α = interpolate(prograss, {
            inputRange: [0, 1],
            outputRange: [0, Math.PI * 2]
        });
        const strokeDashoffset = multiply(α, radius);

        return (

            <View style={{ flex: 1, backgroundColor: 'pink' }} >
                <Text style={{ color: 'blue' }}>Map here!</Text>
                <Text style={{ color: 'blue' }}>Map here!</Text>
                <Text style={{ color: 'blue' }}>Map here!</Text>
                <Text style={{ color: 'blue' }}>Map here!</Text>
                <Text style={{ color: 'blue' }}>Map here!</Text>
                <Text style={{ color: 'blue' }}>Map here!</Text>
              
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
                                <Text style={styles.text}>Total Distance</Text>
                                <Text style={styles.text}>Time</Text>
                            </View>
                            <View style={styles.textView}>
                                <Text style={styles.text}>{totalDistance} km</Text>
                                <Text style={styles.text}>{time}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginHorizontal: h * 0.02 }}>
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
                                        <Text style={styles.text2}>{distance} / {totalDistance} km</Text>
                                    </View>
                                </Svg>
                            </View>
                            <View>
                                <Text style={styles.text3}>Avg Speed: {AvgSpeed} m/s</Text>
                                <Text style={styles.text3}>Current Speed: {CurrentSpeed} m/s</Text>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={styles.text3}>Calories: {Calories} kj</Text>
                                    <Image source={FoodImage} style={styles.image} />
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

    _handleMoveShouldSetPanResponder = (e, gestureState)=> {
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
const menuShowHeight = 240;
// const menuHideHeight = h * 0.1;
const menuHideHeight = 80;
const size = w * 0.37;
const strokeWidth = 8;
const radius = (size - strokeWidth) / 2;
console.log(radius);
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
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
    },
    text2: {
        color: '#fff',
        fontSize: 23,
        fontFamily: 'Poppins_700Bold',
        textAlign: "center",
        top: size / 2.5,
    },
    text3: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        marginTop: h * 0.02,
        marginLeft: h * 0.02,
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