import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Image, Text , View,TouchableOpacity } from 'react-native';
import {Dimensions} from 'react-native';
import * as Google from 'expo-google-app-auth';

const FrontPage = ({ navigation, route , props }) => {

    const [button1Pressed, set1Pressed] = React.useState();
    const [button2Pressed, set2Pressed] = React.useState();
    const [googleButtonPressed, googlePressed] = React.useState();
    
    function signUp() {
        //按键反馈
        set1Pressed(true)
        setTimeout(()=>{ set1Pressed(false) }, 500);

        //navigate to sign up page
        navigation.navigate('SignUp');
    }

    function testMainMenu() {
        //按键反馈
        set2Pressed(true)
        setTimeout(()=>{ set2Pressed(false) }, 500);

        //test
        navigation.navigate('MainMenuPage');
    }

    function logIn() {
        //按键反馈
        set2Pressed(true)
        setTimeout(()=>{ set2Pressed(false) }, 500);

        navigation.navigate('LogIn')
    }

    async function googleLogIn() {
        //按键反馈
        googlePressed(true)
        setTimeout(()=>{ googlePressed(false) }, 500);

        // First- obtain access token from Expo's Google API
        const config = {
            androidClientId: '138726971256-o06qhopq8758mqb9d2v8jsf9sadobhvq.apps.googleusercontent.com',
            iosClientId: '138726971256-qnoni2qgens814jqkg9aogkdth94vqsn.apps.googleusercontent.com',
            iosStandaloneAppClientId:'138726971256-qnoni2qgens814jqkg9aogkdth94vqsn.apps.googleusercontent.com',
            scopes: ['email']
        };
        const { type, accessToken, user } = await Google.logInAsync(config);
        // console.log(accessToken)

        if (type === 'success') {
            console.log(user)
            let name = user.name;
            let email = user.email;
            let photoUrl = user.photoUrl;


            //注册账号
            //如果系统有该账号的邮箱，不注册
            console.log(email)
            navigation.navigate('MainMenuPage')
            
        }
    }

    
    
    return (
        
        <View style={styles.container}>
            

            <Image source={require("../assets/runningguys-v1.png")} style={styles.img} />
            <Text style={styles.title}>Running Guys</Text>
            <View style={styles.footer}>
                {/* <TouchableOpacity
                    style={styles.button3}
                    onPress={testMainMenu}
                >
                    <Text style={styles.text1}>MainMenu(test)</Text>
                </TouchableOpacity> */}
                <View style={styles.container1}>
                    <TouchableOpacity
                        // style={styles.button2}
                        style={button2Pressed ? styles.button2Press : styles.button2}
                        onPress={logIn}
                    >
                        <Text style={styles.text2}>Log in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        // style={styles.button1}
                        style={button1Pressed ? styles.button1Press : styles.button1}
                        onPress={signUp}
                    >
                        <Text style={styles.text1}>Sign up</Text>
                    </TouchableOpacity>


                </View>
                

                

                <TouchableOpacity
                    // style={styles.button2}
                    style={googleButtonPressed ? styles.googleButtonPressed : styles.googleButton}
                    onPress={googleLogIn}
                >
                    
                    <View style={styles.googleIconBox}>
                        <Image source={require("../assets/google-oauth-icon.png")} style={styles.googleIcon} />
                    </View>
                    <View style={styles.text3Box}>
                        <Text style={styles.text3}>Continue</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
    
}

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    img: {
      width:w,
      height:h,
      resizeMode:'stretch'
    },
    title: {
        position:'absolute',
        top:h*0.18,
        color: '#2A2E43',
        fontSize:41,
        fontFamily: 'Poppins_700Bold'
    },
    footer: {
      position:'absolute',
      bottom:h*0.086
    },
    container1: {
        width:w*0.9,
        flexDirection:'row', 
        justifyContent: 'space-between',
        // width:w*0.75,

    },
    text1: {
        color: '#fff',
        fontSize:20,
        fontFamily: 'Poppins_700Bold'
    
    },
    text2: {
        color: '#2A2E43',
        fontSize:20,
        fontFamily: 'Poppins_700Bold'

    },
    button1: {
        backgroundColor: '#2A2E43',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius:50,
        // width:w*0.75,
        height:h*0.0725,
        marginTop:h*0.023,
        flex:1,
        marginLeft:10,
    },
    button1Press: {
        backgroundColor: '#4F5471',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius:50,
        // width:w*0.75,
        height:h*0.0725,
        marginTop:h*0.023,
        flex:1,
        marginLeft:10,
        transform: [{ scale: 1.1 }],

    },
    button2: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderColor: '#2A2E43',
        borderWidth: 2.5,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius:50,
        marginTop:h*0.023,
        // width:w*0.75,
        height:h*0.0725,
        flex:1,
    },
    button2Press: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderColor: '#2A2E43',
        borderWidth: 2.5,
        alignItems: "center",
        justifyContent: 'center',
        borderRadius:50,
        marginTop:h*0.023,
        // width:w*0.75,
        height:h*0.0725,
        flex:1,
        transform: [{ scale: 1.1 }],
    },
    button3: {
        backgroundColor: '#2A2E43',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius:50,
        // width:w*0.75,
        height:h*0.0725,
        marginTop:h*0.023,
    },
    button3Press: {
        backgroundColor: '#2A2E43',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius:50,
        // width:w*0.75,
        height:h*0.0725,
        marginTop:h*0.023,
        transform: [{ scale: 1.1 }],
    },
    googleButton: {
        flexDirection:'row', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'white',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius:50,
        marginTop:h*0.023,
        width:w*0.9,
        height:h*0.0725

    },
    googleButtonPressed: {
        flexDirection:'row', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        transform: [{ scale: 1.1 }],
        alignItems: "center",
        justifyContent: 'center',
        borderRadius:50,
        marginTop:h*0.023,
        width:w*0.9,
        height:h*0.0725

    },
    text3Box: {
        paddingLeft:5
    },
    text3: {
        color: '#2A2E43',
        fontSize:20,
        fontFamily: 'Poppins_700Bold',
        
    },
    googleIconBox: {
        
    },
    googleIcon: {
      width:35,
      height:35,
      resizeMode:'stretch'
    }
});


export default FrontPage;






//AsyncStorage和HTTP请求供参考
// import AsyncStorage from '@react-native-community/async-storage';

// <!----------Use AsyncStorage to store data locally---------------------!>
// const getData = async () => {
//     try {
//         const value = await AsyncStorage.getItem('@accountID')
//         if(value !== null) {
//             // value previously stored

//             return value;
//         }
//     } catch(e) {
//         // error reading value
//     }
// }

// const storeData = async (id) => {
//     try {
//       await AsyncStorage.setItem('@accountID', id)
//     } catch (e) {
//       // saving error
//     }
// }


// <!----------Send a POST request---------------------!>
//注册账号并保存数据到本地
// fetch('http://www.mobileappproj.ml:5000/accounts', {
//     method: 'POST',
//     headers: new Headers({
//         'Content-Type': 'application/json'
//     }),
//     body: JSON.stringify({
//         pwd: 'Abc123',
//         user_name: 'test@gmail.com',
//     }),
// }).then(res => res.json())
//   .catch(error => console.error('Error:', error))
//   .then((myJson) => {
//     let id = myJson.gen_id;
//     if (id) {
//         storeData(id).then((res)=>Alert.alert(id)); 
//     } else {
//         Alert.alert("account exist");
//     }
//   });

//从本地取出数据并登录
// <!----------Send a POST request---------------------!>
// getData().then(id => {
//     // Send a POST request
//     fetch('http://www.mobileappproj.ml:5000/accounts?id='+id, {
//         method: 'GET',
//         headers: new Headers({
//             'Content-Type': 'application/json'
//         })
//     }).then(res => res.json())
//       .catch(error => console.error('Error:', error))
//       .then((myJson) => {
//         let res = JSON.stringify(myJson)
//         Alert.alert(res);
//       });
// });