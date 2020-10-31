import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import VerifyEmail from './components/VerifyEmail';
import FrontPage from './components/FrontPage';
import MainMenuPage from './components/MainMenuPage';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import ResetPassword from './components/ResetPassword';
import AssignTask from './components/AssignTask';
import FreeTraining from './components/FreeTraining';


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
      <Stack.Navigator initialRouteName="FrontPage" screenOptions={{
        headerShown: false
      }}>


        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="FrontPage" component={FrontPage} />
        <Stack.Screen name="MainMenuPage" component={MainMenuPage} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

        <Stack.Screen name="AssignTask" component={AssignTask} />
        <Stack.Screen name="FreeTraining" component={FreeTraining} />
      

      </Stack.Navigator>
    </NavigationContainer>

    // <NavigationContainer ref={navigationRef} onReady={() => {
    //   isReadyRef.current = true;
    // }}>{/* ... */}</NavigationContainer>
  );

}

export default App;
