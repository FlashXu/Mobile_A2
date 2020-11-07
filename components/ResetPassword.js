import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { G, Circle, Rect, Path } from 'react-native-svg';
import forgotPassword3 from '../assets/ForgotPassword3.png';
import { MaterialIcons } from '@expo/vector-icons';

class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = { resetPressed: false, passwordOne: '', passwordTwo: '', passwordImageStateOne: false, passwordImageStateTwo: false};
        
    }
    passwordImagePressOne = () => {
        this.setState({
            passwordImageStateOne: !this.state.passwordImageStateOne,
        });
    };
    passwordImagePressTwo = () => {
        this.setState({
            passwordImageStateTwo: !this.state.passwordImageStateTwo,
        });
    };
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

    // Reset password button function
    savePassword() {

        //按键反馈
        this.setState({ resetPressed: true });
        setTimeout(() => { this.setState({ resetPressed: false }); }, 500);


        if (!this.state.passwordOne.length || !this.state.passwordTwo.length) {
            alert('Please enter your new password!');
        }
        else if (this.state.passwordOne != this.state.passwordTwo) {
            alert('The two passwords are not the same!');
        }
        else {
            // 更新密码
            console.log(this.state.passwordOne + this.state.passwordTwo);
            var url = 'http://www.mobileappproj.ml:5000/accounts';
            var data = JSON.stringify({
                "_id":this.data.userId,
                "user_name": this.data.userEmail,
                "pwd": this.state.passwordOne
              }); 
            var navi = this.navigation.navigate;
            this.bodyOperation(url, data, 'PUT').then((results) => {
                if(results.resp == 404){
                    alert('There is no such an account!');
                }else{
                    alert('Having successfully changed the password!');
                    navi('FrontPage');
                }
            }, navi);


            //this.navigation.navigate('VerifyEmail', { email: this.state.email });
        }
    }

    // Back button function
    toLogInScreen() {
        // This function will also be called after reset password success.
        // 成功重置密码后用这个方法返回主界面，如果在请求回掉的函数中找不到this,请把回调函数设置成javascript arrow function
        this.navigation.navigate('FrontPage');
    }

    render = (element, props) => {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#2A2E43' }}>
                <View style={styles.container}>
                    <Svg onPress={this.toLogInScreen.bind(this)} style={styles.backButton} width={21.213} height={21.213} viewBox="0 0 21.213 21.213" {...props}>
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
                    <Image source={forgotPassword3} style={styles.figure} />
                    <Text style={styles.bigTitle}>Reset password!</Text>
                    <Text style={styles.text1}>Please enter a new password</Text>       


                    <View>
                        <TextInput
                        style={styles.textInput}
                        secureTextEntry={!this.state.passwordImageStateOne}
                        placeholder='New password'
                        placeholderTextColor='#FFF'
                        // onChangeText={text => onChangeText(text)}
                        onChangeText={text => this.setState({ passwordOne: text })}
                        // value={this.state.email}
                        />
                    <MaterialIcons onPress={this.passwordImagePressOne}
                            name={this.state.passwordImageStateOne ? "visibility" : "visibility-off"}
                            size={30} color="white"
                            style={styles.passwordImage}/>
                        
                    </View>                
                    

                    <View>
                        <TextInput
                            style={styles.textInput}
                            secureTextEntry={!this.state.passwordImageStateTwo}
                            placeholder='Re-enter password'
                            placeholderTextColor='#FFF'
                            // onChangeText={text => onChangeText(text)}
                            onChangeText={text => this.setState({ passwordTwo: text })}
                        // value={this.state.email}
                        />
                        <MaterialIcons onPress={this.passwordImagePressTwo}
                            name={this.state.passwordImageStateTwo ? "visibility" : "visibility-off"}
                            size={30} color="white"
                            style={styles.passwordImage}/>
                    </View>
                    
                    <TouchableOpacity onPress={this.savePassword.bind(this)} style={this.state.resetPressed ? styles.buttonPress : styles.button}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
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
    //styel of hiding/showing password icon
    passwordImage: {
        position: 'absolute',
        right:w*0.1,
        top:w*0.08
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
    },
    // Hyperlink text, font size 17, Bold, Underline
    text3: {
        color: '#fff',
        fontSize: 17,
        fontFamily: 'Poppins_700Bold',
        textDecorationLine: 'underline',
    },

    textInput: {
        height: 40,
        color: '#FFFFFF',
        fontSize: 17,
        fontFamily: 'Poppins_300Light',
        borderColor: '#FFFFFF',
        borderBottomWidth: 1,
        marginTop: h * 0.04,
        marginHorizontal: w * 0.1,
        paddingHorizontal: w * 0.04
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
    },
});

export default ResetPassword;