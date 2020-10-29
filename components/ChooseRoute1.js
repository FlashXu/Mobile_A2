'use strict';
import React, { Component } from 'react';
import Svg, { G, Circle, Rect, Path } from 'react-native-svg';
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
import { RadioButtons } from 'react-native-radio-buttons'

class ChooseRoute extends Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = {
            selectedLengthOption: this.props.selectedLengthOption || "Short",
            selectedRouteOption: this.props.selectedRouteOption || "Route 1",
            startPressed: false,
        };
        this._panResponder = {};
        this._previousHeight = menuShowHeight;
        this._menuStyles = {};
        this.menu = (null : ?{ setNativeProps(props: Object): void });
        this.show = true;
    }

    startButton() {
        //按键反馈
        this.setState({ startPressed: true });
        this.navigation.navigate('AssignTask');
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
        // get the length
        var length = this.state.selectedLengthOption;
        // get the route
        var route = this.state.selectedRouteOption;
        // Print
        console.log(length + " " + route);

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
                                marginBottom: h * 0.01,
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

    _handleStartShouldSetPanResponder = (e: Object, gestureState: Object): boolean => {
        // Should we become active when the user presses down on the menu?
        return true;
    }

    _handleMoveShouldSetPanResponder = (e: Object, gestureState: Object): boolean => {
        // Only move more than 5 pixels to respond to move
        let { dx, dy } = gestureState;
        if ((Math.abs(dx) > 5) || (Math.abs(dy) > 5)) {
            return true;
        } else {
            return false;
        }
    }

    _handlePanResponderGrant = (e: Object, gestureState: Object) => {
        this._highlight();
    }
    _handlePanResponderMove = (e: Object, gestureState: Object) => {
        if (this.show && gestureState.dy > 0 && gestureState.dy < (menuShowHeight - menuHideHeight)
            || !this.show && gestureState.dy < 0 && gestureState.dy > -(menuShowHeight - menuHideHeight)) {
            this._menuStyles.style.height = this._previousHeight - gestureState.dy;
            this._updateNativeStyles();
        }

    }
    _handlePanResponderEnd = (e: Object, gestureState: Object) => {
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
const menuShowHeight = h * 0.35;
const menuHideHeight = h * 0.07;
const buttonHeight = h * 0.05;
const routeButtonWidth = w * (1-0.15) / 2;
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
        width: w * 0.75,
    }

});

export default ChooseRoute;