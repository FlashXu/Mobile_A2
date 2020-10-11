import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native';
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Svg, { G, Circle, Rect, Path } from 'react-native-svg';
import forgotPassword1 from './assets/ForgotPassword1.png';
import forgotPassword2 from './assets/ForgotPassword2.png';
import forgotPassword3 from './assets/ForgotPassword3.png';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import { AppLoading } from 'expo';
import ForgotPassword from './components/ForgotPassword';

// Forgot Password Screen 2 - Verifty email
function VerifyEmailScreen({ navigation, route , props }) {
  console.log(route.params.email)
  // console.log(route.params?.email);

  // Back button function
  function toForgotPasswordScreen() {
    navigation.navigate('ForgotPassword');
  }

  return (
    <View style={styles.container}>
      <Svg onPress={toForgotPasswordScreen} style={styles.backButton} width={21.213} height={21.213} viewBox="0 0 21.213 21.213" {...props}>
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
      <Text style={styles.text1}>Please enter the number code send your email </Text>
     
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', marginTop: 30 }}>
        <Text style={styles.text3}>Resend code</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createStackNavigator();


function App() {
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_900Black,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ForgotPassword" screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        








      </Stack.Navigator>
    </NavigationContainer>
  );

}

export default App;

// Not used yet
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
    marginTop: 60,
    marginHorizontal: 20,
  },
  // figure size
  figure: {
    width: 420,
    height: 300,
    marginTop: 5,
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
    marginTop: 10,
    marginHorizontal: 60,
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
    marginTop: 10,
    marginHorizontal: 40,
    paddingHorizontal: 15
  },
  // Big button with purple background
  button: {
    backgroundColor: '#474BD9',
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 50,
    height: 48,
    marginTop: 40,
    marginHorizontal: 40,
  },
  // button text
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
  },
});