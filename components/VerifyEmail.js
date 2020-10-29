import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Animated, AppRegistry, Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { G, Circle, Rect, Path } from 'react-native-svg';
import forgotPassword2 from '../assets/ForgotPassword2.png';


// Forgot Password Screen 2 - Verifty email
// const VerifyEmail = ({ navigation, props, route }) => {
class VerifyEmail extends Component {
    constructor(props) {
        super(props)
        this.keyboardHeight = new Animated.Value(0)
        this.num1 = React.createRef()
        this.num2 = React.createRef()
        this.num3 = React.createRef()
        this.num4 = React.createRef()
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = { num1: '',num2:'',num3:'',num4:'', confirmPressed:false, resendPressed:false }; 
    }


    inputNumber(value, flag) {
        if(value.length>1) {
            value = value.slice(-1);
        }
        const completeFlag = `num${flag}`;
        this.setState({ [completeFlag]: value }, ()=>{
            flag += 1;
            if (flag < 5 && value) {
                const nextFlag = `num${flag}`;
                const textInputToFocus = this[nextFlag];
                textInputToFocus.current.focus();
            }
        })
    }

    handleKeyPress = (e) => {
        if( e.nativeEvent.key === 'Backspace') {
            if (this.state.num1 && this.state.num2 && this.state.num3 && this.state.num4 || 
                this.state.num1 && this.state.num2 && this.state.num3 && !this.state.num4 ) {
                this.setState({ num4 : "" });
                this.num3.current.focus();
            } else if (this.state.num1 && this.state.num2 && this.state.num3 || 
                       this.state.num1 && this.state.num2 && !this.state.num3) {
                this.setState({ num3 : "" });
                this.num2.current.focus();
            } else if (this.state.num1 && this.state.num2 || 
                       this.state.num1 && !this.state.num2) {
                this.setState({ num2 : "" });
                this.num1.current.focus();
            } 

        }
    }


    // Back button function
    toForgotPasswordScreen() {
        this.navigation.navigate('ForgotPassword');
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

    // Confirm the code send to user's Email
    confirmCode() {
        //按键反馈
        this.setState({confirmPressed:true});
        setTimeout(()=>{ this.setState({confirmPressed:false}); }, 500);

        //系统验证输入的验证码
        let userEnteredCode = this.state.num1 + this.state.num2 + this.state.num3 + this.state.num4;
        //alert(userEnteredCode);
        var url = 'http://www.mobileappproj.ml:5000/accounts/forget_pwd';
        var data = JSON.stringify({
            "user_name": this.data.email,
            "verify_code": userEnteredCode
          }); 
        var email = this.data.email;
        this.bodyOperation(url, data, 'POST').then((results) => {
            if(results.resp == 410){
                alert('Time out! Please re-verify.')
            }else if(results.resp == 409){
                alert('Wrong verify code! Please input the right code.')
            }else{
                // When verification success, you do some operations here.
                // alert('Success! Your id is:' + results.gen_id);
                let id = results.gen_id;
                this.navigation.navigate('ResetPassword',{userId:id, userEmail:email});

            }
        }, email);
    }

    //Resend Code to Email
    resendCode() {
        //按键反馈
        this.setState({resendPressed:true});
        setTimeout(()=>{ this.setState({resendPressed:false}); }, 500);
        var url = 'http://www.mobileappproj.ml:5000/accounts/forget_pwd?user_name=' + this.data.email;
        this.GET(url).then(function(results){
          if(results.resp == 404){
            alert('There is no such an account!');
          }else if(results.resp == 412){
            alert('Invalid email address!');
          }else if(results.resp == 411){
            alert('Server connect error! Please try again.');
          }else{
            alert('Having successfully sent the verify code, please check your email inbox.')
          }
        });
    }

    render= (props) => {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#2A2E43' }}>
                <View style={styles.container}>
                    <Svg onPress={this.toForgotPasswordScreen.bind(this)} style={styles.backButton} width={21.213} height={21.213} viewBox="0 0 21.213 21.213" {...props}>
                        <G data-name="Group 2420" fill="#fff">
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
                    <Image source={forgotPassword2} style={styles.figure} />
                    <Text style={styles.bigTitle}>Verify Email!</Text>
                    <Text style={styles.text1}>Please enter the number code send your email: </Text>
                    <Text style={styles.text2}>{this.data.email}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch' }}>

                    <TextInput style={styles.textInput}
                        ref={this.num1}
                        onKeyPress={this.handleKeyPress} 
                        onChangeText={number => this.inputNumber(number, 1)}
                        value={this.state.num1}
                        keyboardType="numeric"
                        numberOfLines={1}
                    />
                    <TextInput style={styles.textInput}
                        ref={this.num2}
                        onKeyPress={this.handleKeyPress} 
                        onChangeText={number => this.inputNumber(number, 2)}
                        value={this.state.num2}
                        keyboardType="numeric"
                        numberOfLines={1}
                    />
                    <TextInput style={styles.textInput}
                        ref={this.num3}
                        onKeyPress={this.handleKeyPress} 
                        onChangeText={number => this.inputNumber(number, 3)}
                        value={this.state.num3}
                        keyboardType="numeric"
                        numberOfLines={1}
                    />
                    <TextInput style={styles.textInput}
                        ref={this.num4}
                        onKeyPress={this.handleKeyPress} 
                        onChangeText={number => this.inputNumber(number, 4)}
                        value={this.state.num4}
                        keyboardType="numeric"
                        numberOfLines={1}
                    />
                    </View>
                    <TouchableOpacity 
                    onPress={this.confirmCode.bind(this)} 
                    // onPressIn={() => this.setState({confirmPressed:true})}
                    // onPressOut={() => this.setState({confirmPressed:false})} 
                    style={this.state.confirmPressed ? styles.buttonPress : styles.button}
                    >
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    
                    <Text 
                    onPress={this.resendCode.bind(this)} 
                    style={this.state.resendPressed ? styles.text3Press : styles.text3}
                    >Resend code</Text>
                    
                    <StatusBar style="auto" />
                </View>
            </ScrollView>
        );
    }
}

const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2A2E43',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    // back button
    backButton: {
        marginTop: h * 0.07,
        marginHorizontal: w * 0.05,
    },
    // figure size
    figure: {
        width: w,
        height: h * 0.3,
        marginTop: h * 0.03,
        alignItems: 'center',
        resizeMode: 'contain',
    },
    // bit title, font size 30, Bold
    bigTitle: {
        color: '#fff',
        fontSize: 30,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
    // Normal text, font size 17, Light
    text1: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Poppins_300Light',
        textAlign: 'center',
        marginTop: h * 0.02,
        marginHorizontal: w * 0.15,
    },
    // Normal text, font size 17, Blod
    text2: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'center',
    },
    // Hyperlink text, font size 17, Bold, Underline
    text3: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        marginTop: h * 0.03,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    text3Press: {
        color: '#474BD9',
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        marginTop: h * 0.03,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },

    textInput: {
        height: 50,
        width: w * 0.11,
        backgroundColor: '#FFFFFF',
        fontSize: 30,
        // fontFamily: 'Poppins_700Bold',
        marginTop: h * 0.04,
        marginHorizontal: w * 0.02,
        textAlign: 'center',
    },
    // Big button with purple background
    button: {
        backgroundColor: '#474BD9',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 50,
        height: 48,
        marginTop: h * 0.04,
        marginHorizontal: w * 0.1,
    },
    buttonPress: {
        backgroundColor: '#595ef0',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 50,
        height: 48,
        marginTop: h * 0.04,
        marginHorizontal: w * 0.1,
    },
    // button text
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
    }
});

export default VerifyEmail;
