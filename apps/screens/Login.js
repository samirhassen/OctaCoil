import React, { useContext, useState} from 'react';
import color from '../misc/color';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import { AudioContext } from '../context/AudioProvider';

const Login = (props) => {
  const [loginForm, setLoginForm] = useState({email: '', password: ''});
 

  const { isLoggedIn, updateState } = useContext(AudioContext);

  const onClickListener = async () => {
    const userDetails = {
      email: loginForm.email,
      password: loginForm.password
    }
    let userData = await AsyncStorage.getItem('user');
    userData = JSON.parse(userData);
    if(userDetails.email.toLowerCase() == userData.email.toLowerCase() && userDetails.password == userData.password) {
      Alert.alert("Alert", "Login Successfull");
      updateState({}, { isLoggedIn: true });
    } else {
      Alert.alert("Alert", "Login Failed");
      updateState({}, { isLoggedIn: false });
    }   
  }

    return (
        <Screen>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Email"
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        onChangeText={(email) => setLoginForm({...loginForm, email: email})} />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={(password) => setLoginForm({...loginForm, password: password})} />
                </View>
                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => onClickListener()}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableHighlight>
            </View>
        </Screen>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:300,
      height:50,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:50,
      marginLeft:-50,
      textAlign: 'center',
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  
  buttonContainer: {
    height:50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom:20,
    width:300,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  }
});


export default Login;