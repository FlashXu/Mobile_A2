'use strict';
import React, { Component } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Svg, { G, Circle, Rect, Path, Marker } from 'react-native-svg';
import smile from '../assets/smile.png';
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
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Modal
} from 'react-native';
import Moment from 'moment';
import { RadioButtons } from 'react-native-radio-buttons';
import { interpolate, multiply } from 'react-native-reanimated';
import water from '../assets/water.png';
import salad from '../assets/salad.png';
import mushroom from '../assets/mushroom.png';
import strawberry from '../assets/strawberry.png';
import { MaterialIcons } from '@expo/vector-icons';
import haversine from "haversine";
import calculateCalories from '../components/CalculateCalories'
import MapView, { 
    Polyline,
  } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';

const origin = {latitude: 35.72807531139474, longitude: 139.7671613636778};
const destination = {latitude: 35.728075, longitude: 139.767161};
// const google_api = "AIzaSyAEdYRovFA01ytQ3bu0mbkwOTsehMv7lv8";
const google_api = "AIzaSyAFoGILtCZjnjEoEj4ZQrqWSY4mWz02OY0";

class AssignTask extends Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = {
            selectedLengthOption: this.props.selectedLengthOption || "Short",
            selectedRouteOption: this.props.selectedRouteOption || "Route 1",
            startPos: {latitude: 35.72807531139474, longitude: 139.7671613636778},
            origin: {latitude: 35.72807531139474, longitude: 139.7671613636778},
            destination: {latitude: 35.72807531139474, longitude: 139.7671613636778},
            path:[],
            totalDistance: 6,
            distance: 0,
            time: '00:00:00',
            speed: 0.0,
            currSpeed: 1.0,
            Calories: 0,
            coordinates: [],
            secs: 0,
            mins: 0,
            hrs: 0,
            startTime: "00:00:00",
            startPressed: false,
            displayStart: 'flex',
            displayDetail: 'none',
            startRun: true,
            paused: false,
            button: false,
            currentPosition : 0,
            loading: false,
            complete: false
        };


        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState( {startPos: {lat: position.coords.latitude, lng: position.coords.longitude} },()=>{
                    //update map here
                    var length = this.state.selectedLengthOption;
                    var route = this.state.selectedRouteOption;
                    var points = this.getPoints(this.state.startPos, length, route);
                    this.generateRoute(points);
                    this.setState({startPosLoaded:true});
                });
            }
        );

        this._panResponder = {};
        this._previousHeight = menuShowHeight;
        this._menuStyles = {};
        // this.menu = (null : ?{ setNativeProps(props): void });
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
        this.setState({ startPressed: true, displayStart: 'none', displayDetail: 'flex' });
        this.setState({ loading: true });
        var startTime = new Date().getTime();
        let date = new Date();
        if(!this.state.startRun & this.state.paused){
            this.setState({ paused: false })
        }
        //startRun 表示最开始的准备工作
        if (this.state.startRun) {
            this.setState({ startTime: Moment(date).format('YYYY-MM-DD HH:mm:ss') })
            this.startTracking()
            this.setState({ test: "Tracking Run1" })
            this.setState({ button: true,  startRun: false, loading:false })
            this.state.startRun = false
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
                        onPress: () => {
                            this.navigation.navigate('MainMenuPage');
                        }
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

    componentDidMount() {
        setTimeout(() => this.setState({ complete: true, paused:true, button:false }), 120000);

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
        var coordinate_dict = this.state.coordinates;
        if (coordinate_dict.length == 0){
            return;
        }
        var coordinate = [];
        for(let i = 0; i < coordinate_dict.length; i++){
            coordinate.push([coordinate_dict[i].longitude, coordinate_dict[i].latitude]);
        }
        var data = {'coordinate': coordinate}; // JSON obj
        // //将 JSON obj转化为blob上传blob
        const str = JSON.stringify(data);
        //JSON解码 JSON.parse
        // const bytes = new encoding.TextEncoder().encode(str);
        //const t = new encoding.TextDecoder().decode(bytes);
        //decode 解码
        const blob = new Blob([str], {type: "application/json;"});
        var url = 'http://www.mobileappproj.ml:5000/attachments/' + db_name + '/' + mount_id + '/' + attachment_name;
        var resp = await fetch(url, {
        method: 'PUT',
        body: blob
        })
        .then((response) => response.json())
        .catch((error) => {
        console.error(error);
        });
        return resp;
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






    generateRoute(path) {
        var pathValues = [];
        for (var i = 0; i < path.length; i++) {
            var str = path[i].lat + "," + path[i].lng;
            pathValues.push(str);
        }
        

        var url = 'https://roads.googleapis.com/v1/nearestRoads?points=' + pathValues.join("|") + '&key=' + google_api; 
        
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
       

        this.GET(url).then((res) => this.decodingLine(res));
        
    }

    decodingLine(line){
        var overview = line.routes[0].overview_polyline.points;
        var directs = this.decode(overview);
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

    // Decode Google DirectionResultObject in to latlng arrays
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
        var distance = this.state.distance.toFixed(1);
        var time = this.state.time;
        var AvgSpeed = this.state.speed.toFixed(1);
        var CurrentSpeed = this.state.currSpeed.toFixed(1);
        var Calories = this.state.Calories.toFixed(1);
        var prograss = distance / totalDistance;
        
        var FoodImage = water;
        if (Calories > 4)
            FoodImage = salad;
        if (Calories > 15)
            FoodImage = mushroom;
        if (Calories > 53)
            FoodImage = strawberry;

        
        // var length = this.state.selectedLengthOption;
        // var route = this.state.selectedRouteOption;
        // var points = this.getPoints(this.state.startPos, length, route);
        // this.generateRoute(points);

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

            var length = this.state.selectedLengthOption;
            var route = this.state.selectedRouteOption;
            var points = this.getPoints(this.state.startPos, length, route);
            this.generateRoute(points);
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

            var length = this.state.selectedLengthOption;
            var route = this.state.selectedRouteOption;
            var points = this.getPoints(this.state.startPos, length, route);
            this.generateRoute(points);
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
            <View style={{ flex: 1, backgroundColor: '#aee1f5' }} >
            {(() => {
                if (this.state.startPosLoaded) {
                    return <MapView
                            style={styles.map}
                            showsUserLocation={true}
                            style={{ flex: 2 }}
                            followsUserLocation={true}
                            initialRegion={{
                                latitude: this.state.startPos.lat,
                                longitude: this.state.startPos.lng,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                        <Polyline coordinates={this.state.path} strokeWidth={5} strokeColor="#5DA6FE"/>       
                        <Polyline coordinates={this.state.coordinates} strokeWidth={5} strokeColor="#2A2E43"/>              
                        <MapView.Marker coordinate={this.state.path[0]} />
                        </MapView>
                } 
            })()}

                {/* <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    style={{ flex: 2 }}
                    //followsUserLocation={true}
                    initialRegion={{
                        latitude: this.state.startPos.lat,
                        longitude: this.state.startPos.lng,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                >
                <Polyline coordinates={this.state.path} strokeWidth={5} strokeColor="#5DA6FE"/>       
                <Polyline coordinates={this.state.coordinates} strokeWidth={5} strokeColor="#2A2E43"/>              
                <MapView.Marker coordinate={this.state.path[0]} />
                </MapView> */}

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
                    <FontAwesome name="close" size={34} color="#2A2E43" />
                    {/* <MaterialIcons name="pause" size={24} color="red" />
                    <Text style={styles.textPause}>Pause</Text> */}
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
                            <View style={{ alignItems: "center" }}>
                                {
                                this.state.button ? 
                                    <TouchableOpacity onPress={this.startButton.bind(this)} style={styles.StartButton} >
                                         <Text style={ styles.text2}> Pause </Text>
                                    </TouchableOpacity>                                    
                                    :           
                                    <TouchableOpacity onPress={this.startButton.bind(this)} style={styles.StartButton} >
                                        {/* <Text style={!this.state.loading ?  styles.text2 : {display:'none'}}> Start </Text> */}
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


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.complete}
                    onRequestClose={() => {
                        this.setState({ complete: false })
                    }}
                >

                    <TouchableOpacity
                        style={styles.container}
                        activeOpacity={1}
                        onPress={() => this.setState({ complete: false })}
                    >
                    </TouchableOpacity>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>

                            <View style={styles.topBar}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.text7}>
                                        Training Complete
                                </Text>
                                    <TouchableOpacity style={styles.deleteIcon} onPress={() => {
                                        this.setState({ complete: false, showCommentEditor: false });
                                        this.uploadRunningRecord();
                                        this.navigation.navigate('MainMenuPage');
                                    }} >
                                        <FontAwesome name="close" size={24} color="black" />
                                    </TouchableOpacity>

                                </View>
                                
                                <Image source={smile} style={styles.imageSmile} />
                                <Text style={styles.text8}>
                                    Well done!
                                </Text>
                                <Text style={styles.text9}>Total Distance Run: {distance} km</Text>
                                <Text style={styles.text9}>Avg Speed: {AvgSpeed} m/s</Text>
                               
                                <View style={{ flexDirection: 'row',  alignSelf: 'flex-start' }}>
                                    <Text style={styles.text9}>Calories: {Calories} kj</Text>
                                    <Image source={FoodImage} style={styles.image} />
                                </View>
                            </View>


                        </View>
                    </View>

                </Modal>






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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 98,
        marginTop: 25,
    },
    modalView: {
        backgroundColor: "#EFF3FF",
        borderRadius: 20,
        padding: 5,
        //alignItems: 'flex-start',
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

        //alignSelf: 'flex-end',
        position: 'relative',
        left: 50,
        //flex: 1
    },
    topBar: {
        width: 0.95 * w,
        height: h* 0.35,
        // backgroundColor:'black'
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
        marginBottom: -10
    }, 
    image: {
        width: w * 0.1,
        height: w * 0.1,
        resizeMode: 'contain',
        // position: 'absolute',
        // left: 160,
        marginTop: h * 0.01
    },
    imageSmile: {
        width: w * 0.2,
        height: w * 0.2,
        resizeMode: 'contain',
        marginTop: 10,
    },
    text7: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
    },
    text8: {
        fontSize: 25,
        fontFamily: 'Poppins_700Bold',
        color: '#F8AC1B',
        marginTop: 10,
        marginBottom: 10,
    },
    text9: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
        color: '#474BD9',
        marginTop: 10,
        alignSelf: 'flex-start'
    },



});

export default AssignTask;