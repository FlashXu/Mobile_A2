import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions, AsyncStorage} from 'react-native';
import { Image, StyleSheet, Text, View, TextInput, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import LogInImage from '../assets/LogInImage.png';
import { MaterialIcons } from '@expo/vector-icons';

class LogIn extends Component {
    constructor(props) {
        super(props)
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = { loginPressed: false, email: '', password: '', isChecked: this.props.isChecked || false,forgotPressed:false, passwordImageState: false, sendingRequest:false };
    }

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

    checkClick() {
        this.setState({
            isChecked: !this.state.isChecked
        });
    }

    passwordImagePress = () => {
        this.setState({
            passwordImageState: !this.state.passwordImageState,
        });
    };

    // Log in  button function
    LogInButton() {
        //按键反馈
        this.setState({ sendingRequest: true });
        if (!this.state.email){ 
            alert('Please enter your email.'); 
        }else if(!this.state.password){
            alert('Please enter your password.');
        }else{
            var url = 'http://www.mobileappproj.ml:5000/accounts/auth';
            var user_name = this.state.email;
            var pwd = this.state.password;
            var data = JSON.stringify({
                "pwd": pwd,
                "user_name": user_name
            });
            var navi = this.navigation.navigate;
            var storeData = async (id) => {
                try {
                    await AsyncStorage.setItem('@accountID', id)
                }catch (e) {
                    console.error(e);
                    alert(e);
                }
            }
            this.bodyOperation(url, data, 'POST').then((results)=>{
                this.setState({ sendingRequest: false });
                if (results.resp == 404){
                    alert('Wrong email or password, please check again!');
                }else{
                    storeData(results.gen_id).then(() => navi('MainMenuPage'));
                }
            }, navi, storeData);
        }
    }

    // transfer to front page
    toFrontPage() {
        this.navigation.navigate('FrontPage');
    }
    // transfer to forgot password page
    toForgotPassword() {
        //按键反馈
        this.setState({forgotPressed:true});
        setTimeout(()=>{ this.setState({forgotPressed:false}); }, 500);
    


        this.navigation.navigate('ForgotPassword');
    }
    // transfer to sign up page
    toSignUp() {
        this.navigation.navigate('SignUp', {});
    }

    render = (element, props) => {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#2A2E43' }}>
                <View style={styles.container}>
                    <Svg onPress={this.toFrontPage.bind(this)} style={styles.backButton} width={21.213} height={21.213} viewBox="0 0 21.213 21.213" {...props}>
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
                    <Text style={styles.bigTitle}>Welcome</Text>
                    <Text style={styles.bigTitle2}>back</Text>
                    <Image source={LogInImage} style={styles.figure} />
               
                    <TextInput
                        style={styles.textInput}
                        placeholder='Email'
                        placeholderTextColor='#FFF'
                        // onChangeText={text => onChangeText(text)}
                        onChangeText={text => this.setState({ email: text })}
                    // value={this.state.email}
                    />

                    <View>
                        <TextInput
                        style={styles.pwdInput}
                        secureTextEntry={!this.state.passwordImageState}
                        placeholder='Password'
                        placeholderTextColor='#FFF'
                        // onChangeText={text => onChangeText(text)}
                        onChangeText={text => this.setState({ password: text })}
                        // value={this.state.email}
                        />

                        <MaterialIcons onPress={this.passwordImagePress}
                        name={this.state.passwordImageState ? "visibility" : "visibility-off"}
                        size={30} color="white"
                        style={styles.passwordImage}/>
                    </View>
                    
                   
                    
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch', marginTop: h * 0.02 }}>
                        {/* <TouchableHighlight underlayColor={'transparent'} onPress={() => this.checkClick()}>
                            <Image source={this.state.isChecked ? checkedImage : checkImage} style={styles.checkImage} />
                        </TouchableHighlight> */}
                        {/* <Text onPress={() => this.checkClick()} style={styles.text5}> Remember me</Text> */}
                        <Text onPress={this.toForgotPassword.bind(this)} style={this.state.forgotPressed?styles.forgotActive:styles.forgot}>Forgot Password?</Text>
                    </View>

                    <TouchableOpacity onPress={this.LogInButton.bind(this)} style={this.state.LogInButton ? styles.buttonPress : styles.button}>
                        <Text style={this.state.sendingRequest ? {display:'none'} : styles.buttonText}>Log in</Text>
                        <ActivityIndicator 
                            style={this.state.sendingRequest ?  styles.buttonText : {display:'none'}}
                            size="large" 
                            color="white" 
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', marginTop: h * 0.03 }}>
                        <Text style={styles.text2}>Don’t have an account? </Text>
                        <Text onPress={this.toSignUp.bind(this)} style={styles.text3}>Sign up</Text>
                    </View>
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
    // password show and hide image style
    passwordImage: {
        position: 'absolute',
        right:w*0.1,
        top:w*0.05
    },
    // check box image style
    checkImage: {
        height: 19,
        width: 19,
        marginLeft: w * 0.1
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
        fontSize: 41,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'left',
        marginHorizontal: w * 0.1,
        marginTop: w * 0.05
    },
    bigTitle2: {
        color: '#fff',
        fontSize: 41,
        fontFamily: 'Poppins_700Bold',
        textAlign: 'left',
        marginHorizontal: w * 0.1,
        marginTop: -15,
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
    },
    // Hyperlink text, font size 17, Bold, Underline
    text3: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        textDecorationLine: 'underline',
    },
    // Hyperlink text, font size 14, Bold, Underline
    text4: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        textDecorationLine: 'underline',
        position: 'absolute',
        right: w * 0.1,
    },

    // normal text, font size 14, Bold
    text5: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',

    },
    // Hyperlink text, font size 14, Bold, Underline
    forgotActive:{
        color: '#474BD9',
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        textDecorationLine: 'underline',
        position: 'absolute',
        right: w * 0.1
    },
    // Hyperlink text, font size 14, Bold, Underline
    forgot: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        textDecorationLine: 'underline',
        position: 'absolute',
        right: w * 0.1
    },

    textInput: {
        height: 40,
        width: w * 0.8,
        color: '#FFFFFF',
        fontSize: 17,
        fontFamily: 'Poppins_300Light',
        borderColor: '#FFFFFF',
        borderBottomWidth: 1,
        marginTop: h * 0.02,
        marginHorizontal: w * 0.1,
        paddingHorizontal: w * 0.04
    },

    pwdInput: {
        height: 40,
        width: w * 0.8,
        color: '#FFFFFF',
        fontSize: 17,
        fontFamily: 'Poppins_300Light',
        borderColor: '#FFFFFF',
        borderBottomWidth: 1,
        marginTop: h * 0.02,
        marginHorizontal: w * 0.1,
        paddingHorizontal: w * 0.04
    },

    textInput2: {
        height: 40,
        width: w * 0.8,
        color: '#FFFFFF',
        fontSize: 17,
        fontFamily: 'Poppins_300Light',
        borderColor: '#FFFFFF',
        borderBottomWidth: 1,
        marginTop: h * 0.02,
        marginHorizontal: w * 0.1,
        paddingHorizontal: w * 0.04,
        position: 'absolute',
    },
    // Big button with purple background
    button: {
        backgroundColor: '#474BD9',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 50,
        height: 48,
        marginTop: h * 0.06,
        marginHorizontal: w * 0.1,

    },
    buttonPress: {
        backgroundColor: '#595ef0',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 50,
        height: 48,
        marginTop: h * 0.06,
        marginHorizontal: w * 0.1,
    },
    // button text
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
    },
});

export default LogIn;