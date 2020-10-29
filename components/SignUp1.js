import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,ActivityIndicator, ScrollView } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { Foundation } from '@expo/vector-icons';


class SignUp extends Component {
    constructor(props) {
        super(props)
        this.navigation = props.navigation;
        this.data = props.route.params;
        this.state = { signUpPressed:false, email:'',gender:'male',sendingRequest:false, pwd:'',pwd2:'' }; 
        
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
  
  signUp() {
    //按键反馈
    this.setState({ sendingRequest: true });

    // Check inputs.
    if (!this.state.firstname){ 
      alert('Please enter your first name.'); 
      this.setState({ sendingRequest: false });
    }else if(!this.state.lastname){
      alert('Please enter your last name.');
      this.setState({ sendingRequest: false });
    }else if(!this.state.email){
      alert('Please enter your email.'); 
      this.setState({ sendingRequest: false });
    }else if(!this.state.pwd){
      alert('Please enter your password.'); 
      this.setState({ sendingRequest: false });
    }else if(this.state.pwd !== this.state.pwd2) {
      alert("Plase make sure passwords match");
      this.setState({ sendingRequest: false });
    }
    
    else{
      // Sign up.
      var url = 'http://www.mobileappproj.ml:5000/accounts';
      var user_name = this.state.email;
      var first_name = this.state.firstname;
      var last_name = this.state.lastname;
      var pwd = this.state.pwd;
      var gender = this.state.gender;
      var data = JSON.stringify({
        "pwd": pwd,
        "user_name": user_name
      });
      var post_func = this.bodyOperation;
      var navi = this.navigation.navigate;
      this.bodyOperation(url, data, 'POST').then((results)=>{
        this.setState({ sendingRequest: false });
        var status = results.resp;
        if (status == 406){
          alert("Duplicate account! Please use another email.");
          alert(first_name);
        }else if(status == 412){
          alert("Invalid account! Please check again.");
        }else{
          alert("Sign up success!");
           // Register succeess then upload the personal info.
          var data = JSON.stringify({
            "_id": results.gen_id,
            "email": user_name,
            "gender": gender,
            "first_name": first_name,
            "last_name": last_name
          });
          var url = 'http://www.mobileappproj.ml:5000/personal_info';
          post_func(url, data, 'POST').then(() => navi('MainMenuPage'));
        }
      }, user_name, first_name, last_name, gender, post_func, navi);
    }
  }

  // Back button function

  toFrontPage() {
    this.navigation.navigate('FrontPage');
  }

  toLogInScreen() {
    this.navigation.navigate('LogIn');
  }

  render= (props) => {
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#2A2E43'}}>
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

        {/* <Image source={forgotPassword1} style={styles.figure} /> */}
        <Text style={styles.bigTitle}>Create Account</Text>
        <TextInput
          style={styles.textInput}
          placeholder='First Name'
          placeholderTextColor='#FFF'
          onChangeText={text => this.setState({firstname:text})}
        />

        <TextInput
          style={styles.textInput}
          placeholder='Last Name'
          placeholderTextColor='#FFF'
          onChangeText={text => this.setState({lastname:text})}
        />

        <View style={{flexDirection:'row',paddingTop:10,
        justifyContent: 'space-between'}}>

          <View style={{flex:1, alignItems: 'center'}} >
              <Foundation name="male-symbol" onPress={()=>this.setState({gender:'male'})} size={50} color={this.state.gender==='male'?'#474BD9':'white'} />
              <Text style={this.state.gender==='male'?styles.labelActive:styles.label}>Male</Text>
          </View>
          
          <View style={{flex:1, alignItems: 'center'}} >
              <Foundation onPress={()=>this.setState({gender:'female'})} name="female-symbol" size={50} color={this.state.gender==='female'?'#474BD9':'white'} />
              <Text style={this.state.gender==='female'?styles.labelActive:styles.label}>Female</Text>
          </View>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder='Email'
          placeholderTextColor='#FFF'
          autoCompleteType='email'
          // onChangeText={text => onChangeText(text)}
          onChangeText={text => this.setState({email:text})}
          // value={this.state.email}
        />
        <TextInput
          style={styles.textInput}
          placeholder='Password'
          placeholderTextColor='#FFF'
          autoCompleteType='password'
          secureTextEntry={true}
          onChangeText={text => this.setState({pwd:text})}
        />

        <TextInput
          style={styles.textInput}
          placeholder='Password Confirmed'
          placeholderTextColor='#FFF'
          autoCompleteType='password'
          secureTextEntry={true}
          onChangeText={text => this.setState({pwd2:text})}
        />
        
        <TouchableOpacity onPress={this.signUp.bind(this)} style={this.state.signUpPressed ? styles.buttonPress : styles.button}>
          <Text style={this.state.sendingRequest ? {display:'none'} : styles.buttonText}>Sign Up</Text>
          <ActivityIndicator 
              style={this.state.sendingRequest ?  styles.buttonText : {display:'none'}}
              size="large" 
              color="white" 
          />
          </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', marginTop: h*0.03 }}>
          <Text style={styles.text2}>Already have accounts? </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  // back button
  backButton: {
    marginTop: h * 0.07,
    marginHorizontal: w * 0.05,
    right: w*0.41
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
    paddingTop: h *0.05
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
    paddingHorizontal: w * 0.04,
    width: w*0.75,
  },
  // Big button with purple background
  button: {
    backgroundColor: '#3A3EE2',
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 50,
    height: 48,
    marginTop: 20,
    paddingHorizontal: 40,
    paddingVertical:20,
  },
  buttonPress: {
    backgroundColor: '#595ef0',
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 50,
    height: 48,
    marginTop: 20,
    paddingHorizontal: 40,
    paddingVertical:20,
  },
    // button text
    buttonText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontFamily: 'Poppins_700Bold'
    },

    male: {
        position:'absolute',
        left: w*0.2
    },
    female: {
        position:'relative',
        left: w*0.2,
        top:h*0.01
    },
    label : {
        color:'#FFFFFF'
    },
    labelActive: {
      color:'white'
    }
  });

export default SignUp;