import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Svg, { G, Circle, Rect, Path } from 'react-native-svg';
import forgotPassword1 from '../assets/ForgotPassword1.png';


class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = { resetPressed:false, email:'', isLoading:false }; 
        
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

  // Reset password button function
  resetPassword() {
    //按键反馈
    this.setState({resetPressed:true});
    setTimeout(()=>{ this.setState({resetPressed:false})}, 500);
        
    if (!this.state.email.length) { 
      alert('Please enter your email address'); 
    }
    else {
      //start loading animation
      this.setState({isLoading:true},console.log("test1: " + this.state.isLoading))

      var url = 'http://www.mobileappproj.ml:5000/accounts/forget_pwd?user_name=' + this.state.email;
      var user_name = this.state.email;
      var navi = this.navigation.navigate;
      this.GET(url).then((results) => {
        //let loading animation disappear
        this.setState({isLoading:false})

        if(results.resp == 404){
          alert('There is no such an account!');
        }else if(results.resp == 412){
          alert('Invalid email address!');
        }else if(results.resp == 411){
          alert('Server connect error! Please try again.');
        }else{
          alert('Having successsfully sent the verify code, please check your email inbox.');
          navi('VerifyEmail', {email: user_name});
        }
      }, user_name, navi);
    }
  }
  // Back button function
  toLogInScreen() {
    // alert('To Log In Page!');
    this.navigation.navigate('LogIn');
  }

  LoadingOrNotLoadingRenderer(props) {
    const isLoading = props.isLoading;
    const context = props.context;
    if (isLoading) {
      return <ActivityIndicator style={{marginTop: h * 0.04}} size="large" color="white" />;
    } else {
      return <TextInput
      style={styles.textInput}
      placeholder='Email'
      placeholderTextColor='#FFF'
      autoCompleteType='email'
      onChangeText={text => context.setState({email:text})}
      />;
    }
    
  }

  render= (props) => {
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#2A2E43'}}>
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
        <Image source={forgotPassword1} style={styles.figure} />
        <Text style={styles.bigTitle}>Forgot Password?</Text>
        <Text style={styles.text1}>Enter your email address to receive a verification code</Text>
        {/* <TextInput
          style={styles.textInput}
          placeholder='Email'
          placeholderTextColor='#FFF'
          autoCompleteType='email'
          // onChangeText={text => onChangeText(text)}
          onChangeText={text => this.setState({email:text})}
          // value={this.state.email}
        />
        <ActivityIndicator size="large" color="white" /> */}
        <this.LoadingOrNotLoadingRenderer isLoading={this.state.isLoading} context={this} />

        <TouchableOpacity onPress={this.resetPassword.bind(this)} style={this.state.resetPressed ? styles.buttonPress : styles.button}>
          <Text style={styles.buttonText}>Reset password</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', marginTop: h*0.03 }}>
          <Text style={styles.text2}>Remember password? </Text>
          <Text onPress={this.toLogInScreen.bind(this)} style={styles.text3}>Log in</Text>
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

export default ForgotPassword;