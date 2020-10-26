import React, { Component, } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert 
  } from "react-native";
import MapView, { 
    Polyline,
  } from "react-native-maps";
//import calculateCalories from './src/calories/CalculateCalories'
import haversine from "haversine";
import StartButton from "./src/runbutton/StartButton"
import StopRunButton from "./src/runbutton/StopRunButton"

export class SimplyRun extends Component {
    state = {
        stats: "",
        current: "",
        displayStat: true,
        startRun: true,
        paused: false,
        button: false,
        stopButton: false,
        coordinates: [],
        distance: 0,
        previousPosition: {},
        ms: 0,
        secs: 0,
        mins: 0,
        hrs: 0,
        startTime: "",
        route: "",
        speed: 0,
        calories: 0
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
            var speed =  this.state.distance/(totalTimeSecs / 60) 
            this.setState({ speed: speed })

        }
        this.setState({
            stats: "\n" + "Time" + ": " + formatHour + ":" + formatMin + ":" + formatSec + " hr:min:sec" +
                "\n" + "Distance: " + this.state.distance.toFixed(2) + " miles" + "\n" + "Speed: " + this.state.speed.toFixed(2) +
                " mile/mins" + "\n" + "Calories: " + this.state.calories.toFixed(0),
        })
    }
    endRun = () => {
        this.setState({ stopButton: false })
        this.setState({ current: "" })
        this.props.navigation.navigate('EndRun');
        var totalTimeSecs = (this.state.hour * 60 * 60) + (this.state.min * 60) + this.state.sec + (this.state.mili / 1000);
        if (this.state.distance !== 0) {
            var speed =  this.state.distance/(totalTimeSecs / 60) 
            this.setState({ speed: speed })
        }
        this.setState({ hour: 0, min: 0, sec: 0, mili: 0, distance: 0, pace: 0, calories: 0, coordinates: [] })
        this.setState({ stats: "" })
        this.setState({ endRun: false })
    }
    endRunButton = () => {
        Alert.alert(
            'Confirm End Run',
            'Would you like to end your run?',
            [
                { text: 'Yes', onPress: () => { this.endRun() } },
                {
                    text: 'No',
                    style: 'cancel'
                }
            ],
            { cancelable: false },
        );
    }

    start = () =>{
        var startTime = new Date().getTime()
        if(!this.state.startRun & this.state.paused){
            this.setState({ paused: false })
        }
        //startRun 表示按下了开始跑的按钮
        if (this.state.startRun) {
            this.setState({ startTime: new Date() })
            this.startTracking()
            this.setState({ current: "Tracking Run1" })
            this.setState({ startRun: false })
            this.setState({ button: true, stopButton: true, startRun: false })
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
                this.setState({ current: "Tracking Run2" })
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
                }, 500), 1000 / 60);

            }else{
                this.setState({ current: "Run Paused" })
                this.setState({ button: false })
                this.setState({ stopButton: true })
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
                    
                    this.setState({ coordinates: this.state.coordinates.concat([currentPosition]) })

                    this.setState({ distance: this.state.distance + this.coordDistance(currentPosition) })
                    this.setState({ previousPosition: currentPosition })
                    //geopoint = new firebase.firestore.GeoPoint(currentPosition.latitude, currentPosition.longitude)
                    this.setState(prevState => ({
                        route: [...prevState.route]
                    }))
                }

            )

            if (this.state.distance !== 0) {
                var totalTimeSecs = (this.state.hour * 60 * 60) + (this.state.min * 60) + this.state.sec + (this.state.mili / 1000);
                let kmPerHour = ((this.state.distance * 1.609)) / ((totalTimeSecs / 60) / 60)

            }

        }, 10000), 1000);
    }
    coordDistance = (position) => {
        return haversine(this.state.previousPosition, position, { unit: 'mile' }) || 0;
    }

    render(){
        return(
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    style={{ flex: 2 }}
                    followsUserLocation={true}
                >
                
                <Polyline coordinates={this.state.coordinates} strokeWidth={5} strokeColor="#483D8B"/>
                </MapView>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 10
                }}>
                    <Text style={{ fontSize: 15 }}> {this.state.current}</Text>
                    {
                        this.state.displayStat ? < Text style={{
                            paddingBottom: 10, fontSize: 15
                        }}> {this.state.stats}</Text> : null
                    }
                    <View style={styles.buttonContainer}>
                        {
                            this.state.button ? < StartButton onPress={this.start} pauseButton={true} /> :
                                < StartButton onPress={this.start} pauseButton={false} />

                        }
                        <Text>  </Text>
                        {
                            !this.state.button && this.state.stopButton ?
                                <StopRunButton style={{ fontSize: 20 }} onLongPress={this.endRunButton} title={'STOP'} /> : null
                        }

                    </View>
                </View>
            </View>
        );
    }
}
//componentDidUpdate = (prevProps) =>{

 //   this.formatStats();
//}

componentWillUnmount = () => {
    clearInterval(this.intervalId, this.intervalTrackingID);
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
      },
      map: {
        ...StyleSheet.absoluteFillObject
      },
    buttonContainer: {
      
      marginVertical: 30,
      backgroundColor: "transparent"
    }
  });

export default SimplyRun;